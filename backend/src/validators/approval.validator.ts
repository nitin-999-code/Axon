import { z } from "zod";

export const requestApprovalSchema = {
  params: z.object({
    taskId: z.string().uuid("Invalid task ID"),
  }),
};
