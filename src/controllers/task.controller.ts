import { Request, Response, NextFunction } from "express";
import taskService from "../services/task.service.js";

/**
 * Task Controller — API interface for Task related requests.
 */
class TaskController {
  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.createTask(req.body, (req as any).user.id, (req.ip as string));
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTask(req.params.id as string);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.updateTask(req.params.id as string, req.body, (req as any).user.id, (req.ip as string));
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      await taskService.deleteTask(req.params.id as string, (req as any).user.id, (req.ip as string));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async assignUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { assigneeId } = req.body as any;
      const task = await taskService.assignUser(req.params.id as string, assigneeId, (req as any).user.id, (req.ip as string));
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async moveTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { newProjectId } = req.body as any;
      const task = await taskService.moveTask(req.params.id as string, newProjectId, (req as any).user.id, (req.ip as string));
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
