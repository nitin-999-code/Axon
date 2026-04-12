import sprintService from "../services/sprint.service.js";

/**
 * Sprint Controller — routing analytics and notifications to HTTP Layer.
 */
class SprintController {
  async createSprint(req, res, next) {
    try {
      const sprint = await sprintService.createSprint(req.body, req.user.id, req.ip);
      res.status(201).json({ success: true, data: sprint });
    } catch (error) {
      next(error);
    }
  }

  async assignTask(req, res, next) {
    try {
      const { taskId, sprintId } = req.body;
      const updatedTask = await sprintService.assignTaskToSprint(taskId, sprintId, req.user.id, req.ip);
      res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
      next(error);
    }
  }

  async getVelocity(req, res, next) {
    try {
      const { sprintId } = req.params;
      const velocityMetrics = await sprintService.computeVelocity(sprintId);
      res.status(200).json({ success: true, data: velocityMetrics });
    } catch (error) {
      next(error);
    }
  }

  async getBurndown(req, res, next) {
    try {
      const { sprintId } = req.params;
      const burndown = await sprintService.generateBurndownData(sprintId);
      res.status(200).json({ success: true, data: burndown });
    } catch (error) {
      next(error);
    }
  }

  async runOverdueDetector(req, res, next) {
    try {
      const { sprintId } = req.params;
      const result = await sprintService.detectOverdueTasks(sprintId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new SprintController();
