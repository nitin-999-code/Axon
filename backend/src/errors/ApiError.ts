export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: any = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new ApiError(message, 400);
  }

  static unauthorized(message: string) {
    return new ApiError(message, 401);
  }

  static forbidden(message: string) {
    return new ApiError(message, 403);
  }

  static notFound(message: string) {
    return new ApiError(message, 404);
  }

  static conflict(message: string) {
    return new ApiError(message, 409);
  }
}
