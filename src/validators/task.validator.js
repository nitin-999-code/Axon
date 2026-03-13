import { z } from "zod";
import { TASK_PRIORITIES } from "../utils/constants.js";

/**
 * Task validation schemas (Zod).
 */
export const createTaskSchema = {
  body: z.object({
    title: z.string({ required_error: "Task title is required" }).min(3).max(150).trim(),
    description: z.string().max(2000).optional(),
    projectId: z.string({ required_error: "Project ID is required" }).uuid(),
    assigneeId: z.string().uuid().optional(),
    parentTaskId: z.string().uuid().optional(),
    priority: z.enum([
      TASK_PRIORITIES.LOW,
      TASK_PRIORITIES.MEDIUM,
      TASK_PRIORITIES.HIGH,
      TASK_PRIORITIES.URGENT,
    ]).optional(),
    dueDate: z.string().datetime().optional(),
  }),
};

export const updateTaskSchema = {
  body: z.object({
    title: z.string().min(3).max(150).trim().optional(),
    description: z.string().max(2000).optional(),
    priority: z.enum([
      TASK_PRIORITIES.LOW,
      TASK_PRIORITIES.MEDIUM,
      TASK_PRIORITIES.HIGH,
      TASK_PRIORITIES.URGENT,
    ]).optional(),
    currentStatus: z.string().optional(),
    dueDate: z.string().datetime().optional(),
  }),
};

export const assignTaskSchema = {
  body: z.object({
    assigneeId: z.string({ required_error: "Assignee ID is required" }).uuid(),
  }),
};

export const moveTaskSchema = {
  body: z.object({
    newProjectId: z.string({ required_error: "New Project ID is required" }).uuid(),
  }),
};
