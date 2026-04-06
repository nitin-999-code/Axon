import dependencyRepository from "../repositories/dependency.repository.js";
import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import auditLogService from "./auditLog.service.js";
import GraphUtil from "../utils/graph.util.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants.js";

class DependencyService {
  /**
   * Add a dependency between two tasks (Task A depends on Task B).
   */
  async addDependency(taskId, dependsOnId, userId, ipAddress) {
    if (taskId === dependsOnId) {
      throw ApiError.badRequest("A task cannot depend on itself");
    }

    const task = await taskRepository.findById(taskId);
    const dependsOnTask = await taskRepository.findById(dependsOnId);

    if (!task || !dependsOnTask) {
      throw ApiError.notFound("One or both tasks not found");
    }

    if (task.projectId !== dependsOnTask.projectId) {
      throw ApiError.badRequest("Cannot add dependencies between tasks in different projects");
    }

    const exists = await dependencyRepository.dependencyExists(taskId, dependsOnId);
    if (exists) {
      throw ApiError.conflict("Dependency already exists");
    }

    // Graph structural validation: Check if inserting this edge creates a cycle
    // We temporally pull the current project layout and inject the new edge
    const { tasks, dependencies } = await dependencyRepository.fetchProjectGraphQuery(task.projectId);
    
    // Inject prospective dependency to run cyclic check
    dependencies.push({ taskId, dependsOnId });
    
    const { adj } = GraphUtil.buildAdjacencyList(tasks, dependencies);
    
    if (GraphUtil.detectCycle(adj)) {
      throw ApiError.badRequest("Adding this dependency would create a circular dependency (Infinite cycle). Operation rejected.");
    }

    // Persist securely
    const newDependency = await dependencyRepository.create({
      taskId,
      dependsOnId,
    });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.DEPENDENCY_ADDED,
      entityType: ENTITY_TYPES.TASK,
      entityId: taskId,
      metadata: { dependsOnId },
      ipAddress,
    });

    return newDependency;
  }

  /**
   * Generate comprehensive dependency metrics for a project.
   */
  async analyzeDependencyGraph(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw ApiError.notFound("Project not found");

    const { tasks, dependencies } = await dependencyRepository.fetchProjectGraphQuery(projectId);

    if (tasks.length === 0) {
      return { message: "No tasks to compute" };
    }

    const { adj, inDegree } = GraphUtil.buildAdjacencyList(tasks, dependencies);

    // Provide a simple mapping matrix for front-end labeling
    const taskMap = {};
    tasks.forEach(t => taskMap[t.id] = t);

    // Calculate topological flow 
    let sortedNodes = [];
    try {
      sortedNodes = GraphUtil.topologicalSort(adj, inDegree);
    } catch (e) {
      return { 
        hasCycleError: true, 
        message: "Severe Integrity Violation: Pre-existing Cycle detected inside the database!" 
      };
    }

    // Compute metrics
    const criticalPathMetrics = GraphUtil.computeCriticalPath(adj, sortedNodes);
    const bottlenecksRaw = GraphUtil.computeBottlenecks(adj);

    // Hydrate IDs with actual Task representations
    const hydratedCriticalPath = criticalPathMetrics.path.map(id => taskMap[id]);
    const hydratedBottlenecks = bottlenecksRaw.map(b => ({
      task: taskMap[b.taskId],
      blockingCount: b.dependentCount
    }));
    const hydratedTopSort = sortedNodes.map(id => taskMap[id]);

    return {
      topologicalOrder: hydratedTopSort,
      criticalPath: {
        length: criticalPathMetrics.length,
        path: hydratedCriticalPath,
      },
      bottlenecks: hydratedBottlenecks
    };
  }
}

export default new DependencyService();
