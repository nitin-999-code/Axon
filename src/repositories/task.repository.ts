import BaseRepository from "./base.repository.js";

/**
 * Task Repository — data access for Task entity.
 */
class TaskRepository extends BaseRepository {
  constructor() {
    super("task");
  }

  async findByProject(projectId, options = {}) {
    return this.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } },
      },
      ...options,
    });
  }

  async findByAssignee(assigneeId, options = {}) {
    return this.findMany({
      where: { assigneeId },
      ...options,
    });
  }

  async updateStatus(id, status) {
    return this.model.update({
      where: { id },
      data: { currentStatus: status },
    });
  }

  async findWithDependencies(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        dependencies: {
          include: {
            dependsOn: {
              select: { id: true, title: true, currentStatus: true },
            },
          },
        },
        dependents: {
          include: {
            task: {
              select: { id: true, title: true, currentStatus: true },
            },
          },
        },
      },
    });
  }
}

export default new TaskRepository();
