"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message) {
        return new ApiError(message, 400);
    }
    static unauthorized(message) {
        return new ApiError(message, 401);
    }
    static forbidden(message) {
        return new ApiError(message, 403);
    }
    static notFound(message) {
        return new ApiError(message, 404);
    }
    static conflict(message) {
        return new ApiError(message, 409);
    }
}
exports.ApiError = ApiError;
