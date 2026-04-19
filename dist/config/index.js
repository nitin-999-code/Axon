"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = Object.freeze({
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "8000", 10),
    db: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "fallback-dev-secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000), 10),
        max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    },
});
exports.default = config;
