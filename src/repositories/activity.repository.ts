import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

class ActivityRepository extends BaseRepository {
  constructor() {
    super("auditLog");
  }

  async getProjectActivity(projectId, taskIds, skip, take) {
    return prisma.auditLog.findMany({
      where: {
        OR: [
          { entityType: "PROJECT", entityId: projectId },
          { entityType: "TASK", entityId: { in: taskIds } },
          // Using raw database JSON extraction if projectId is stored inside metadata
          {
            metadata: {
              path: ["projectId"],
              equals: projectId
            }
          }
        ]
      },
      orderBy: { timestamp: 'desc' },
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, email: true } },
      }
    });
  }

  async countProjectActivity(projectId, taskIds) {
    return prisma.auditLog.count({
      where: {
        OR: [
          { entityType: "PROJECT", entityId: projectId },
          { entityType: "TASK", entityId: { in: taskIds } },
          {
            metadata: {
              path: ["projectId"],
              equals: projectId
            }
          }
        ]
      }
    });
  }
}

export default new ActivityRepository();
