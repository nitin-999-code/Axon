import ApiError from "../utils/ApiError.js";

/**
 * Request validation middleware factory using Zod schemas.
 * Validates body, query, and/or params against provided schemas.
 *
 * @param {Object} schemas - Object with optional body, query, params Zod schemas
 * @returns {Function} Express middleware
 */
const validate = (schemas) => {
  return (req, _res, next) => {
    const errors = [];

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
        req.body = result.data; // Use parsed/transformed data
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
        req.query = result.data;
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
        req.params = result.data;
      }
    }

    if (errors.length > 0) {
      return next(ApiError.unprocessable("Validation failed", errors));
    }

    next();
  };
};

export default validate;
