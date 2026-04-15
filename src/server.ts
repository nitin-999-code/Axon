import createApp from "./app";
import config from "./config/index";
import db from "./config/database";
import logger from "./utils/logger";

/**
 * Server entry point.
 * Connects to the database, starts the HTTP server,
 * and registers graceful shutdown handlers.
 */
const startServer = async (): Promise<void> => {
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
        docs: `http://localhost:${config.port}/api/docs`,
      });
    });

    // ─── Graceful Shutdown ───────────────────────
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`\n${signal} received — shutting down gracefully...`);

      server.close(async () => {
        await db.disconnect();
        logger.info("✅  Server shut down cleanly");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("⚠️  Forced shutdown — graceful shutdown timed out");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // ─── Unhandled Errors ────────────────────────
    process.on("unhandledRejection", (reason: any) => {
      logger.error("Unhandled Promise Rejection", { reason: reason?.message || reason });
    });

    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception", { error: error.message, stack: error.stack });
      process.exit(1);
    });
  } catch (error: any) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

startServer();
