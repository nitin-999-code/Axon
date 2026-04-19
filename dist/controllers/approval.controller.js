"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const approval_service_1 = __importDefault(require("../services/approval.service"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
/**
 * Approval Controller — handles approval workflow HTTP requests.
 */
class ApprovalController {
    async requestApproval(req, res, next) {
        try {
            const { taskId } = req.params;
            const approval = await approval_service_1.default.requestApproval(taskId, req.user.id, req.ip || "");
            ApiResponse_1.default.created(res, "Approval requested successfully", approval);
        }
        catch (error) {
            next(error);
        }
    }
    async approveTask(req, res, next) {
        try {
            const { taskId } = req.params;
            const result = await approval_service_1.default.approveTask(taskId, req.user.id, req.ip || "");
            ApiResponse_1.default.ok(res, "Task approved successfully", result);
        }
        catch (error) {
            next(error);
        }
    }
    async rejectTask(req, res, next) {
        try {
            const { taskId } = req.params;
            const result = await approval_service_1.default.rejectTask(taskId, req.user.id, req.ip || "");
            ApiResponse_1.default.ok(res, "Task rejected", result);
        }
        catch (error) {
            next(error);
        }
    }
    async getApprovals(req, res, next) {
        try {
            const { taskId } = req.params;
            const approvals = await approval_service_1.default.getApprovalsByTask(taskId);
            ApiResponse_1.default.ok(res, "Approvals retrieved", approvals);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ApprovalController();
