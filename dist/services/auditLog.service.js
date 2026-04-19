"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auditLog_repository_js_1 = __importDefault(require("../repositories/auditLog.repository.js"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
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
    async logAction({ userId, action, entityType, entityId, metadata = {}, ipAddress = null }) {
        try {
            const log = await auditLog_repository_js_1.default.create({
                userId,
                action,
                entityType,
                entityId,
                metadata,
                ipAddress,
            });
            logger_js_1.default.debug("Audit log recorded", { action, entityType, entityId });
            return log;
        }
        catch (error) {
            // Audit logging should never break the main flow
            logger_js_1.default.error("Failed to record audit log", {
                action,
                entityType,
                entityId,
                error: error.message,
            });
        }
    }
    async getLogsByEntity(entityType, entityId, options = {}) {
        return auditLog_repository_js_1.default.findByEntity(entityType, entityId, options);
    }
    async getLogsByUser(userId, options = {}) {
        return auditLog_repository_js_1.default.findByUser(userId, options);
    }
    async getLogsByDateRange(start, end, options = {}) {
        return auditLog_repository_js_1.default.findByDateRange(start, end, options);
    }
}
exports.default = new AuditLogService();
