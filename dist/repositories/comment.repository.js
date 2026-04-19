"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_js_1 = __importDefault(require("./base.repository.js"));
const database_js_1 = require("../config/database.js");
class CommentRepository extends base_repository_js_1.default {
    constructor() {
        super("comment");
    }
    async findByTaskWithPagination(taskId, skip, take) {
        return database_js_1.prisma.comment.findMany({
            where: { taskId },
            orderBy: { createdAt: "asc" },
            skip,
            take,
            include: {
                user: { select: { id: true, name: true, email: true } },
                replies: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                }
            }
        });
    }
    async countByTask(taskId) {
        return database_js_1.prisma.comment.count({
            where: { taskId }
        });
    }
}
exports.default = new CommentRepository();
