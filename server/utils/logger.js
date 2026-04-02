/**
 * Winston Logger Configuration
 * Provides structured logging with file rotation and multiple log levels
 * @module utils/logger
 */

const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Créer le dossier logs s'il n'existe pas
const fs = require("fs");
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format personnalisé pour les logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transport pour les erreurs (rotation quotidienne)
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "14d", // Garde 14 jours
  format: logFormat,
});

// Transport pour tous les logs (rotation quotidienne)
const combinedFileTransport = new DailyRotateFile({
  filename: path.join(logDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: logFormat,
});

// Transport pour les logs de sécurité
const securityFileTransport = new DailyRotateFile({
  filename: path.join(logDir, "security-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "warn",
  maxSize: "20m",
  maxFiles: "30d", // Garde 30 jours pour la sécurité
  format: logFormat,
});

// Créer le logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    errorFileTransport,
    combinedFileTransport,
    securityFileTransport,
  ],
});

// En développement, ajouter aussi la console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

/**
 * Log HTTP requests
 */
logger.logRequest = (req, res, duration) => {
  const logData = {
    type: "HTTP_REQUEST",
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?.id || "anonymous",
  };

  if (res.statusCode >= 500) {
    logger.error(logData);
  } else if (res.statusCode >= 400) {
    logger.warn(logData);
  } else {
    logger.info(logData);
  }
};

/**
 * Log authentication events
 */
logger.logAuth = (type, data) => {
  const logData = {
    type: `AUTH_${type.toUpperCase()}`,
    timestamp: new Date().toISOString(),
    ...data,
  };

  if (type === "FAILED" || type === "BLOCKED") {
    logger.warn(logData);
  } else {
    logger.info(logData);
  }
};

/**
 * Log security events
 */
logger.logSecurity = (event, data) => {
  logger.warn({
    type: "SECURITY_EVENT",
    event: event,
    timestamp: new Date().toISOString(),
    ...data,
  });
};

/**
 * Log database operations
 */
logger.logDB = (operation, data) => {
  logger.info({
    type: "DATABASE_OPERATION",
    operation: operation,
    timestamp: new Date().toISOString(),
    ...data,
  });
};

module.exports = logger;
