import taskService from "../services/task.service.js";

/**
 * Task Controller — API interface for Task related requests.
 */
class TaskController {
  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body, req.user.id, req.ip);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await taskService.getTask(req.params.id);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body, req.user.id, req.ip);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.params.id, req.user.id, req.ip);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async assignUser(req, res, next) {
    try {
      const { assigneeId } = req.body;
      const task = await taskService.assignUser(req.params.id, assigneeId, req.user.id, req.ip);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async moveTask(req, res, next) {
    try {
      const { newProjectId } = req.body;
      const task = await taskService.moveTask(req.params.id, newProjectId, req.user.id, req.ip);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
