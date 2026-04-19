import { Request, Response, NextFunction } from "express";
import commentService from "../services/comment.service.js";

class CommentController {
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, parentCommentId } = req.body as any;
      const { taskId } = req.params as any;
      
      const comment = await commentService.addComment(
        { content, taskId, parentCommentId },
        (req as any).user.id,
        (req.ip as string)
      );
      
      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params as any;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await commentService.getCommentsByTask(taskId, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
