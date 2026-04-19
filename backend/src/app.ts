import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import config from "./config/index";
import routes from "./routes/index";
import errorHandler from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import ApiError from "./utils/ApiError";
import swaggerSpec from "./config/swagger";

// Initialize Side-Effect Observers (Observer Pattern)
import "./services/notification.service";

/**
 * Express application factory.
 * Configures middleware stack and mounts routes.
 */
const createApp = (): express.Application => {
  const app = express();

  // ─── Security ─────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: function (origin, callback) {
        callback(null, true); // Reflects the requesting origin (bypassing CORS origin checks for now)
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

  // ─── Swagger API Docs ─────────────────────────
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // ─── API Routes ───────────────────────────────
  app.use("/api", routes);

  // ─── Root ─────────────────────────────────────
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      name: "Axon API",
      version: "1.0.0",
      description: "Smart Project Management Platform",
      docs: "/api/docs",
      health: "/api/health",
    });
  });

  // ─── 404 Handler ──────────────────────────────
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(ApiError.notFound("Route not found"));
  });

  // ─── Global Error Handler ─────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
