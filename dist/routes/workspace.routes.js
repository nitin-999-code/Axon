"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspace_controller_js_1 = __importDefault(require("../controllers/workspace.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const workspace_validator_js_1 = require("../validators/workspace.validator.js");
const constants_js_1 = require("../utils/constants.js");
const router = (0, express_1.Router)();
// Retrieve all workspaces for the authenticated user
router.get("/", auth_js_1.authenticate, workspace_controller_js_1.default.getUserWorkspaces);
// Create a new workspace
router.post("/", auth_js_1.authenticate, (0, validate_js_1.default)(workspace_validator_js_1.createWorkspaceSchema), workspace_controller_js_1.default.createWorkspace);
// Get specific workspace details (must be a member)
router.get("/:workspaceId", auth_js_1.authenticate, workspace_controller_js_1.default.getWorkspaceDetails);
// Add a new member to the workspace
// Only OWNER and ADMIN can add members
router.post("/:workspaceId/members", auth_js_1.authenticate, (0, auth_js_1.authorize)(constants_js_1.ROLES.OWNER, constants_js_1.ROLES.ADMIN), (0, validate_js_1.default)(workspace_validator_js_1.addMemberSchema), workspace_controller_js_1.default.addMember);
exports.default = router;
