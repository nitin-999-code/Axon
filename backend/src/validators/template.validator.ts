import { z } from "zod";

export const createTemplateSchema = {
  body: z.object({
    name: z.string().min(1, "Template name is required").max(200),
    description: z.string().max(2000).optional(),
    defaultPriority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    defaultPoints: z.number().int().min(0).max(100).optional(),
    workspaceId: z.string().uuid("Invalid workspace ID"),
  }),
};

export const createTaskFromTemplateSchema = {
  body: z.object({
    projectId: z.string().uuid("Invalid project ID"),
  }),
};
