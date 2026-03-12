import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = Router();

// Protect all project routes
router.use(authenticate);

// Note: To implement strict RBAC, you can add workspace authorization middleware here.
// Example: authorize(ROLES.OWNER, ROLES.ADMIN) based on the workspaceId associated with the project.
// This example leaves it open to authenticated users for structural simplicity.

router.post("/", validate(createProjectSchema), projectController.createProject);
router.get("/:id", projectController.getProject);
router.put("/:id", validate(updateProjectSchema), projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;
