import { Request, Response, NextFunction } from "express";
import projectService from "../services/project.service.js";

/**
 * Project Controller — handles API requests for projects.
 */
class ProjectController {
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.createProject(req.body, (req as any).user.id, (req.ip as string));
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProject(req.params.id as string);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.updateProject(req.params.id as string, req.body, (req as any).user.id, (req.ip as string));
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(req.params.id as string, (req as any).user.id, (req.ip as string));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
