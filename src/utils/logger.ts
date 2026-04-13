import config from "../config/index";

/**
 * Lightweight structured logger.
 * In production, replace with Winston/Pino for file & transport support.
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const currentLevel: LogLevel =
  config.env === "production" ? LogLevel.INFO : LogLevel.DEBUG;

function formatMessage(level: string, message: string, meta: Record<string, any> = {}): string {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

const logger = {
  debug(message: string, meta: Record<string, any> = {}): void {
    if (currentLevel <= LogLevel.DEBUG) {
      console.debug(formatMessage("DEBUG", message, meta));
    }
  },

  info(message: string, meta: Record<string, any> = {}): void {
    if (currentLevel <= LogLevel.INFO) {
      console.info(formatMessage("INFO", message, meta));
    }
  },

  warn(message: string, meta: Record<string, any> = {}): void {
    if (currentLevel <= LogLevel.WARN) {
      console.warn(formatMessage("WARN", message, meta));
    }
  },

  error(message: string, meta: Record<string, any> = {}): void {
    if (currentLevel <= LogLevel.ERROR) {
      console.error(formatMessage("ERROR", message, meta));
    }
  },
};

export default logger;
