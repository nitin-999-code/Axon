import dependencyService from "../services/dependency.service.js";

/**
 * Dependency Controller — API mapping for Task Dependency Graphs
 */
class DependencyController {
  async addDependency(req, res, next) {
    try {
      const { taskId, dependsOnId } = req.body;
      const dependency = await dependencyService.addDependency(
        taskId, 
        dependsOnId, 
        req.user.id, 
        req.ip
      );
      
      res.status(201).json({ success: true, data: dependency });
    } catch (error) {
      next(error);
    }
  }

  async analyzeGraph(req, res, next) {
    try {
      const { projectId } = req.params;
      const metrics = await dependencyService.analyzeDependencyGraph(projectId);
      
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}

export default new DependencyController();
