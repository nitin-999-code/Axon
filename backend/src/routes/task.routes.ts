import { Router } from "express";
import taskController from "../controllers/task.controller.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  moveTaskSchema,
} from "../validators/task.validator.js";

const router = Router();

// Protect all task routes
router.use(authenticate);

// CRUD
router.post("/", validate(createTaskSchema), taskController.createTask);
router.get("/:id", taskController.getTask);
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Task-specific actions
router.patch("/:id/assign", validate(assignTaskSchema), taskController.assignUser);
router.patch("/:id/move", validate(moveTaskSchema), taskController.moveTask);

export default router;
