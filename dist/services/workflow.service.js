"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workflow_repository_js_1 = __importDefault(require("../repositories/workflow.repository.js"));
const project_repository_js_1 = __importDefault(require("../repositories/project.repository.js"));
const task_repository_js_1 = __importDefault(require("../repositories/task.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
const database_js_1 = require("../config/database.js");
class WorkflowService {
    /**
     * Create a base workflow for a project.
     */
    async createWorkflow(projectId, userId, ipAddress) {
        const project = await project_repository_js_1.default.findById(projectId);
        if (!project)
            throw ApiError_js_1.default.notFound("Project not found");
        const workflow = await workflow_repository_js_1.default.create({ projectId });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: "WORKFLOW_CREATED",
            entityType: constants_js_1.ENTITY_TYPES.WORKFLOW,
            entityId: workflow.id,
            metadata: { projectId },
            ipAddress,
        });
        return workflow;
    }
    /**
     * Add a state to a workflow.
     */
    async addState(workflowId, data, userId, ipAddress) {
        const workflow = await workflow_repository_js_1.default.findById(workflowId);
        if (!workflow)
            throw ApiError_js_1.default.notFound("Workflow not found");
        const state = await workflow_repository_js_1.default.createState({
            workflowId,
            ...data,
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: "STATE_ADDED",
            entityType: "STATE",
            entityId: state.id,
            metadata: { workflowId, stateName: data.name },
            ipAddress,
        });
        return state;
    }
    /**
     * Add a transition between two states.
     */
    async addTransition(workflowId, data, userId, ipAddress) {
        const { fromStateId, toStateId, allowedRoles } = data;
        const transition = await workflow_repository_js_1.default.createTransition({
            workflowId,
            fromStateId,
            toStateId,
            allowedRoles,
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: "TRANSITION_ADDED",
            entityType: "TRANSITION",
            entityId: transition.id,
            metadata: { workflowId, fromStateId, toStateId, allowedRoles },
            ipAddress,
        });
        return transition;
    }
    /**
     * Transition a task to a new state with Role Validation.
     */
    async transitionTask(taskId, targetStateName, userId, ipAddress) {
        const task = await task_repository_js_1.default.findById(taskId);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        const workflow = await workflow_repository_js_1.default.findByProject(task.projectId);
        if (!workflow) {
            throw ApiError_js_1.default.badRequest("No workflow configured for this project");
        }
        const currentState = await workflow_repository_js_1.default.findStateByName(workflow.id, task.currentStatus);
        const targetState = await workflow_repository_js_1.default.findStateByName(workflow.id, targetStateName);
        if (!currentState || !targetState) {
            throw ApiError_js_1.default.badRequest("Invalid state configuration in workflow");
        }
        const transition = await workflow_repository_js_1.default.findTransition(workflow.id, currentState.id, targetState.id);
        if (!transition) {
            throw ApiError_js_1.default.forbidden(`No transition path defined from ${task.currentStatus} to ${targetStateName}`);
        }
        // Role-based validation
        if (transition.allowedRoles && transition.allowedRoles.length > 0) {
            const project = await project_repository_js_1.default.findById(task.projectId);
            const membership = await database_js_1.prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: project.workspaceId,
                        userId,
                    },
                },
            });
            if (!membership || !transition.allowedRoles.includes(membership.role)) {
                throw ApiError_js_1.default.forbidden("You do not have the required role to perform this transition");
            }
        }
        // Perform transition
        const updatedTask = await task_repository_js_1.default.updateStatus(taskId, targetStateName);
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.STATUS_CHANGED,
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: taskId,
            metadata: { from: task.currentStatus, to: targetStateName },
            ipAddress,
        });
        return updatedTask;
    }
    async getWorkflowByProject(projectId) {
        const workflow = await workflow_repository_js_1.default.findByProject(projectId);
        if (!workflow)
            throw ApiError_js_1.default.notFound("Workflow not found for this project");
        return workflow;
    }
}
exports.default = new WorkflowService();
