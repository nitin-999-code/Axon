"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_js_1 = __importDefault(require("../controllers/health.controller.js"));
const router = (0, express_1.Router)();
router.get("/", health_controller_js_1.default.getHealth);
router.get("/live", health_controller_js_1.default.getLiveness);
router.get("/ready", health_controller_js_1.default.getReadiness);
exports.default = router;
