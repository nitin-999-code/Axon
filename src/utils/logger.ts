import winston from "winston";
import config from "../config/index";

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Production-grade structured logger using Winston.
 * Replaces all console.log calls with leveled, structured output.
 */
const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaStr}${stack ? `\n${stack}` : ""}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.env === "production" ? "info" : "debug",
  format: config.env === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "axon-api" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export default logger;
