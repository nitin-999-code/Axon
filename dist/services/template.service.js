"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_repository_1 = __importDefault(require("../repositories/template.repository"));
const task_repository_1 = __importDefault(require("../repositories/task.repository"));
const project_repository_1 = __importDefault(require("../repositories/project.repository"));
const auditLog_service_1 = __importDefault(require("./auditLog.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const constants_1 = require("../utils/constants");
/**
 * Template Service — manages reusable task templates.
 * Demonstrates the Template Method behavioral pattern conceptually.
 */
class TemplateService {
    async createTemplate(data, userId, ipAddress) {
        const template = await template_repository_1.default.create({
            name: data.name,
            description: data.description,
            defaultPriority: data.defaultPriority || "MEDIUM",
            defaultPoints: data.defaultPoints || 0,
            workspaceId: data.workspaceId,
            createdBy: userId,
        });
        await auditLog_service_1.default.logAction({
            userId,
            action: "TEMPLATE_CREATED",
            entityType: "TEMPLATE",
            entityId: template.id,
            metadata: { name: template.name },
            ipAddress,
        });
        return template;
    }
    async getTemplates(workspaceId) {
        return template_repository_1.default.findByWorkspace(workspaceId);
    }
    async createTaskFromTemplate(templateId, projectId, userId, ipAddress) {
        const template = await template_repository_1.default.findById(templateId);
        if (!template)
            throw ApiError_1.default.notFound("Template not found");
        const project = await project_repository_1.default.findById(projectId);
        if (!project)
            throw ApiError_1.default.notFound("Project not found");
        const task = await task_repository_1.default.create({
            title: template.name,
            description: template.description,
            projectId,
            priority: template.defaultPriority,
            storyPoints: template.defaultPoints,
            createdBy: userId,
        });
        await auditLog_service_1.default.logAction({
            userId,
            action: constants_1.AUDIT_ACTIONS.TASK_CREATED,
            entityType: constants_1.ENTITY_TYPES.TASK,
            entityId: task.id,
            metadata: { fromTemplate: templateId, templateName: template.name },
            ipAddress,
        });
        return task;
    }
}
exports.default = new TemplateService();
