/**
 * Custom operational error class for the API.
 * Extends native Error to carry HTTP status codes and structured error info.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Additional error details (e.g., validation errors)
   * @param {boolean} isOperational - Whether this is an expected operational error
   */
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Capture stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }

  // ─── Factory Methods ─────────────────────────

  static badRequest(message = "Bad request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden — insufficient permissions") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Resource already exists") {
    return new ApiError(409, message);
  }

  static unprocessable(message = "Unprocessable entity", errors = []) {
    return new ApiError(422, message, errors);
  }

  static tooMany(message = "Too many requests — slow down") {
    return new ApiError(429, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message, [], false);
  }
}

export default ApiError;
