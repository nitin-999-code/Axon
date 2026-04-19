"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_repository_js_1 = __importDefault(require("../repositories/comment.repository.js"));
const task_repository_js_1 = __importDefault(require("../repositories/task.repository.js"));
const auditLog_service_js_1 = __importDefault(require("./auditLog.service.js"));
const ApiError_js_1 = __importDefault(require("../utils/ApiError.js"));
const constants_js_1 = require("../utils/constants.js");
class CommentService {
    async addComment({ content, taskId, parentCommentId }, userId, ipAddress) {
        const task = await task_repository_js_1.default.findById(taskId);
        if (!task)
            throw ApiError_js_1.default.notFound("Task not found");
        if (parentCommentId) {
            const parent = await comment_repository_js_1.default.findById(parentCommentId);
            if (!parent)
                throw ApiError_js_1.default.notFound("Parent comment not found");
            if (parent.taskId !== taskId) {
                throw ApiError_js_1.default.badRequest("Parent comment does not belong to the requested task");
            }
        }
        const comment = await comment_repository_js_1.default.create({
            content,
            taskId,
            userId,
            parentCommentId
        });
        await auditLog_service_js_1.default.logAction({
            userId,
            action: "COMMENT_ADDED",
            entityType: constants_js_1.ENTITY_TYPES.TASK,
            entityId: taskId,
            metadata: { commentId: comment.id, hasParent: !!parentCommentId },
            ipAddress,
        });
        return comment;
    }
    async getCommentsByTask(taskId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [comments, totalCount] = await Promise.all([
            comment_repository_js_1.default.findByTaskWithPagination(taskId, skip, limit),
            comment_repository_js_1.default.countByTask(taskId)
        ]);
        return {
            data: comments,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }
}
exports.default = new CommentService();
