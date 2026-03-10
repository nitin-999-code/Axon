import config from "../config/index.js";

/**
 * Lightweight structured logger.
 * In production, replace with Winston/Pino for file & transport support.
 */
const LogLevel = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
});

const currentLevel =
  config.env === "production" ? LogLevel.INFO : LogLevel.DEBUG;

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

const logger = {
  debug(message, meta = {}) {
    if (currentLevel <= LogLevel.DEBUG) {
      console.debug(formatMessage("DEBUG", message, meta));
    }
  },

  info(message, meta = {}) {
    if (currentLevel <= LogLevel.INFO) {
      console.info(formatMessage("INFO", message, meta));
    }
  },

  warn(message, meta = {}) {
    if (currentLevel <= LogLevel.WARN) {
      console.warn(formatMessage("WARN", message, meta));
    }
  },

  error(message, meta = {}) {
    if (currentLevel <= LogLevel.ERROR) {
      console.error(formatMessage("ERROR", message, meta));
    }
  },
};

export default logger;
