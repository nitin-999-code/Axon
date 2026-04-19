import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";
import config from "../config/index";

/**
 * Global error handling middleware.
 * Catches all errors thrown/passed via next() and returns a consistent JSON response.
 */
const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): Response => {
  let statusCode: number = err.statusCode || 500;
  let message: string = err.message || "Internal server error";
  let errors: Array<{ field: string; message: string }> = err.errors || [];

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
    errors = err.issues.map((issue: any) => ({
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
    logger.error(`[${req.method}] ${req.originalUrl} — ${message}`, {
      stack: err.stack,
      body: req.body,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} — ${statusCode} ${message}`);
  }

  // ─── Send response ───────────────────────────
  const response: Record<string, any> = {
    success: false,
    statusCode,
    message,
    ...(errors.length && { errors }),
    ...(config.env === "development" && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

export default errorHandler;
