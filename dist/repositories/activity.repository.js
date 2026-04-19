"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
const database_js_1 = require("../config/database.js");
class ActivityRepository extends base_repository_js_1.default {
    constructor() {
        super("auditLog");
    }
    async getProjectActivity(projectId, taskIds, skip, take) {
        return database_js_1.prisma.auditLog.findMany({
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
        return database_js_1.prisma.auditLog.count({
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
exports.default = new ActivityRepository();
