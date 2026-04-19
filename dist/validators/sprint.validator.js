"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTaskToSprintSchema = exports.createSprintSchema = void 0;
const zod_1 = require("zod");
exports.createSprintSchema = {
    body: zod_1.z.object({
        projectId: zod_1.z.string().uuid(),
        name: zod_1.z.string().min(2).max(100),
        goal: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime(),
        endDate: zod_1.z.string().datetime(),
    }),
};
exports.assignTaskToSprintSchema = {
    body: zod_1.z.object({
        taskId: zod_1.z.string().uuid(),
        sprintId: zod_1.z.string().uuid(),
    }),
};
