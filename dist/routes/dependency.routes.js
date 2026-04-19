"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependency_controller_js_1 = __importDefault(require("../controllers/dependency.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const dependency_validator_js_1 = require("../validators/dependency.validator.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
// Create a structural dependency linkage
router.post("/", (0, validate_js_1.default)(dependency_validator_js_1.addDependencySchema), dependency_controller_js_1.default.addDependency);
// Retrieve advanced graph metrics for a specific project
router.get("/project/:projectId/analyze", dependency_controller_js_1.default.analyzeGraph);
exports.default = router;
