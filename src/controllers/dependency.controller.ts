import { Request, Response, NextFunction } from "express";
import dependencyService from "../services/dependency.service.js";

/**
 * Dependency Controller — API mapping for Task Dependency Graphs
 */
class DependencyController {
  async addDependency(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId, dependsOnId } = req.body as any;
      const dependency = await dependencyService.addDependency(
        taskId, 
        dependsOnId, 
        (req as any).user.id, 
        (req.ip as string)
      );
      
      res.status(201).json({ success: true, data: dependency });
    } catch (error) {
      next(error);
    }
  }

  async analyzeGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params as any;
      const metrics = await dependencyService.analyzeDependencyGraph(projectId);
      
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}

export default new DependencyController();
