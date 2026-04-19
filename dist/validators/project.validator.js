"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
/**
 * Project validation schemas (Zod).
 */
exports.createProjectSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Project name is required" })
            .min(3, "Name must be at least 3 characters")
            .max(100, "Name must not exceed 100 characters")
            .trim(),
        description: zod_1.z.string().max(500).optional(),
        workspaceId: zod_1.z.string({ required_error: "Workspace ID is required" }).uuid(),
    }),
};
exports.updateProjectSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).max(100).trim().optional(),
        description: zod_1.z.string().max(500).optional(),
    }),
};
