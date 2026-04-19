import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import userRepository from "../repositories/user.repository.js";
import auditLogService from "./auditLog.service.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants.js";

class TaskService {
  /**
   * Create a new task (or subtask if parentTaskId is provided).
   */
  async createTask(data: { title: string; description?: string; projectId: string; assigneeId?: string; parentTaskId?: string; priority?: string; dueDate?: Date | string }, userId: string, ipAddress: string) {
    const { title, description, projectId, assigneeId, parentTaskId, priority, dueDate } = data;

    // Validate project existence
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    // Assignee validation if provided
    if (assigneeId) {
      const user = await userRepository.findById(assigneeId);
      if (!user) throw ApiError.notFound("Assignee not found");
    }

    // Parent Task validation if provided
    if (parentTaskId) {
      const parentTask = await taskRepository.findById(parentTaskId);
      if (!parentTask) throw ApiError.notFound("Parent task not found for subtask");
      
      // Prevent subtask nesting bugs by ensuring parent is in the same project
      if (parentTask.projectId !== projectId) {
        throw ApiError.badRequest("Subtasks must belong to the same project as the parent task");
      }
    }

    const task = await taskRepository.create({
      title,
      description,
      projectId,
      assigneeId,
      parentTaskId,
      priority,
      dueDate,
      createdBy: userId,
    });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.TASK_CREATED,
      entityType: ENTITY_TYPES.TASK,
      entityId: task.id,
      metadata: { projectId, isSubtask: !!parentTaskId },
      ipAddress,
    });

    return task;
  }

  /**
   * Get a task by ID including its dependencies, dependents, and subTasks.
   */
  async getTask(id: string) {
    const task = await taskRepository.findById(id, {
      include: {
        dependencies: true,
        dependents: true,
        subTasks: true,
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    if (!task) throw ApiError.notFound("Task not found");
    return task;
  }

  /**
   * Update task fields.
   */
  async updateTask(id: string, data: any, userId: string, ipAddress: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound("Task not found");

    const updatedTask = await taskRepository.update(id, data);

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.TASK_UPDATED,
      entityType: ENTITY_TYPES.TASK,
      entityId: task.id,
      metadata: { updatedFields: Object.keys(data) },
      ipAddress,
    });

    return updatedTask;
  }

  /**
   * Delete a task.
   */
  async deleteTask(id: string, userId: string, ipAddress: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound("Task not found");

    await taskRepository.delete(id);

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.TASK_DELETED,
      entityType: ENTITY_TYPES.TASK,
      entityId: id,
      ipAddress,
    });

    return true;
  }

  /**
   * Assign a user to a task.
   */
  async assignUser(id: string, assigneeId: string, userId: string, ipAddress: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound("Task not found");

    const user = await userRepository.findById(assigneeId);
    if (!user) throw ApiError.notFound("Assignee user not found");

    const updatedTask = await taskRepository.update(id, { assigneeId });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.TASK_ASSIGNED,
      entityType: ENTITY_TYPES.TASK,
      entityId: task.id,
      metadata: { assigneeId },
      ipAddress,
    });

    return updatedTask;
  }

  /**
   * Move task between projects.
   */
  async moveTask(id: string, newProjectId: string, userId: string, ipAddress: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound("Task not found");

    const newProject = await projectRepository.findById(newProjectId);
    if (!newProject) throw ApiError.notFound("Target project not found");

    // Clear parentTaskId when moving projects to easily maintain acyclic states.
    const updatedTask = await taskRepository.update(id, { 
      projectId: newProjectId, 
      parentTaskId: null 
    });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.TASK_UPDATED, // Generalized action
      entityType: ENTITY_TYPES.TASK,
      entityId: task.id,
      metadata: { movedFromProject: task.projectId, movedToProject: newProjectId },
      ipAddress,
    });

    return updatedTask;
  }
}

export default new TaskService();
