"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_1 = __importDefault(require("../config/index"));
/**
 * Global rate limiter — prevents abuse and brute-force attacks.
 */
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: index_1.default.rateLimit.windowMs,
    max: index_1.default.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests — please try again later",
    },
});
exports.rateLimiter = rateLimiter;
/**
 * Stricter rate limiter for auth endpoints (login, register).
 */
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many auth attempts — please try again in 15 minutes",
    },
});
exports.authRateLimiter = authRateLimiter;
