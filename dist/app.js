"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const index_1 = __importDefault(require("./config/index"));
const index_2 = __importDefault(require("./routes/index"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const swagger_1 = __importDefault(require("./config/swagger"));
// Initialize Side-Effect Observers (Observer Pattern)
require("./services/notification.service");
/**
 * Express application factory.
 * Configures middleware stack and mounts routes.
 */
const createApp = () => {
    const app = (0, express_1.default)();
    // ─── Security ─────────────────────────────────
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: index_1.default.cors.origin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(rateLimiter_1.rateLimiter);
    // ─── Parsing ──────────────────────────────────
    app.use(express_1.default.json({ limit: "16kb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
    app.use((0, cookie_parser_1.default)());
    // ─── Logging ──────────────────────────────────
    if (index_1.default.env === "development") {
        app.use((0, morgan_1.default)("dev"));
    }
    else {
        app.use((0, morgan_1.default)("combined"));
    }
    // ─── Swagger API Docs ─────────────────────────
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
    // ─── API Routes ───────────────────────────────
    app.use("/api", index_2.default);
    // ─── Root ─────────────────────────────────────
    app.get("/", (_req, res) => {
        res.json({
            name: "Axon API",
            version: "1.0.0",
            description: "Smart Project Management Platform",
            docs: "/api/docs",
            health: "/api/health",
        });
    });
    // ─── 404 Handler ──────────────────────────────
    app.use((_req, _res, next) => {
        next(ApiError_1.default.notFound("Route not found"));
    });
    // ─── Global Error Handler ─────────────────────
    app.use(errorHandler_1.default);
    return app;
};
exports.default = createApp;
