"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
/**
 * Approval Repository — data access for the Approval entity.
 * Extends BaseRepository (Inheritance).
 */
class ApprovalRepository extends base_repository_1.default {
    constructor() {
        super("approval");
    }
    async findPendingByTask(taskId) {
        return this.model.findFirst({
            where: { taskId, status: "PENDING" },
            include: {
                requester: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async findByTask(taskId) {
        return this.model.findMany({
            where: { taskId },
            orderBy: { createdAt: "desc" },
            include: {
                requester: { select: { id: true, name: true, email: true } },
                decider: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async resolve(id, decidedBy, status) {
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
exports.default = new ApprovalRepository();
