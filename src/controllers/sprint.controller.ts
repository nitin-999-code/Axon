import { Request, Response, NextFunction } from "express";
import sprintService from "../services/sprint.service.js";

/**
 * Sprint Controller — routing analytics and notifications to HTTP Layer.
 */
class SprintController {
  async createSprint(req: Request, res: Response, next: NextFunction) {
    try {
      const sprint = await sprintService.createSprint(req.body, (req as any).user.id, (req.ip as string));
      res.status(201).json({ success: true, data: sprint });
    } catch (error) {
      next(error);
    }
  }

  async assignTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId, sprintId } = req.body as any;
      const updatedTask = await sprintService.assignTaskToSprint(taskId, sprintId, (req as any).user.id, (req.ip as string));
      res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
      next(error);
    }
  }

  async getVelocity(req: Request, res: Response, next: NextFunction) {
    try {
      const { sprintId } = req.params as any;
      const velocityMetrics = await sprintService.computeVelocity(sprintId);
      res.status(200).json({ success: true, data: velocityMetrics });
    } catch (error) {
      next(error);
    }
  }

  async getBurndown(req: Request, res: Response, next: NextFunction) {
    try {
      const { sprintId } = req.params as any;
      const burndown = await sprintService.generateBurndownData(sprintId);
      res.status(200).json({ success: true, data: burndown });
    } catch (error) {
      next(error);
    }
  }

  async runOverdueDetector(req: Request, res: Response, next: NextFunction) {
    try {
      const { sprintId } = req.params as any;
      const result = await sprintService.detectOverdueTasks(sprintId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new SprintController();
