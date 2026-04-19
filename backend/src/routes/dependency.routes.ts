import { Router } from "express";
import dependencyController from "../controllers/dependency.controller.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { addDependencySchema } from "../validators/dependency.validator.js";

const router = Router();

router.use(authenticate);

// Create a structural dependency linkage
router.post("/", validate(addDependencySchema), dependencyController.addDependency);

// Retrieve advanced graph metrics for a specific project
router.get("/project/:projectId/analyze", dependencyController.analyzeGraph);

export default router;
