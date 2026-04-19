"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_js_1 = __importDefault(require("../controllers/task.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const task_validator_js_1 = require("../validators/task.validator.js");
const router = (0, express_1.Router)();
// Protect all task routes
router.use(auth_js_1.authenticate);
// CRUD
router.post("/", (0, validate_js_1.default)(task_validator_js_1.createTaskSchema), task_controller_js_1.default.createTask);
router.get("/:id", task_controller_js_1.default.getTask);
router.put("/:id", (0, validate_js_1.default)(task_validator_js_1.updateTaskSchema), task_controller_js_1.default.updateTask);
router.delete("/:id", task_controller_js_1.default.deleteTask);
// Task-specific actions
router.patch("/:id/assign", (0, validate_js_1.default)(task_validator_js_1.assignTaskSchema), task_controller_js_1.default.assignUser);
router.patch("/:id/move", (0, validate_js_1.default)(task_validator_js_1.moveTaskSchema), task_controller_js_1.default.moveTask);
exports.default = router;
