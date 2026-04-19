"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workflow_controller_js_1 = __importDefault(require("../controllers/workflow.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const workflow_validator_js_1 = require("../validators/workflow.validator.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
// Workflow config endpoints
router.post("/", (0, validate_js_1.default)(workflow_validator_js_1.createWorkflowSchema), workflow_controller_js_1.default.createWorkflow);
router.get("/project/:projectId", workflow_controller_js_1.default.getWorkflow);
router.post("/:workflowId/states", (0, validate_js_1.default)(workflow_validator_js_1.createStateSchema), workflow_controller_js_1.default.addState);
router.post("/:workflowId/transitions", (0, validate_js_1.default)(workflow_validator_js_1.createTransitionSchema), workflow_controller_js_1.default.addTransition);
// Task execution endpoint
router.post("/tasks/:taskId/transition", (0, validate_js_1.default)(workflow_validator_js_1.transitionTaskSchema), workflow_controller_js_1.default.transitionTask);
exports.default = router;
