"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/**
 * Auth validation schemas (Zod).
 */
exports.registerSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Name is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .trim(),
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must not exceed 128 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one digit"),
    }),
};
exports.loginSchema = {
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(1, "Password is required"),
    }),
};
