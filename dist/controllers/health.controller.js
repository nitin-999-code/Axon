"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const health_service_js_1 = __importDefault(require("../services/health.service.js"));
const asyncHandler_js_1 = __importDefault(require("../middleware/asyncHandler.js"));
const ApiResponse_js_1 = __importDefault(require("../utils/ApiResponse.js"));
/**
 * Health Controller — exposes system health endpoints.
 */
class HealthController {
    constructor() {
        /**
         * GET /api/health
         * Full health check with DB connectivity and memory stats.
         */
        this.getHealth = (0, asyncHandler_js_1.default)(async (_req, res) => {
            const health = await health_service_js_1.default.getHealth();
            const statusCode = health.status === "healthy" ? 200 : 503;
            return new ApiResponse_js_1.default(statusCode, `System is ${health.status}`, health).send(res);
        });
        /**
         * GET /api/health/live
         * Lightweight liveness probe.
         */
        this.getLiveness = (0, asyncHandler_js_1.default)(async (_req, res) => {
            const liveness = await health_service_js_1.default.getLiveness();
            return ApiResponse_js_1.default.ok(res, "Server is alive", liveness);
        });
        /**
         * GET /api/health/ready
         * Readiness probe — confirms DB is reachable.
         */
        this.getReadiness = (0, asyncHandler_js_1.default)(async (_req, res) => {
            const readiness = await health_service_js_1.default.getReadiness();
            const statusCode = readiness.status === "ready" ? 200 : 503;
            return new ApiResponse_js_1.default(statusCode, `Server is ${readiness.status}`, readiness).send(res);
        });
    }
}
exports.default = new HealthController();
