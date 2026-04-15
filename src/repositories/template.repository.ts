import BaseRepository from "./base.repository";

/**
 * Template Repository — data access for TaskTemplate entity.
 * Extends BaseRepository (Inheritance).
 */
class TemplateRepository extends BaseRepository {
  constructor() {
    super("taskTemplate");
  }

  public async findByWorkspace(workspaceId: string): Promise<any[]> {
    return this.model.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new TemplateRepository();
