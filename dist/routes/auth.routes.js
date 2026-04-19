"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = __importDefault(require("../controllers/auth.controller.js"));
const validate_js_1 = __importDefault(require("../middleware/validate.js"));
const auth_js_1 = require("../middleware/auth.js");
const rateLimiter_js_1 = require("../middleware/rateLimiter.js");
const auth_validator_js_1 = require("../validators/auth.validator.js");
const router = (0, express_1.Router)();
router.post("/register", rateLimiter_js_1.authRateLimiter, (0, validate_js_1.default)(auth_validator_js_1.registerSchema), auth_controller_js_1.default.register);
router.post("/login", rateLimiter_js_1.authRateLimiter, (0, validate_js_1.default)(auth_validator_js_1.loginSchema), auth_controller_js_1.default.login);
router.post("/logout", auth_js_1.authenticate, auth_controller_js_1.default.logout);
router.get("/me", auth_js_1.authenticate, auth_controller_js_1.default.getProfile);
exports.default = router;
