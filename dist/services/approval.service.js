"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const approval_repository_1 = __importDefault(require("../repositories/approval.repository"));
const task_repository_1 = __importDefault(require("../repositories/task.repository"));
const auditLog_service_1 = __importDefault(require("./auditLog.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const constants_1 = require("../utils/constants");
/**
 * Approval Service — manages the approval-based task completion mechanism.
 * Tasks marked with requiresApproval cannot transition to COMPLETED until approved.
 */
class ApprovalService {
    /**
     * Request approval for a task state transition.
     */
    async requestApproval(taskId, userId, ipAddress) {
        const task = await task_repository_1.default.findById(taskId);
        if (!task)
            throw ApiError_1.default.notFound("Task not found");
        // Check if a pending approval already exists
        const existing = await approval_repository_1.default.findPendingByTask(taskId);
        if (existing) {
            throw ApiError_1.default.conflict("A pending approval already exists for this task");
        }
        const approval = await approval_repository_1.default.create({
            taskId,
            requestedBy: userId,
            fromStatus: task.currentStatus,
            toStatus: "COMPLETED",
            status: "PENDING",
        });
        await auditLog_service_1.default.logAction({
            userId,
            action: constants_1.AUDIT_ACTIONS.APPROVAL_REQUESTED,
            entityType: constants_1.ENTITY_TYPES.APPROVAL,
            entityId: approval.id,
            metadata: { taskId, fromStatus: task.currentStatus },
            ipAddress,
        });
        return approval;
    }
    /**
     * Approve a pending task approval request.
     */
    async approveTask(taskId, userId, ipAddress) {
        const approval = await approval_repository_1.default.findPendingByTask(taskId);
        if (!approval) {
            throw ApiError_1.default.notFound("No pending approval found for this task");
        }
        // Self-approval prevention
        if (approval.requestedBy === userId) {
            throw ApiError_1.default.forbidden("You cannot approve your own request");
        }
        const resolved = await approval_repository_1.default.resolve(approval.id, userId, "APPROVED");
        // Transition the task to COMPLETED
        await task_repository_1.default.update(taskId, { currentStatus: "COMPLETED" });
        await auditLog_service_1.default.logAction({
            userId,
            action: constants_1.AUDIT_ACTIONS.APPROVAL_GRANTED,
            entityType: constants_1.ENTITY_TYPES.APPROVAL,
            entityId: approval.id,
            metadata: { taskId, approvedStatus: "COMPLETED" },
            ipAddress,
        });
        return resolved;
    }
    /**
     * Reject a pending task approval request.
     */
    async rejectTask(taskId, userId, ipAddress) {
        const approval = await approval_repository_1.default.findPendingByTask(taskId);
        if (!approval) {
            throw ApiError_1.default.notFound("No pending approval found for this task");
        }
        const resolved = await approval_repository_1.default.resolve(approval.id, userId, "REJECTED");
        await auditLog_service_1.default.logAction({
            userId,
            action: constants_1.AUDIT_ACTIONS.APPROVAL_REJECTED,
            entityType: constants_1.ENTITY_TYPES.APPROVAL,
            entityId: approval.id,
            metadata: { taskId },
            ipAddress,
        });
        return resolved;
    }
    /**
     * Get all approvals for a task.
     */
    async getApprovalsByTask(taskId) {
        return approval_repository_1.default.findByTask(taskId);
    }
}
exports.default = new ApprovalService();
