"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const logger_js_1 = __importDefault(require("../utils/logger.js"));
/**
 * Health Service — system health and readiness checks.
 */
class HealthService {
    /**
     * Full health check — verifies database connectivity and returns system info.
     */
    async getHealth() {
        const health = {
            status: "healthy",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || "development",
            version: process.env.npm_package_version || "1.0.0",
            checks: {},
        };
        // Database check
        try {
            const start = Date.now();
            await database_js_1.prisma.$queryRaw `SELECT 1`;
            const latency = Date.now() - start;
            health.checks.database = {
                status: "connected",
                latencyMs: latency,
            };
        }
        catch (error) {
            health.status = "degraded";
            health.checks.database = {
                status: "disconnected",
                error: error.message,
            };
            logger_js_1.default.error("Health check — database unreachable", { error: error.message });
        }
        // Memory usage
        const memUsage = process.memoryUsage();
        health.checks.memory = {
            rssBytes: memUsage.rss,
            heapUsedBytes: memUsage.heapUsed,
            heapTotalBytes: memUsage.heapTotal,
            rssMB: Math.round(memUsage.rss / 1024 / 1024),
        };
        return health;
    }
    /**
     * Lightweight liveness probe — just confirms the server is running.
     */
    async getLiveness() {
        return {
            status: "alive",
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Readiness probe — confirms the server can accept requests (DB is reachable).
     */
    async getReadiness() {
        try {
            await database_js_1.prisma.$queryRaw `SELECT 1`;
            return { status: "ready", timestamp: new Date().toISOString() };
        }
        catch {
            return { status: "not_ready", timestamp: new Date().toISOString() };
        }
    }
}
exports.default = new HealthService();
