import { Request, Response, NextFunction } from "express";
import approvalService from "../services/approval.service";
import ApiResponse from "../utils/ApiResponse";

/**
 * Approval Controller — handles approval workflow HTTP requests.
 */
class ApprovalController {
  public async requestApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const approval = await approvalService.requestApproval(
        taskId,
        (req as any).user.id,
        req.ip || ""
      );
      ApiResponse.created(res, "Approval requested successfully", approval);
    } catch (error) {
      next(error);
    }
  }

  public async approveTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const result = await approvalService.approveTask(
        taskId,
        (req as any).user.id,
        req.ip || ""
      );
      ApiResponse.ok(res, "Task approved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  public async rejectTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const result = await approvalService.rejectTask(
        taskId,
        (req as any).user.id,
        req.ip || ""
      );
      ApiResponse.ok(res, "Task rejected", result);
    } catch (error) {
      next(error);
    }
  }

  public async getApprovals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const approvals = await approvalService.getApprovalsByTask(taskId);
      ApiResponse.ok(res, "Approvals retrieved", approvals);
    } catch (error) {
      next(error);
    }
  }
}

export default new ApprovalController();
