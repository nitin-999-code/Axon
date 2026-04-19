import { z } from "zod";
import { ROLES } from "../utils/constants.js";

/**
 * Workspace validation schemas (Zod).
 */
export const createWorkspaceSchema = {
  body: z.object({
    name: z
      .string({ required_error: "Workspace name is required" })
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim(),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
  }),
};

export const addMemberSchema = {
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    role: z.enum([ROLES.OWNER, ROLES.ADMIN, ROLES.MEMBER]).optional(),
  }),
};
