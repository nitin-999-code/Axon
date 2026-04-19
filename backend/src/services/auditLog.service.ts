import auditLogRepository from "../repositories/auditLog.repository.js";
import logger from "../utils/logger.js";

/**
 * AuditLog Service — records immutable audit trail entries.
 * Used by all other services to log significant actions.
 */
class AuditLogService {
  /**
   * Record an action in the audit log.
   * @param {Object} params
   * @param {string} params.userId - Actor who performed the action
   * @param {string} params.action - Action constant (from AUDIT_ACTIONS)
   * @param {string} params.entityType - Entity type constant (from ENTITY_TYPES)
   * @param {string} params.entityId - ID of the affected entity
   * @param {Object} params.metadata - Additional context
   * @param {string} params.ipAddress - Client IP address
   */
  async logAction({ userId, action, entityType, entityId, metadata = {}, ipAddress = null }: any) {
    try {
      const log = await auditLogRepository.create({
        userId,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress,
      });

      logger.debug("Audit log recorded", { action, entityType, entityId });
      return log;
    } catch (error) {
      // Audit logging should never break the main flow
      logger.error("Failed to record audit log", {
        action,
        entityType,
        entityId,
        error: (error as Error).message,
      });
    }
  }

  async getLogsByEntity(entityType: any, entityId: any, options: any = {}) {
    return auditLogRepository.findByEntity(entityType, entityId, options);
  }

  async getLogsByUser(userId: any, options: any = {}) {
    return auditLogRepository.findByUser(userId, options);
  }

  async getLogsByDateRange(start: any, end: any, options: any = {}) {
    return auditLogRepository.findByDateRange(start, end, options);
  }
}

export default new AuditLogService();
