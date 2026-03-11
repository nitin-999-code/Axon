import workspaceRepository from "../repositories/workspace.repository.js";
import userRepository from "../repositories/user.repository.js";
import auditLogService from "./auditLog.service.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES, ROLES } from "../utils/constants.js";
import { prisma } from "../config/database.js";

/**
 * Workspace Service — handles workspace lifecycle and membership.
 */
class WorkspaceService {
  /**
   * Create a new workspace and assign the creator as OWNER.
   */
  async createWorkspace({ name, description }, ownerId, ipAddress) {
    // We use Prisma directly for the nested creation to ensure atomic transaction
    // where the workspace and the owner membership are created together.
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: [
            {
              userId: ownerId,
              role: ROLES.OWNER,
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
    await auditLogService.logAction({
      userId: ownerId,
      action: AUDIT_ACTIONS.WORKSPACE_CREATED,
      entityType: ENTITY_TYPES.WORKSPACE,
      entityId: workspace.id,
      ipAddress,
    });

    return workspace;
  }

  /**
   * Add a new member to the workspace.
   * Typically invoked by OWNER or ADMIN.
   */
  async addMember(workspaceId, adminId, { email, role }, ipAddress) {
    // 1. Check if workspace exists
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw ApiError.notFound("Workspace not found");
    }

    // 2. Check if user to be added exists
    const userToAdd = await userRepository.findByEmail(email);
    if (!userToAdd) {
      throw ApiError.notFound("User with provided email not found. They must register first.");
    }

    // 3. Check if user is already a member
    const existingMembership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: userToAdd.id,
        },
      },
    });

    if (existingMembership) {
      throw ApiError.conflict("User is already a member of this workspace");
    }

    // 4. Add user to workspace
    const newMember = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: userToAdd.id,
        role: role || ROLES.MEMBER,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 5. Audit log
    await auditLogService.logAction({
      userId: adminId,
      action: AUDIT_ACTIONS.MEMBER_ADDED,
      entityType: ENTITY_TYPES.WORKSPACE,
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
    return prisma.workspace.findMany({
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
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      throw ApiError.forbidden("Access denied to this workspace");
    }

    return workspaceRepository.findWithMembers(workspaceId);
  }
}

export default new WorkspaceService();
