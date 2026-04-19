import BaseRepository from "./base.repository.js";

/**
 * AuditLog Repository — data access for audit trail.
 * Append-only: no update or delete methods exposed.
 */
class AuditLogRepository extends BaseRepository {
  constructor() {
    super("auditLog");
  }

  async findByEntity(entityType: any, entityId: any, options: any = {}) {
    return this.findMany({
      where: { entityType, entityId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { timestamp: "desc" },
      ...options,
    });
  }

  async findByUser(userId: any, options: any = {}) {
    return this.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      ...options,
    });
  }

  async findByDateRange(start: any, end: any, options: any = {}) {
    return this.findMany({
      where: {
        timestamp: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      orderBy: { timestamp: "desc" },
      ...options,
    });
  }

  // Override: Audit logs are immutable — disable mutations
  async update() {
    throw new Error("Audit logs are immutable — updates are not permitted.");
  }

  async delete() {
    throw new Error("Audit logs are immutable — deletion is not permitted.");
  }
}

export default new AuditLogRepository();
