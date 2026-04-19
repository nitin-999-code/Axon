import { Router } from "express";
import workflowController from "../controllers/workflow.controller.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import {
  createWorkflowSchema,
  createStateSchema,
  createTransitionSchema,
  transitionTaskSchema,
} from "../validators/workflow.validator.js";

const router = Router();

router.use(authenticate);

// Workflow config endpoints
router.post("/", validate(createWorkflowSchema), workflowController.createWorkflow);
router.get("/project/:projectId", workflowController.getWorkflow);

router.post("/:workflowId/states", validate(createStateSchema), workflowController.addState);
router.post("/:workflowId/transitions", validate(createTransitionSchema), workflowController.addTransition);

// Task execution endpoint
router.post("/tasks/:taskId/transition", validate(transitionTaskSchema), workflowController.transitionTask);

export default router;
