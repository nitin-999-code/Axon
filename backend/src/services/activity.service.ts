import activityRepository from "../repositories/activity.repository.js";
import projectRepository from "../repositories/project.repository.js";
import taskRepository from "../repositories/task.repository.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/database.js";

class ActivityService {
  async getProjectFeed(projectId: any, page: any = 1, limit: any = 20) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw ApiError.notFound("Project not found");

    // Retrieve all tasks associated with this project 
    // to comprehensively grab all scoped task-level audit actions.
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { id: true }
    });
    const taskIds = tasks.map((t: any) => t.id);

    const skip = (page - 1) * limit;

    const [activities, totalCount] = await Promise.all([
      activityRepository.getProjectActivity(projectId, taskIds, skip, limit),
      activityRepository.countProjectActivity(projectId, taskIds)
    ]);

    return {
      data: activities,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }
}

export default new ActivityService();
