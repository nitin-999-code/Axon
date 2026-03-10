import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import config from "./config/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import ApiError from "./utils/ApiError.js";

/**
 * Express application factory.
 * Configures middleware stack and mounts routes.
 */
const createApp = () => {
  const app = express();

  // ─── Security ─────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(rateLimiter);

  // ─── Parsing ──────────────────────────────────
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(cookieParser());

  // ─── Logging ──────────────────────────────────
  if (config.env === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // ─── API Routes ───────────────────────────────
  app.use("/api", routes);

  // ─── Root ─────────────────────────────────────
  app.get("/", (_req, res) => {
    res.json({
      name: "Axon API",
      version: "1.0.0",
      description: "Smart Project Management Platform",
      docs: "/api/health",
    });
  });

  // ─── 404 Handler ──────────────────────────────
  app.use((_req, _res, next) => {
    next(ApiError.notFound("Route not found"));
  });

  // ─── Global Error Handler ─────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
