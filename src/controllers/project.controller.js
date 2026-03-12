import projectService from "../services/project.service.js";

/**
 * Project Controller — handles API requests for projects.
 */
class ProjectController {
  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.body, req.user.id, req.ip);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async getProject(req, res, next) {
    try {
      const project = await projectService.getProject(req.params.id);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body, req.user.id, req.ip);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.params.id, req.user.id, req.ip);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
