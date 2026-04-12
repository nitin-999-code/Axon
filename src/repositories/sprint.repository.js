import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

/**
 * Sprint Repository — data access for Sprints.
 */
class SprintRepository extends BaseRepository {
  constructor() {
    super("sprint");
  }

  async findWithTasks(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            storyPoints: true,
            currentStatus: true,
            dueDate: true,
            assigneeId: true
          }
        }
      }
    });
  }

  async findActiveSprintByProject(projectId) {
    return this.model.findFirst({
      where: {
        projectId,
        status: "ACTIVE"
      },
      include: {
        tasks: true
      }
    });
  }

  async fetchOverdueTasksInSprint(sprintId, currentDate) {
    return prisma.task.findMany({
      where: {
        sprintId,
        dueDate: { lt: currentDate },
        currentStatus: { notIn: ["DONE", "COMPLETED", "RESOLVED"] } // Customizable terminal states
      }
    });
  }
}

export default new SprintRepository();
