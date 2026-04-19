import workflowRepository from "../repositories/workflow.repository.js";
import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import auditLogService from "./auditLog.service.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants.js";
import { prisma } from "../config/database.js";

class WorkflowService {
  /**
   * Create a base workflow for a project.
   */
  async createWorkflow(projectId: any, userId: any, ipAddress: any) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw ApiError.notFound("Project not found");

    const workflow = await workflowRepository.create({ projectId });

    await auditLogService.logAction({
      userId,
      action: "WORKFLOW_CREATED",
      entityType: ENTITY_TYPES.WORKFLOW,
      entityId: workflow.id,
      metadata: { projectId },
      ipAddress,
    });

    return workflow;
  }

  /**
   * Add a state to a workflow.
   */
  async addState(workflowId: any, data: any, userId: any, ipAddress: any) {
    const workflow = await workflowRepository.findById(workflowId);
    if (!workflow) throw ApiError.notFound("Workflow not found");

    const state = await workflowRepository.createState({
      workflowId,
      ...data,
    });

    await auditLogService.logAction({
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
  async addTransition(workflowId: any, data: any, userId: any, ipAddress: any) {
    const { fromStateId, toStateId, allowedRoles } = data;

    const transition = await workflowRepository.createTransition({
      workflowId,
      fromStateId,
      toStateId,
      allowedRoles,
    });

    await auditLogService.logAction({
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
  async transitionTask(taskId: any, targetStateName: any, userId: any, ipAddress: any) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw ApiError.notFound("Task not found");

    const workflow = await workflowRepository.findByProject(task.projectId);
    if (!workflow) {
      throw ApiError.badRequest("No workflow configured for this project");
    }

    const currentState = await workflowRepository.findStateByName(
      workflow.id,
      task.currentStatus
    );
    const targetState = await workflowRepository.findStateByName(
      workflow.id,
      targetStateName
    );

    if (!currentState || !targetState) {
      throw ApiError.badRequest("Invalid state configuration in workflow");
    }

    const transition = await workflowRepository.findTransition(
      workflow.id,
      currentState.id,
      targetState.id
    );

    if (!transition) {
      throw ApiError.forbidden(`No transition path defined from ${task.currentStatus} to ${targetStateName}`);
    }

    // Role-based validation
    if (transition.allowedRoles && transition.allowedRoles.length > 0) {
      const project = await projectRepository.findById(task.projectId);
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: project.workspaceId,
            userId,
          },
        },
      });

      if (!membership || !transition.allowedRoles.includes(membership.role)) {
        throw ApiError.forbidden("You do not have the required role to perform this transition");
      }
    }

    // Perform transition
    const updatedTask = await taskRepository.updateStatus(taskId, targetStateName);

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.STATUS_CHANGED,
      entityType: ENTITY_TYPES.TASK,
      entityId: taskId,
      metadata: { from: task.currentStatus, to: targetStateName },
      ipAddress,
    });

    return updatedTask;
  }

  async getWorkflowByProject(projectId: any) {
    const workflow = await workflowRepository.findByProject(projectId);
    if (!workflow) throw ApiError.notFound("Workflow not found for this project");
    return workflow;
  }
}

export default new WorkflowService();
