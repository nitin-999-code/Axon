"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wraps async route handlers to catch rejected promises automatically.
 * Eliminates try/catch boilerplate in every controller method.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
