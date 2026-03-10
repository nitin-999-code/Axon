import healthService from "../services/health.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Health Controller — exposes system health endpoints.
 */
class HealthController {
  /**
   * GET /api/health
   * Full health check with DB connectivity and memory stats.
   */
  getHealth = asyncHandler(async (_req, res) => {
    const health = await healthService.getHealth();
    const statusCode = health.status === "healthy" ? 200 : 503;
    return new ApiResponse(statusCode, `System is ${health.status}`, health).send(res);
  });

  /**
   * GET /api/health/live
   * Lightweight liveness probe.
   */
  getLiveness = asyncHandler(async (_req, res) => {
    const liveness = await healthService.getLiveness();
    return ApiResponse.ok(res, "Server is alive", liveness);
  });

  /**
   * GET /api/health/ready
   * Readiness probe — confirms DB is reachable.
   */
  getReadiness = asyncHandler(async (_req, res) => {
    const readiness = await healthService.getReadiness();
    const statusCode = readiness.status === "ready" ? 200 : 503;
    return new ApiResponse(statusCode, `Server is ${readiness.status}`, readiness).send(res);
  });
}

export default new HealthController();
