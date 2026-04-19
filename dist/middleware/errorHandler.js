"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const index_1 = __importDefault(require("../config/index"));
/**
 * Global error handling middleware.
 * Catches all errors thrown/passed via next() and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || [];
    // ─── Prisma Known Errors ──────────────────────
    if (err.code === "P2002") {
        statusCode = 409;
        const field = err.meta?.target?.join(", ") || "field";
        message = `Duplicate value — ${field} already exists`;
    }
    if (err.code === "P2025") {
        statusCode = 404;
        message = "Record not found";
    }
    // ─── Validation Errors (Zod) ──────────────────
    if (err.name === "ZodError") {
        statusCode = 422;
        message = "Validation failed";
        errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
    }
    // ─── JWT Errors ───────────────────────────────
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired — please login again";
    }
    // ─── Log the error ────────────────────────────
    if (statusCode >= 500) {
        logger_1.default.error(`[${req.method}] ${req.originalUrl} — ${message}`, {
            stack: err.stack,
            body: req.body,
        });
    }
    else {
        logger_1.default.warn(`[${req.method}] ${req.originalUrl} — ${statusCode} ${message}`);
    }
    // ─── Send response ───────────────────────────
    const response = {
        success: false,
        statusCode,
        message,
        ...(errors.length && { errors }),
        ...(index_1.default.env === "development" && { stack: err.stack }),
    };
    return res.status(statusCode).json(response);
};
exports.default = errorHandler;
