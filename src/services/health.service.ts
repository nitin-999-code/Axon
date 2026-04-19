import { prisma } from "../config/database.js";
import logger from "../utils/logger.js";

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
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;

      (health.checks as any).database = {
        status: "connected",
        latencyMs: latency,
      };
    } catch (error) {
      health.status = "degraded";
      (health.checks as any).database = {
        status: "disconnected",
        error: (error as Error).message,
      };
      logger.error("Health check — database unreachable", { error: (error as Error).message });
    }

    // Memory usage
    const memUsage = process.memoryUsage();
    (health.checks as any).memory = {
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
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ready", timestamp: new Date().toISOString() };
    } catch {
      return { status: "not_ready", timestamp: new Date().toISOString() };
    }
  }
}

export default new HealthService();
