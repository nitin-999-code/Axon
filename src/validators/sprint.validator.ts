import { z } from "zod";

export const createSprintSchema = {
  body: z.object({
    projectId: z.string().uuid(),
    name: z.string().min(2).max(100),
    goal: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
};

export const assignTaskToSprintSchema = {
  body: z.object({
    taskId: z.string().uuid(),
    sprintId: z.string().uuid(),
  }),
};
