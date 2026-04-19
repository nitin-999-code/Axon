"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_repository_js_1 = __importDefault(require("../repositories/workspace.repository.js"));
const user_repository_js_1 = __importDefault(require("../repositories/user.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
const database_js_1 = require("../config/database.js");
/**
 * Workspace Service — handles workspace lifecycle and membership.
 */
class WorkspaceService {
    /**
     * Create a new workspace and assign the creator as OWNER.
     */
    async createWorkspace(data, ownerId, ipAddress) {
        const { name, description } = data;
        // We use Prisma directly for the nested creation to ensure atomic transaction
        // where the workspace and the owner membership are created together.
        const workspace = await database_js_1.prisma.workspace.create({
            data: {
                name,
                description,
                ownerId,
                members: {
                    create: [
                        {
                            userId: ownerId,
                            role: constants_js_1.ROLES.OWNER,
                        },
                    ],
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });
        // Audit log
        await auditLog_service_js_1.default.logAction({
            userId: ownerId,
            action: constants_js_1.AUDIT_ACTIONS.WORKSPACE_CREATED,
            entityType: constants_js_1.ENTITY_TYPES.WORKSPACE,
            entityId: workspace.id,
            ipAddress,
        });
        return workspace;
    }
    /**
     * Add a new member to the workspace.
     * Typically invoked by OWNER or ADMIN.
     */
    async addMember(workspaceId, adminId, data, ipAddress) {
        const { email, role } = data;
        // 1. Check if workspace exists
        const workspace = await workspace_repository_js_1.default.findById(workspaceId);
        if (!workspace) {
            throw ApiError_js_1.default.notFound("Workspace not found");
        }
        // 2. Check if user to be added exists
        const userToAdd = await user_repository_js_1.default.findByEmail(email);
        if (!userToAdd) {
            throw ApiError_js_1.default.notFound("User with provided email not found. They must register first.");
        }
        // 3. Check if user is already a member
        const existingMembership = await database_js_1.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: userToAdd.id,
                },
            },
        });
        if (existingMembership) {
            throw ApiError_js_1.default.conflict("User is already a member of this workspace");
        }
        // 4. Add user to workspace
        const newMember = await database_js_1.prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: userToAdd.id,
                role: (role || constants_js_1.ROLES.MEMBER),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        // 5. Audit log
        await auditLog_service_js_1.default.logAction({
            userId: adminId,
            action: constants_js_1.AUDIT_ACTIONS.MEMBER_ADDED,
            entityType: constants_js_1.ENTITY_TYPES.WORKSPACE,
            entityId: workspaceId,
            metadata: { addedUserId: userToAdd.id, role: newMember.role },
            ipAddress,
        });
        return newMember;
    }
    /**
     * Get all workspaces owned by or joined by the user.
     */
    async getUserWorkspaces(userId) {
        return database_js_1.prisma.workspace.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                _count: { select: { members: true, projects: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    /**
     * Get workspace details including members.
     */
    async getWorkspaceDetails(workspaceId, userId) {
        // Quick authorization check: ensure the querying user is part of the workspace.
        const membership = await database_js_1.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });
        if (!membership) {
            throw ApiError_js_1.default.forbidden("Access denied to this workspace");
        }
        return workspace_repository_js_1.default.findWithMembers(workspaceId);
    }
}
exports.default = new WorkspaceService();
