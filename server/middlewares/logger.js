const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Pastikan direktori logs ada sebelum membuat logger
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Winston formatters
const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const baseLog = {
    timestamp,
    level: level.toUpperCase(),
    message,
    pid: process.pid,
    ...(meta.userId && { userId: meta.userId })
  };

  if (stack) {
    baseLog.stack = stack;
  }

  // Handle special meta properties
  const { method, url, statusCode, duration, ip, userAgent, ...otherMeta } = meta;
  const finalMeta = {};
  
  if (method) finalMeta.method = method;
  if (url) finalMeta.url = url;
  if (statusCode) finalMeta.statusCode = statusCode;
  if (duration) finalMeta.duration = duration;
  if (ip) finalMeta.ip = ip;
  if (userAgent) finalMeta.userAgent = userAgent;
  
  if (Object.keys(otherMeta).length > 0) {
    finalMeta.details = otherMeta;
  }

  if (Object.keys(finalMeta).length > 0) {
    baseLog.meta = finalMeta;
  }

  return JSON.stringify(baseLog);
});

// Logger instance
const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  },
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(info => {
          const { timestamp, level, message, ...meta } = info;
          let log = `${timestamp} [${level}]: ${message}`;
          
          if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
          }
          
          return log;
        })
      )
    }),

    // Daily rotate for application logs
    new DailyRotateFile({
      level: 'info',
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '30d'
    }),

    // Daily rotate for error logs
    new DailyRotateFile({
      level: 'error',
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '90d'
    })
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '30d'
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// HTTP request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capture user ID if available
  const userId = req.user?.id || null;

  // Skip logging for health checks and OPTIONS requests
  if (req.originalUrl.includes('/health') || req.method === 'OPTIONS') {
    return next();
  }

  // Log request
  logger.info('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Skip logging for successful health checks
    if (req.originalUrl.includes('/health') && res.statusCode === 200) {
      return;
    }
    
    // Determine log level based on status code
    const level = res.statusCode >= 500 ? 'error' : 
                 res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.log(level, 'HTTP Response', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId
    });
  });

  next();
};

// Utility function for logging database queries
const queryLogger = (query) => {
  logger.debug('Database Query', {
    model: query.model,
    action: query.action,
    duration: `${query.duration}ms`,
    query: query.query
  });
};

// Export logger instance directly
module.exports = {
  logger,
  requestLogger,
  queryLogger,
  LOG_LEVELS
};