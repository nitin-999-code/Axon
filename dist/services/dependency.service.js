"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_repository_js_1 = __importDefault(require("../repositories/dependency.repository.js"));
const task_repository_js_1 = __importDefault(require("../repositories/task.repository.js"));
const project_repository_js_1 = __importDefault(require("../repositories/project.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const graph_util_js_1 = __importDefault(require("../utils/graph.util.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
class DependencyService {
    /**
     * Add a dependency between two tasks (Task A depends on Task B).
     */
    async addDependency(taskId, dependsOnId, userId, ipAddress) {
        if (taskId === dependsOnId) {
            throw ApiError_js_1.default.badRequest("A task cannot depend on itself");
        }
        const task = await task_repository_js_1.default.findById(taskId);
        const dependsOnTask = await task_repository_js_1.default.findById(dependsOnId);
        if (!task || !dependsOnTask) {
            throw ApiError_js_1.default.notFound("One or both tasks not found");
        }
        if (task.projectId !== dependsOnTask.projectId) {
            throw ApiError_js_1.default.badRequest("Cannot add dependencies between tasks in different projects");
        }
        const exists = await dependency_repository_js_1.default.dependencyExists(taskId, dependsOnId);
        if (exists) {
            throw ApiError_js_1.default.conflict("Dependency already exists");
        }
        // Graph structural validation: Check if inserting this edge creates a cycle
        // We temporally pull the current project layout and inject the new edge
        const { tasks, dependencies } = await dependency_repository_js_1.default.fetchProjectGraphQuery(task.projectId);
        // Inject prospective dependency to run cyclic check
        dependencies.push({ taskId, dependsOnId });
        const { adj } = graph_util_js_1.default.buildAdjacencyList(tasks, dependencies);
        if (graph_util_js_1.default.detectCycle(adj)) {
            throw ApiError_js_1.default.badRequest("Adding this dependency would create a circular dependency (Infinite cycle). Operation rejected.");
        }
        // Persist securely
        const newDependency = await dependency_repository_js_1.default.create({
            taskId,
            dependsOnId,
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.DEPENDENCY_ADDED,
            entityType: constants_js_1.ENTITY_TYPES.TASK,
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
        const project = await project_repository_js_1.default.findById(projectId);
        if (!project)
            throw ApiError_js_1.default.notFound("Project not found");
        const { tasks, dependencies } = await dependency_repository_js_1.default.fetchProjectGraphQuery(projectId);
        if (tasks.length === 0) {
            return { message: "No tasks to compute" };
        }
        const { adj, inDegree } = graph_util_js_1.default.buildAdjacencyList(tasks, dependencies);
        // Provide a simple mapping matrix for front-end labeling
        const taskMap = {};
        tasks.forEach((t) => taskMap[t.id] = t);
        // Calculate topological flow 
        let sortedNodes = [];
        try {
            sortedNodes = graph_util_js_1.default.topologicalSort(adj, inDegree);
        }
        catch (e) {
            return {
                hasCycleError: true,
                message: "Severe Integrity Violation: Pre-existing Cycle detected inside the database!"
            };
        }
        // Compute metrics
        const criticalPathMetrics = graph_util_js_1.default.computeCriticalPath(adj, sortedNodes);
        const bottlenecksRaw = graph_util_js_1.default.computeBottlenecks(adj);
        // Hydrate IDs with actual Task representations
        const hydratedCriticalPath = criticalPathMetrics.path.map((id) => taskMap[id]);
        const hydratedBottlenecks = bottlenecksRaw.map((b) => ({
            task: taskMap[b.taskId],
            blockingCount: b.dependentCount
        }));
        const hydratedTopSort = sortedNodes.map((id) => taskMap[id]);
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
exports.default = new DependencyService();
