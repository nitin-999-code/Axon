import projectRepository from "../repositories/project.repository.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import auditLogService from "./auditLog.service.js";
import ApiError from "../utils/ApiError.js";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants.js";

class ProjectService {
  /**
   * Create a new project in a workspace.
   */
  async createProject(data: { name: string; description?: string; workspaceId: string }, userId: string, ipAddress: string) {
    const { name, description, workspaceId } = data;

    // Verify workspace exists
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw ApiError.notFound("Workspace not found");
    }

    const project = await projectRepository.create({
      name,
      description,
      workspaceId,
      createdBy: userId,
    });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.PROJECT_CREATED,
      entityType: ENTITY_TYPES.PROJECT,
      entityId: project.id,
      metadata: { workspaceId },
      ipAddress,
    });

    return project;
  }

  /**
   * Get a project by ID.
   */
  async getProject(id: string) {
    const project = await projectRepository.findWithWorkflow(id);
    if (!project) {
      throw ApiError.notFound("Project not found");
    }
    return project;
  }

  /**
   * Update a project.
   */
  async updateProject(id: string, data: any, userId: string, ipAddress: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    const updatedProject = await projectRepository.update(id, data);

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.PROJECT_UPDATED,
      entityType: ENTITY_TYPES.PROJECT,
      entityId: project.id,
      metadata: { updatedFields: Object.keys(data) },
      ipAddress,
    });

    return updatedProject;
  }

  /**
   * Delete a project.
   */
  async deleteProject(id: string, userId: string, ipAddress: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    await projectRepository.delete(id);

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.PROJECT_DELETED,
      entityType: ENTITY_TYPES.PROJECT,
      entityId: id,
      ipAddress,
    });

    return true;
  }
}

export default new ProjectService();
