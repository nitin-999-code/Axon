"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberSchema = exports.createWorkspaceSchema = void 0;
const zod_1 = require("zod");
const constants_js_1 = require("../utils/constants.js");
/**
 * Workspace validation schemas (Zod).
 */
exports.createWorkspaceSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Workspace name is required" })
            .min(3, "Name must be at least 3 characters")
            .max(100, "Name must not exceed 100 characters")
            .trim(),
        description: zod_1.z
            .string()
            .max(500, "Description must not exceed 500 characters")
            .optional(),
    }),
};
exports.addMemberSchema = {
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        role: zod_1.z.enum([constants_js_1.ROLES.OWNER, constants_js_1.ROLES.ADMIN, constants_js_1.ROLES.MEMBER]).optional(),
    }),
};
