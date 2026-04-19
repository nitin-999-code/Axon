import { Request, Response, NextFunction } from "express";
import activityService from "../services/activity.service.js";

class ActivityController {
  async getProjectFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params as any;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const feed = await activityService.getProjectFeed(projectId, page, limit);
      res.status(200).json({ success: true, ...feed });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivityController();
