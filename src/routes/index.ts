import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import workspaceRoutes from "./workspace.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";
import workflowRoutes from "./workflow.routes";
import dependencyRoutes from "./dependency.routes";
import sprintRoutes from "./sprint.routes";
import commentRoutes from "./comment.routes";
import activityRoutes from "./activity.routes";
import approvalRoutes from "./approval.routes";
import templateRoutes from "./template.routes";

const router = Router();

// ─── Route Registration ────────────────────────
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/workflows", workflowRoutes);
router.use("/dependencies", dependencyRoutes);
router.use("/sprints", sprintRoutes);
router.use("/comments", commentRoutes);
router.use("/activity", activityRoutes);
router.use("/approvals", approvalRoutes);
router.use("/templates", templateRoutes);

export default router;
