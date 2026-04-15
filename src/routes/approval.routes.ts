import { Router } from "express";
import approvalController from "../controllers/approval.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/:taskId/request-approval", approvalController.requestApproval);
router.post("/:taskId/approve", approvalController.approveTask);
router.post("/:taskId/reject", approvalController.rejectTask);
router.get("/:taskId", approvalController.getApprovals);

export default router;
