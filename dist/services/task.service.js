"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_repository_js_1 = __importDefault(require("../repositories/task.repository.js"));
const project_repository_js_1 = __importDefault(require("../repositories/project.repository.js"));
const user_repository_js_1 = __importDefault(require("../repositories/user.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
class TaskService {
    /**
     * Create a new task (or subtask if parentTaskId is provided).
     */
    async createTask(data, userId, ipAddress) {
        const { title, description, projectId, assigneeId, parentTaskId, priority, dueDate } = data;
        // Validate project existence
        const project = await project_repository_js_1.default.findById(projectId);
        if (!project) {
            throw ApiError_js_1.default.notFound("Project not found");
        }
        // Assignee validation if provided
        if (assigneeId) {
            const user = await user_repository_js_1.default.findById(assigneeId);
            if (!user)
                throw ApiError_js_1.default.notFound("Assignee not found");
        }
        // Parent Task validation if provided
        if (parentTaskId) {
            const parentTask = await task_repository_js_1.default.findById(parentTaskId);
            if (!parentTask)
                throw ApiError_js_1.default.notFound("Parent task not found for subtask");
            // Prevent subtask nesting bugs by ensuring parent is in the same project
            if (parentTask.projectId !== projectId) {
                throw ApiError_js_1.default.badRequest("Subtasks must belong to the same project as the parent task");
            }
        }
        const task = await task_repository_js_1.default.create({
            title,
            description,
            projectId,
            assigneeId,
            parentTaskId,
            priority,
            dueDate,
            createdBy: userId,
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.TASK_CREATED,
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: task.id,
            metadata: { projectId, isSubtask: !!parentTaskId },
            ipAddress,
        });
        return task;
    }
    /**
     * Get a task by ID including its dependencies, dependents, and subTasks.
     */
    async getTask(id) {
        const task = await task_repository_js_1.default.findById(id, {
            include: {
                dependencies: true,
                dependents: true,
                subTasks: true,
                assignee: { select: { id: true, name: true, email: true } }
            }
        });
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        return task;
    }
    /**
     * Update task fields.
     */
    async updateTask(id, data, userId, ipAddress) {
        const task = await task_repository_js_1.default.findById(id);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        const updatedTask = await task_repository_js_1.default.update(id, data);
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.TASK_UPDATED,
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: task.id,
            metadata: { updatedFields: Object.keys(data) },
            ipAddress,
        });
        return updatedTask;
    }
    /**
     * Delete a task.
     */
    async deleteTask(id, userId, ipAddress) {
        const task = await task_repository_js_1.default.findById(id);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        await task_repository_js_1.default.delete(id);
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.TASK_DELETED,
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: id,
            ipAddress,
        });
        return true;
    }
    /**
     * Assign a user to a task.
     */
    async assignUser(id, assigneeId, userId, ipAddress) {
        const task = await task_repository_js_1.default.findById(id);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        const user = await user_repository_js_1.default.findById(assigneeId);
        if (!user)
            throw ApiError_js_1.default.notFound("Assignee user not found");
        const updatedTask = await task_repository_js_1.default.update(id, { assigneeId });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.TASK_ASSIGNED,
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: task.id,
            metadata: { assigneeId },
            ipAddress,
        });
        return updatedTask;
    }
    /**
     * Move task between projects.
     */
    async moveTask(id, newProjectId, userId, ipAddress) {
        const task = await task_repository_js_1.default.findById(id);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        const newProject = await project_repository_js_1.default.findById(newProjectId);
        if (!newProject)
            throw ApiError_js_1.default.notFound("Target project not found");
        // Clear parentTaskId when moving projects to easily maintain acyclic states.
        const updatedTask = await task_repository_js_1.default.update(id, {
            projectId: newProjectId,
            parentTaskId: null
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.TASK_UPDATED, // Generalized action
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: task.id,
            metadata: { movedFromProject: task.projectId, movedToProject: newProjectId },
            ipAddress,
        });
        return updatedTask;
    }
}
exports.default = new TaskService();
