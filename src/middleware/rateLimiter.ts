import rateLimit from "express-rate-limit";
import config from "../config/index";

/**
 * Global rate limiter — prevents abuse and brute-force attacks.
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests — please try again later",
  },
});

/**
 * Stricter rate limiter for auth endpoints (login, register).
 */
const authRateLimiter = rateLimit({
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

export { rateLimiter, authRateLimiter };
