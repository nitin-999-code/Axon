"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
/**
 * AuditLog Repository — data access for audit trail.
 * Append-only: no update or delete methods exposed.
 */
class AuditLogRepository extends base_repository_js_1.default {
    constructor() {
        super("auditLog");
    }
    async findByEntity(entityType, entityId, options = {}) {
        return this.findMany({
            where: { entityType, entityId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { timestamp: "desc" },
            ...options,
        });
    }
    async findByUser(userId, options = {}) {
        return this.findMany({
            where: { userId },
            orderBy: { timestamp: "desc" },
            ...options,
        });
    }
    async findByDateRange(start, end, options = {}) {
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
exports.default = new AuditLogRepository();
