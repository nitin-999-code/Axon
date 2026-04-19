"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependencySchema = void 0;
const zod_1 = require("zod");
exports.addDependencySchema = {
    body: zod_1.z.object({
        taskId: zod_1.z.string({ required_error: "Task ID is required" }).uuid(),
        dependsOnId: zod_1.z.string({ required_error: "Depends-On Task ID is required" }).uuid(),
    }),
};
