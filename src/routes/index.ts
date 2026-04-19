import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import workspaceRoutes from "./workspace.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import workflowRoutes from "./workflow.routes.js";
import dependencyRoutes from "./dependency.routes.js";
import sprintRoutes from "./sprint.routes.js";
import commentRoutes from "./comment.routes.js";
import activityRoutes from "./activity.routes.js";

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

export default router;
