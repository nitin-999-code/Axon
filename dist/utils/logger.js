"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const index_1 = __importDefault(require("../config/index"));
const { combine, timestamp, printf, colorize, errors } = winston_1.default.format;
/**
 * Production-grade structured logger using Winston.
 * Replaces all console.log calls with leveled, structured output.
 */
const devFormat = combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaStr}${stack ? `\n${stack}` : ""}`;
}));
const prodFormat = combine(timestamp(), errors({ stack: true }), winston_1.default.format.json());
const logger = winston_1.default.createLogger({
    level: index_1.default.env === "production" ? "info" : "debug",
    format: index_1.default.env === "production" ? prodFormat : devFormat,
    defaultMeta: { service: "axon-api" },
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: "logs/combined.log",
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
exports.default = logger;
