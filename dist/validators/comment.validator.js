"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentSchema = void 0;
const zod_1 = require("zod");
exports.addCommentSchema = {
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Comment cannot be empty").max(2000),
        parentCommentId: zod_1.z.string().uuid().optional(),
    }),
};
