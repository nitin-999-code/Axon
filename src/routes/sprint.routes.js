import { Router } from "express";
import sprintController from "../controllers/sprint.controller.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { createSprintSchema, assignTaskToSprintSchema } from "../validators/sprint.validator.js";

const router = Router();

router.use(authenticate);

// Creation
router.post("/", validate(createSprintSchema), sprintController.createSprint);
router.post("/assign", validate(assignTaskToSprintSchema), sprintController.assignTask);

// Analytics
router.get("/:sprintId/velocity", sprintController.getVelocity);
router.get("/:sprintId/burndown", sprintController.getBurndown);

// Side Effects triggers (Usually run via Cron in production, exposed as endpoint here)
router.post("/:sprintId/detect-overdue", sprintController.runOverdueDetector);

export default router;
