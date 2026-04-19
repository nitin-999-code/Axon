import templateRepository from "../repositories/template.repository";
import taskRepository from "../repositories/task.repository";
import projectRepository from "../repositories/project.repository";
import auditLogService from "./auditLog.service";
import ApiError from "../utils/ApiError";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../utils/constants";

/**
 * Template Service — manages reusable task templates.
 * Demonstrates the Template Method behavioral pattern conceptually.
 */
class TemplateService {
  public async createTemplate(data: any, userId: string, ipAddress: string): Promise<any> {
    const template = await templateRepository.create({
      name: data.name,
      description: data.description,
      defaultPriority: data.defaultPriority || "MEDIUM",
      defaultPoints: data.defaultPoints || 0,
      workspaceId: data.workspaceId,
      createdBy: userId,
    });

    await auditLogService.logAction({
      userId,
      action: "TEMPLATE_CREATED",
      entityType: "TEMPLATE",
      entityId: template.id,
      metadata: { name: template.name },
      ipAddress,
    });

    return template;
  }

  public async getTemplates(workspaceId: string): Promise<any[]> {
    return templateRepository.findByWorkspace(workspaceId);
  }

  public async createTaskFromTemplate(
    templateId: string,
    projectId: string,
    userId: string,
    ipAddress: string
  ): Promise<any> {
    const template = await templateRepository.findById(templateId);
    if (!template) throw ApiError.notFound("Template not found");

    const project = await projectRepository.findById(projectId);
    if (!project) throw ApiError.notFound("Project not found");

    const task = await taskRepository.create({
      title: template.name,
      description: template.description,
      projectId,
      priority: template.defaultPriority,
      storyPoints: template.defaultPoints,
      createdBy: userId,
    });

    await auditLogService.logAction({
      userId,
      action: AUDIT_ACTIONS.TASK_CREATED,
      entityType: ENTITY_TYPES.TASK,
      entityId: task.id,
      metadata: { fromTemplate: templateId, templateName: template.name },
      ipAddress,
    });

    return task;
  }
}

export default new TemplateService();
