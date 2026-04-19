"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_service_js_1 = __importDefault(require("../services/workspace.service.js"));
/**
 * Workspace Controller — translates HTTP requests into service calls
 * for Workspace management.
 */
class WorkspaceController {
    /**
     * Create a new workspace.
     */
    async createWorkspace(req, res, next) {
        try {
            const { name, description } = req.body;
            const ownerId = req.user.id;
            const ipAddress = req.ip;
            const workspace = await workspace_service_js_1.default.createWorkspace({ name, description }, ownerId, ipAddress);
            res.status(201).json({
                success: true,
                data: workspace,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add a member to a workspace.
     */
    async addMember(req, res, next) {
        try {
            const { workspaceId } = req.params;
            const { email, role } = req.body;
            const adminId = req.user.id;
            const ipAddress = req.ip;
            const member = await workspace_service_js_1.default.addMember(workspaceId, adminId, { email, role }, ipAddress);
            res.status(200).json({
                success: true,
                message: "Member added successfully",
                data: member,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all workspaces for the authenticated user.
     */
    async getUserWorkspaces(req, res, next) {
        try {
            const userId = req.user.id;
            const workspaces = await workspace_service_js_1.default.getUserWorkspaces(userId);
            res.status(200).json({
                success: true,
                data: workspaces,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get a specific workspace's details.
     */
    async getWorkspaceDetails(req, res, next) {
        try {
            const { workspaceId } = req.params;
            const userId = req.user.id;
            const workspace = await workspace_service_js_1.default.getWorkspaceDetails(workspaceId, userId);
            res.status(200).json({
                success: true,
                data: workspace,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new WorkspaceController();
