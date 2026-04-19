import { z } from "zod";

export const addCommentSchema = {
  body: z.object({
    content: z.string().min(1, "Comment cannot be empty").max(2000),
    parentCommentId: z.string().uuid().optional(),
  }),
};
