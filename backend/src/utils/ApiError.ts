/**
 * Custom operational error class for the API.
 * Extends native Error to carry HTTP status codes and structured error info.
 */
class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: Array<{ field: string; message: string }>;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: Array<{ field: string; message: string }> = [],
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  // ─── Factory Methods ─────────────────────────

  static badRequest(message: string = "Bad request", errors: Array<{ field: string; message: string }> = []): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Forbidden — insufficient permissions"): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string = "Resource already exists"): ApiError {
    return new ApiError(409, message);
  }

  static unprocessable(message: string = "Unprocessable entity", errors: Array<{ field: string; message: string }> = []): ApiError {
    return new ApiError(422, message, errors);
  }

  static tooMany(message: string = "Too many requests — slow down"): ApiError {
    return new ApiError(429, message);
  }

  static internal(message: string = "Internal server error"): ApiError {
    return new ApiError(500, message, [], false);
  }
}

export default ApiError;
