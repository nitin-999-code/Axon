import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

// ─── Route Registration ────────────────────────
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Future route modules:
// router.use("/workspaces", workspaceRoutes);
// router.use("/projects", projectRoutes);
// router.use("/tasks", taskRoutes);

export default router;
