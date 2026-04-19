import { z } from "zod";
import { ROLES } from "../utils/constants.js";

export const createWorkflowSchema = {
  body: z.object({
    projectId: z.string().uuid(),
  }),
};

export const createStateSchema = {
  body: z.object({
    name: z.string().min(2).max(50),
    description: z.string().optional(),
    isInitial: z.boolean().default(false),
    isFinal: z.boolean().default(false),
  }),
};

export const createTransitionSchema = {
  body: z.object({
    fromStateId: z.string().uuid(),
    toStateId: z.string().uuid(),
    allowedRoles: z.array(z.enum([ROLES.OWNER, ROLES.ADMIN, ROLES.MEMBER])).default([]),
  }),
};

export const transitionTaskSchema = {
  body: z.object({
    targetStateName: z.string(),
  }),
};
