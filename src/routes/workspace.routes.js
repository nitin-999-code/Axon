import { Router } from "express";
import workspaceController from "../controllers/workspace.controller.js";
import validate from "../middleware/validate.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createWorkspaceSchema, addMemberSchema } from "../validators/workspace.validator.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

// Retrieve all workspaces for the authenticated user
router.get("/", authenticate, workspaceController.getUserWorkspaces);

// Create a new workspace
router.post(
  "/",
  authenticate,
  validate(createWorkspaceSchema),
  workspaceController.createWorkspace
);

// Get specific workspace details (must be a member)
router.get("/:workspaceId", authenticate, workspaceController.getWorkspaceDetails);

// Add a new member to the workspace
// Only OWNER and ADMIN can add members
router.post(
  "/:workspaceId/members",
  authenticate,
  authorize(ROLES.OWNER, ROLES.ADMIN),
  validate(addMemberSchema),
  workspaceController.addMember
);

export default router;
