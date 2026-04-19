"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sprint_service_js_1 = __importDefault(require("../services/sprint.service.js"));
/**
 * Sprint Controller — routing analytics and notifications to HTTP Layer.
 */
class SprintController {
    async createSprint(req, res, next) {
        try {
            const sprint = await sprint_service_js_1.default.createSprint(req.body, req.user.id, req.ip);
            res.status(201).json({ success: true, data: sprint });
        }
        catch (error) {
            next(error);
        }
    }
    async assignTask(req, res, next) {
        try {
            const { taskId, sprintId } = req.body;
            const updatedTask = await sprint_service_js_1.default.assignTaskToSprint(taskId, sprintId, req.user.id, req.ip);
            res.status(200).json({ success: true, data: updatedTask });
        }
        catch (error) {
            next(error);
        }
    }
    async getVelocity(req, res, next) {
        try {
            const { sprintId } = req.params;
            const velocityMetrics = await sprint_service_js_1.default.computeVelocity(sprintId);
            res.status(200).json({ success: true, data: velocityMetrics });
        }
        catch (error) {
            next(error);
        }
    }
    async getBurndown(req, res, next) {
        try {
            const { sprintId } = req.params;
            const burndown = await sprint_service_js_1.default.generateBurndownData(sprintId);
            res.status(200).json({ success: true, data: burndown });
        }
        catch (error) {
            next(error);
        }
    }
    async runOverdueDetector(req, res, next) {
        try {
            const { sprintId } = req.params;
            const result = await sprint_service_js_1.default.detectOverdueTasks(sprintId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new SprintController();
