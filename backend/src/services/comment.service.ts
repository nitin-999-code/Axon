import commentRepository from "../repositories/comment.repository.js";
import taskRepository from "../repositories/task.repository.js";
import auditLogService from "./auditLog.service.js";
import ApiError from "../utils/ApiError.js";
import { ENTITY_TYPES, AUDIT_ACTIONS } from "../utils/constants.js";

class CommentService {
  async addComment({ content, taskId, parentCommentId }: any, userId: any, ipAddress: any) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw ApiError.notFound("Task not found");

    if (parentCommentId) {
      const parent = await commentRepository.findById(parentCommentId);
      if (!parent) throw ApiError.notFound("Parent comment not found");
      if (parent.taskId !== taskId) {
        throw ApiError.badRequest("Parent comment does not belong to the requested task");
      }
    }

    const comment = await commentRepository.create({
      content,
      taskId,
      userId,
      parentCommentId
    });

    await auditLogService.logAction({
      userId,
      action: "COMMENT_ADDED",
      entityType: ENTITY_TYPES.TASK,
      entityId: taskId,
      metadata: { commentId: comment.id, hasParent: !!parentCommentId },
      ipAddress,
    });

    return comment;
  }

  async getCommentsByTask(taskId: any, page: any = 1, limit: any = 10) {
    const skip = (page - 1) * limit;
    
    const [comments, totalCount] = await Promise.all([
      commentRepository.findByTaskWithPagination(taskId, skip, limit),
      commentRepository.countByTask(taskId)
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

export default new CommentService();
