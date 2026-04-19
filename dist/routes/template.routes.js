"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const template_controller_1 = __importDefault(require("../controllers/template.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post("/", template_controller_1.default.createTemplate);
router.get("/workspace/:workspaceId", template_controller_1.default.getTemplates);
router.post("/:templateId/create-task", template_controller_1.default.createTaskFromTemplate);
exports.default = router;
