"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
const database_1 = __importDefault(require("./config/database"));
const logger_1 = __importDefault(require("./utils/logger"));
/**
 * Server entry point.
 * Connects to the database, starts the HTTP server,
 * and registers graceful shutdown handlers.
 */
const startServer = async () => {
    try {
        // Connect to database
        await database_1.default.connect();
        // Create Express app
        const app = (0, app_1.default)();
        // Start listening
        const server = app.listen(index_1.default.port, () => {
            logger_1.default.info(`🚀  Axon API server running`, {
                port: index_1.default.port,
                env: index_1.default.env,
                url: `http://localhost:${index_1.default.port}`,
                docs: `http://localhost:${index_1.default.port}/api/docs`,
            });
        });
        // ─── Graceful Shutdown ───────────────────────
        const shutdown = async (signal) => {
            logger_1.default.info(`\n${signal} received — shutting down gracefully...`);
            server.close(async () => {
                await database_1.default.disconnect();
                logger_1.default.info("✅  Server shut down cleanly");
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.default.error("⚠️  Forced shutdown — graceful shutdown timed out");
                process.exit(1);
            }, 10000);
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
        // ─── Unhandled Errors ────────────────────────
        process.on("unhandledRejection", (reason) => {
            logger_1.default.error("Unhandled Promise Rejection", { reason: reason?.message || reason });
        });
        process.on("uncaughtException", (error) => {
            logger_1.default.error("Uncaught Exception", { error: error.message, stack: error.stack });
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.default.error("Failed to start server", { error: error.message });
        process.exit(1);
    }
};
startServer();
