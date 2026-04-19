import BaseRepository from "./base.repository.js";

/**
 * Project Repository — data access for Project entity.
 */
class ProjectRepository extends BaseRepository {
  constructor() {
    super("project");
  }

  async findByWorkspace(workspaceId: any, options: any = {}) {
    return this.findMany({
      where: { workspaceId },
      ...options,
    });
  }

  async findWithWorkflow(id: any) {
    return this.model.findUnique({
      where: { id },
      include: {
        workflow: {
          include: { transitions: true },
        },
        _count: { select: { tasks: true } },
      },
    });
  }
}

export default new ProjectRepository();
