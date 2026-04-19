import { z } from "zod";

export const addDependencySchema = {
  body: z.object({
    taskId: z.string({ required_error: "Task ID is required" }).uuid(),
    dependsOnId: z.string({ required_error: "Depends-On Task ID is required" }).uuid(),
  }),
};
