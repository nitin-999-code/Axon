import { Request, Response, NextFunction } from "express";
import templateService from "../services/template.service";
import ApiResponse from "../utils/ApiResponse";

/**
 * Template Controller — handles task template HTTP requests.
 */
class TemplateController {
  public async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const template = await templateService.createTemplate(
        req.body,
        (req as any).user.id,
        req.ip || ""
      );
      ApiResponse.created(res, "Template created successfully", template);
    } catch (error) {
      next(error);
    }
  }

  public async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const templates = await templateService.getTemplates(workspaceId);
      ApiResponse.ok(res, "Templates retrieved", templates);
    } catch (error) {
      next(error);
    }
  }

  public async createTaskFromTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId } = req.params;
      const { projectId } = req.body;
      const task = await templateService.createTaskFromTemplate(
        templateId,
        projectId,
        (req as any).user.id,
        req.ip || ""
      );
      ApiResponse.created(res, "Task created from template", task);
    } catch (error) {
      next(error);
    }
  }
}

export default new TemplateController();
