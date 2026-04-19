"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestApprovalSchema = void 0;
const zod_1 = require("zod");
exports.requestApprovalSchema = {
    params: zod_1.z.object({
        taskId: zod_1.z.string().uuid("Invalid task ID"),
    }),
};
