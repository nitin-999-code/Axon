import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

/**
 * Dependency Repository — data access for TaskDependencies.
 */
class DependencyRepository extends BaseRepository {
  constructor() {
    super("taskDependency");
  }

  async fetchProjectGraphQuery(projectId) {
    // We need all tasks in the project
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { id: true, title: true, currentStatus: true },
    });

    const taskIds = tasks.map(t => t.id);

    // Fetch all dependencies where both tasks are in this project
    const dependencies = await this.model.findMany({
      where: {
        AND: [
          { taskId: { in: taskIds } },
          { dependsOnId: { in: taskIds } }
        ]
      }
    });

    return { tasks, dependencies };
  }

  async dependencyExists(taskId, dependsOnId) {
    const existing = await this.model.findUnique({
      where: {
        taskId_dependsOnId: { taskId, dependsOnId }
      }
    });
    return !!existing;
  }
}

export default new DependencyRepository();
