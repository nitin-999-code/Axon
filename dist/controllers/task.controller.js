"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_js_1 = __importDefault(require("../services/task.service.js"));
/**
 * Task Controller — API interface for Task related requests.
 */
class TaskController {
    async createTask(req, res, next) {
        try {
            const task = await task_service_js_1.default.createTask(req.body, req.user.id, req.ip);
            res.status(201).json({ success: true, data: task });
        }
        catch (error) {
            next(error);
        }
    }
    async getTask(req, res, next) {
        try {
            const task = await task_service_js_1.default.getTask(req.params.id);
            res.status(200).json({ success: true, data: task });
        }
        catch (error) {
            next(error);
        }
    }
    async updateTask(req, res, next) {
        try {
            const task = await task_service_js_1.default.updateTask(req.params.id, req.body, req.user.id, req.ip);
            res.status(200).json({ success: true, data: task });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteTask(req, res, next) {
        try {
            await task_service_js_1.default.deleteTask(req.params.id, req.user.id, req.ip);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async assignUser(req, res, next) {
        try {
            const { assigneeId } = req.body;
            const task = await task_service_js_1.default.assignUser(req.params.id, assigneeId, req.user.id, req.ip);
            res.status(200).json({ success: true, data: task });
        }
        catch (error) {
            next(error);
        }
    }
    async moveTask(req, res, next) {
        try {
            const { newProjectId } = req.body;
            const task = await task_service_js_1.default.moveTask(req.params.id, newProjectId, req.user.id, req.ip);
            res.status(200).json({ success: true, data: task });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new TaskController();
