"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_service_js_1 = __importDefault(require("../services/project.service.js"));
/**
 * Project Controller — handles API requests for projects.
 */
class ProjectController {
    async createProject(req, res, next) {
        try {
            const project = await project_service_js_1.default.createProject(req.body, req.user.id, req.ip);
            res.status(201).json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    }
    async getProject(req, res, next) {
        try {
            const project = await project_service_js_1.default.getProject(req.params.id);
            res.status(200).json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProject(req, res, next) {
        try {
            const project = await project_service_js_1.default.updateProject(req.params.id, req.body, req.user.id, req.ip);
            res.status(200).json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteProject(req, res, next) {
        try {
            await project_service_js_1.default.deleteProject(req.params.id, req.user.id, req.ip);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ProjectController();
