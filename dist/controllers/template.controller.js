"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_service_1 = __importDefault(require("../services/template.service"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
/**
 * Template Controller — handles task template HTTP requests.
 */
class TemplateController {
    async createTemplate(req, res, next) {
        try {
            const template = await template_service_1.default.createTemplate(req.body, req.user.id, req.ip || "");
            ApiResponse_1.default.created(res, "Template created successfully", template);
        }
        catch (error) {
            next(error);
        }
    }
    async getTemplates(req, res, next) {
        try {
            const { workspaceId } = req.params;
            const templates = await template_service_1.default.getTemplates(workspaceId);
            ApiResponse_1.default.ok(res, "Templates retrieved", templates);
        }
        catch (error) {
            next(error);
        }
    }
    async createTaskFromTemplate(req, res, next) {
        try {
            const { templateId } = req.params;
            const { projectId } = req.body;
            const task = await template_service_1.default.createTaskFromTemplate(templateId, projectId, req.user.id, req.ip || "");
            ApiResponse_1.default.created(res, "Task created from template", task);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new TemplateController();
