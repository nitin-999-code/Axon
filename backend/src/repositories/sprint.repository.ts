import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

/**
 * Sprint Repository — data access for Sprints.
 */
class SprintRepository extends BaseRepository {
  constructor() {
    super("sprint");
  }

  async findWithTasks(id: any) {
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

  async findActiveSprintByProject(projectId: any) {
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

  async fetchOverdueTasksInSprint(sprintId: any, currentDate: any) {
    return prisma.task.findMany({
      where: {
        // sprintId removed as it does not exist in TaskWhereInput
        dueDate: { lt: currentDate },
        currentStatus: { notIn: ["DONE", "COMPLETED", "RESOLVED"] } // Customizable terminal states
      }
    });
  }
}

export default new SprintRepository();
