"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_service_js_1 = __importDefault(require("../services/comment.service.js"));
class CommentController {
    async addComment(req, res, next) {
        try {
            const { content, parentCommentId } = req.body;
            const { taskId } = req.params;
            const comment = await comment_service_js_1.default.addComment({ content, taskId, parentCommentId }, req.user.id, req.ip);
            res.status(201).json({ success: true, data: comment });
        }
        catch (error) {
            next(error);
        }
    }
    async getComments(req, res, next) {
        try {
            const { taskId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await comment_service_js_1.default.getCommentsByTask(taskId, page, limit);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new CommentController();
