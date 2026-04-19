"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTaskSchema = exports.assignTaskSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const constants_js_1 = require("../utils/constants.js");
/**
 * Task validation schemas (Zod).
 */
exports.createTaskSchema = {
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Task title is required" }).min(3).max(150).trim(),
        description: zod_1.z.string().max(2000).optional(),
        projectId: zod_1.z.string({ required_error: "Project ID is required" }).uuid(),
        assigneeId: zod_1.z.string().uuid().optional(),
        parentTaskId: zod_1.z.string().uuid().optional(),
        priority: zod_1.z.enum([
            constants_js_1.TASK_PRIORITIES.LOW,
            constants_js_1.TASK_PRIORITIES.MEDIUM,
            constants_js_1.TASK_PRIORITIES.HIGH,
            constants_js_1.TASK_PRIORITIES.URGENT,
        ]).optional(),
        dueDate: zod_1.z.string().datetime().optional(),
    }),
};
exports.updateTaskSchema = {
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).max(150).trim().optional(),
        description: zod_1.z.string().max(2000).optional(),
        priority: zod_1.z.enum([
            constants_js_1.TASK_PRIORITIES.LOW,
            constants_js_1.TASK_PRIORITIES.MEDIUM,
            constants_js_1.TASK_PRIORITIES.HIGH,
            constants_js_1.TASK_PRIORITIES.URGENT,
        ]).optional(),
        currentStatus: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().optional(),
    }),
};
exports.assignTaskSchema = {
    body: zod_1.z.object({
        assigneeId: zod_1.z.string({ required_error: "Assignee ID is required" }).uuid(),
    }),
};
exports.moveTaskSchema = {
    body: zod_1.z.object({
        newProjectId: zod_1.z.string({ required_error: "New Project ID is required" }).uuid(),
    }),
};
