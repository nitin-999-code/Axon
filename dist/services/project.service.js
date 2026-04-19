"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_repository_js_1 = __importDefault(require("../repositories/project.repository.js"));
const workspace_repository_js_1 = __importDefault(require("../repositories/workspace.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
class ProjectService {
    /**
     * Create a new project in a workspace.
     */
    async createProject(data, userId, ipAddress) {
        const { name, description, workspaceId } = data;
        // Verify workspace exists
        const workspace = await workspace_repository_js_1.default.findById(workspaceId);
        if (!workspace) {
            throw ApiError_js_1.default.notFound("Workspace not found");
        }
        const project = await project_repository_js_1.default.create({
            name,
            description,
            workspaceId,
            createdBy: userId,
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.PROJECT_CREATED,
            entityType: constants_js_1.ENTITY_TYPES.PROJECT,
            entityId: project.id,
            metadata: { workspaceId },
            ipAddress,
        });
        return project;
    }
    /**
     * Get a project by ID.
     */
    async getProject(id) {
        const project = await project_repository_js_1.default.findWithWorkflow(id);
        if (!project) {
            throw ApiError_js_1.default.notFound("Project not found");
        }
        return project;
    }
    /**
     * Update a project.
     */
    async updateProject(id, data, userId, ipAddress) {
        const project = await project_repository_js_1.default.findById(id);
        if (!project) {
            throw ApiError_js_1.default.notFound("Project not found");
        }
        const updatedProject = await project_repository_js_1.default.update(id, data);
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.PROJECT_UPDATED,
            entityType: constants_js_1.ENTITY_TYPES.PROJECT,
            entityId: project.id,
            metadata: { updatedFields: Object.keys(data) },
            ipAddress,
        });
        return updatedProject;
    }
    /**
     * Delete a project.
     */
    async deleteProject(id, userId, ipAddress) {
        const project = await project_repository_js_1.default.findById(id);
        if (!project) {
            throw ApiError_js_1.default.notFound("Project not found");
        }
        await project_repository_js_1.default.delete(id);
        await auditLog_service_js_1.default.logAction({
            userId,
            action: constants_js_1.AUDIT_ACTIONS.PROJECT_DELETED,
            entityType: constants_js_1.ENTITY_TYPES.PROJECT,
            entityId: id,
            ipAddress,
        });
        return true;
    }
}
exports.default = new ProjectService();
