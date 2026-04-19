"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionTaskSchema = exports.createTransitionSchema = exports.createStateSchema = exports.createWorkflowSchema = void 0;
const zod_1 = require("zod");
const constants_js_1 = require("../utils/constants.js");
exports.createWorkflowSchema = {
    body: zod_1.z.object({
        projectId: zod_1.z.string().uuid(),
    }),
};
exports.createStateSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(50),
        description: zod_1.z.string().optional(),
        isInitial: zod_1.z.boolean().default(false),
        isFinal: zod_1.z.boolean().default(false),
    }),
};
exports.createTransitionSchema = {
    body: zod_1.z.object({
        fromStateId: zod_1.z.string().uuid(),
        toStateId: zod_1.z.string().uuid(),
        allowedRoles: zod_1.z.array(zod_1.z.enum([constants_js_1.ROLES.OWNER, constants_js_1.ROLES.ADMIN, constants_js_1.ROLES.MEMBER])).default([]),
    }),
};
exports.transitionTaskSchema = {
    body: zod_1.z.object({
        targetStateName: zod_1.z.string(),
    }),
};
