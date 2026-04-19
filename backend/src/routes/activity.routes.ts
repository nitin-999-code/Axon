import { Router } from "express";
import activityController from "../controllers/activity.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/project/:projectId", activityController.getProjectFeed);

export default router;
