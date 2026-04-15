import BaseRepository from "./base.repository";
import { prisma } from "../config/database";

/**
 * Approval Repository — data access for the Approval entity.
 * Extends BaseRepository (Inheritance).
 */
class ApprovalRepository extends BaseRepository {
  constructor() {
    super("approval");
  }

  public async findPendingByTask(taskId: string): Promise<any> {
    return this.model.findFirst({
      where: { taskId, status: "PENDING" },
      include: {
        requester: { select: { id: true, name: true, email: true } },
      },
    });
  }

  public async findByTask(taskId: string): Promise<any[]> {
    return this.model.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        decider: { select: { id: true, name: true, email: true } },
      },
    });
  }

  public async resolve(
    id: string,
    decidedBy: string,
    status: "APPROVED" | "REJECTED"
  ): Promise<any> {
    return this.model.update({
      where: { id },
      data: {
        decidedBy,
        status,
        resolvedAt: new Date(),
      },
    });
  }
}

export default new ApprovalRepository();
