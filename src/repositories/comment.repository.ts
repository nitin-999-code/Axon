import BaseRepository from "./base.repository.js";
import { prisma } from "../config/database.js";

class CommentRepository extends BaseRepository {
  constructor() {
    super("comment");
  }

  async findByTaskWithPagination(taskId: any, skip: any, take: any) {
    return (prisma as any).comment.findMany({
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

  async countByTask(taskId: any) {
    return (prisma as any).comment.count({
      where: { taskId }
    });
  }
}

export default new CommentRepository();
