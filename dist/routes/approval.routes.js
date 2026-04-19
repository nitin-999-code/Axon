"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const approval_controller_1 = __importDefault(require("../controllers/approval.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post("/:taskId/request-approval", approval_controller_1.default.requestApproval);
router.post("/:taskId/approve", approval_controller_1.default.approveTask);
router.post("/:taskId/reject", approval_controller_1.default.rejectTask);
router.get("/:taskId", approval_controller_1.default.getApprovals);
exports.default = router;
