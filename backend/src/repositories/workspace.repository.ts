import BaseRepository from "./base.repository.js";

/**
 * Workspace Repository — data access for Workspace entity.
 */
class WorkspaceRepository extends BaseRepository {
  constructor() {
    super("workspace");
  }

  async findByOwner(ownerId: any) {
    return this.model.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findWithMembers(id: any) {
    return this.model.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: { select: { projects: true } },
      },
    });
  }
}

export default new WorkspaceRepository();
