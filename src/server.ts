import createApp from "./app.js";
import config from "./config/index.js";
import db from "./config/database.js";
import logger from "./utils/logger.js";

/**
 * Server entry point.
 * Connects to the database, starts the HTTP server,
 * and registers graceful shutdown handlers.
 */
const startServer = async () => {
  try {
    // Connect to database
    await db.connect();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`🚀  Axon API server running`, {
        port: config.port,
        env: config.env,
        url: `http://localhost:${config.port}`,
      });
    });

    // ─── Graceful Shutdown ───────────────────────
    const shutdown = async (signal) => {
      logger.info(`\n${signal} received — shutting down gracefully...`);

      server.close(async () => {
        await db.disconnect();
        logger.info("✅  Server shut down cleanly");
        process.exit(0);
      });

      // Force shutdown after 10s if graceful fails
      setTimeout(() => {
        logger.error("⚠️  Forced shutdown — graceful shutdown timed out");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // ─── Unhandled Errors ────────────────────────
    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Promise Rejection", { reason: reason?.message || reason });
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception", { error: error.message, stack: error.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

startServer();
