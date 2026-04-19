import approvalRepository from "../repositories/approval.repository";
import taskRepository from "../repositories/task.repository";
import auditLogService from "./auditLog.service";
import ApiError from "../utils/ApiError";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants";

/**
 * Approval Service — manages the approval-based task completion mechanism.
 * Tasks marked with requiresApproval cannot transition to COMPLETED until approved.
 */
class ApprovalService {
  /**
   * Request approval for a task state transition.
   */
  public async requestApproval(
    taskId: string,
    userId: string,
    ipAddress: string
  ): Promise<any> {
    const task = await taskRepository.findById(taskId);
    if (!task) throw ApiError.notFound("Task not found");

    // Check if a pending approval already exists
    const existing = await approvalRepository.findPendingByTask(taskId);
    if (existing) {
      throw ApiError.conflict("A pending approval already exists for this task");
    }

    const approval = await approvalRepository.create({
      taskId,
      requestedBy: userId,
      fromStatus: task.currentStatus,
      toStatus: "COMPLETED",
      status: "PENDING",
    });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.APPROVAL_REQUESTED,
      entityType: ENTITY_TYPES.APPROVAL,
      entityId: approval.id,
      metadata: { taskId, fromStatus: task.currentStatus },
      ipAddress,
    });

    return approval;
  }

  /**
   * Approve a pending task approval request.
   */
  public async approveTask(
    taskId: string,
    userId: string,
    ipAddress: string
  ): Promise<any> {
    const approval = await approvalRepository.findPendingByTask(taskId);
    if (!approval) {
      throw ApiError.notFound("No pending approval found for this task");
    }

    // Self-approval prevention
    if (approval.requestedBy === userId) {
      throw ApiError.forbidden("You cannot approve your own request");
    }

    const resolved = await approvalRepository.resolve(
      approval.id,
      userId,
      "APPROVED"
    );

    // Transition the task to COMPLETED
    await taskRepository.update(taskId, { currentStatus: "COMPLETED" });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.APPROVAL_GRANTED,
      entityType: ENTITY_TYPES.APPROVAL,
      entityId: approval.id,
      metadata: { taskId, approvedStatus: "COMPLETED" },
      ipAddress,
    });

    return resolved;
  }

  /**
   * Reject a pending task approval request.
   */
  public async rejectTask(
    taskId: string,
    userId: string,
    ipAddress: string
  ): Promise<any> {
    const approval = await approvalRepository.findPendingByTask(taskId);
    if (!approval) {
      throw ApiError.notFound("No pending approval found for this task");
    }

    const resolved = await approvalRepository.resolve(
      approval.id,
      userId,
      "REJECTED"
    );

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.APPROVAL_REJECTED,
      entityType: ENTITY_TYPES.APPROVAL,
      entityId: approval.id,
      metadata: { taskId },
      ipAddress,
    });

    return resolved;
  }

  /**
   * Get all approvals for a task.
   */
  public async getApprovalsByTask(taskId: string): Promise<any[]> {
    return approvalRepository.findByTask(taskId);
  }
}

export default new ApprovalService();
