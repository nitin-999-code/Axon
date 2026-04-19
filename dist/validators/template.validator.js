"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskFromTemplateSchema = exports.createTemplateSchema = void 0;
const zod_1 = require("zod");
exports.createTemplateSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Template name is required").max(200),
        description: zod_1.z.string().max(2000).optional(),
        defaultPriority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
        defaultPoints: zod_1.z.number().int().min(0).max(100).optional(),
        workspaceId: zod_1.z.string().uuid("Invalid workspace ID"),
    }),
};
exports.createTaskFromTemplateSchema = {
    body: zod_1.z.object({
        projectId: zod_1.z.string().uuid("Invalid project ID"),
    }),
};
