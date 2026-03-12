import { z } from "zod";

/**
 * Project validation schemas (Zod).
 */
export const createProjectSchema = {
  body: z.object({
    name: z
      .string({ required_error: "Project name is required" })
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim(),
    description: z.string().max(500).optional(),
    workspaceId: z.string({ required_error: "Workspace ID is required" }).uuid(),
  }),
};

export const updateProjectSchema = {
  body: z.object({
    name: z.string().min(3).max(100).trim().optional(),
    description: z.string().max(500).optional(),
  }),
};
