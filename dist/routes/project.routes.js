"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_js_1 = __importDefault(require("../controllers/project.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const project_validator_js_1 = require("../validators/project.validator.js");
const router = (0, express_1.Router)();
// Protect all project routes
router.use(auth_js_1.authenticate);
// Note: To implement strict RBAC, you can add workspace authorization middleware here.
// Example: authorize(ROLES.OWNER, ROLES.ADMIN) based on the workspaceId associated with the project.
// This example leaves it open to authenticated users for structural simplicity.
router.post("/", (0, validate_js_1.default)(project_validator_js_1.createProjectSchema), project_controller_js_1.default.createProject);
router.get("/:id", project_controller_js_1.default.getProject);
router.put("/:id", (0, validate_js_1.default)(project_validator_js_1.updateProjectSchema), project_controller_js_1.default.updateProject);
router.delete("/:id", project_controller_js_1.default.deleteProject);
exports.default = router;
