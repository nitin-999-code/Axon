import activityService from "../services/activity.service.js";

class ActivityController {
  async getProjectFeed(req, res, next) {
    try {
      const { projectId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const feed = await activityService.getProjectFeed(projectId, page, limit);
      res.status(200).json({ success: true, ...feed });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivityController();
