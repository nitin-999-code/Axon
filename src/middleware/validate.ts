import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import ApiError from "../utils/ApiError";

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Request validation middleware factory using Zod schemas.
 * Validates body, query, and/or params against provided schemas.
 */
const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: `body.${issue.path.join(".")}`,
            message: issue.message,
          }))
        );
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: `query.${issue.path.join(".")}`,
            message: issue.message,
          }))
        );
      } else {
        (req as any).query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: `params.${issue.path.join(".")}`,
            message: issue.message,
          }))
        );
      } else {
        (req as any).params = result.data;
      }
    }

    if (errors.length > 0) {
      return next(ApiError.unprocessable("Validation failed", errors));
    }

    next();
  };
};

export default validate;
