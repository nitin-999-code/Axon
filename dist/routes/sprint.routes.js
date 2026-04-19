"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sprint_controller_js_1 = __importDefault(require("../controllers/sprint.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const sprint_validator_js_1 = require("../validators/sprint.validator.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
// Creation
router.post("/", (0, validate_js_1.default)(sprint_validator_js_1.createSprintSchema), sprint_controller_js_1.default.createSprint);
router.post("/assign", (0, validate_js_1.default)(sprint_validator_js_1.assignTaskToSprintSchema), sprint_controller_js_1.default.assignTask);
// Analytics
router.get("/:sprintId/velocity", sprint_controller_js_1.default.getVelocity);
router.get("/:sprintId/burndown", sprint_controller_js_1.default.getBurndown);
// Side Effects triggers (Usually run via Cron in production, exposed as endpoint here)
router.post("/:sprintId/detect-overdue", sprint_controller_js_1.default.runOverdueDetector);
exports.default = router;
