const rateLimit = require('express-rate-limit');
const logger = require('./logger');

// Rate limiter untuk authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth
  message: {
    success: false,
    message: 'Terlalu banyak permintaan autentikasi, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for authentication: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiter untuk API endpoints umum
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Terlalu banyak permintaan, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for API: ${req.ip} [${req.method} ${req.originalUrl}]`);
    res.status(options.statusCode).json(options.message);
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.originalUrl.includes('/health');
  }
});

// Rate limiter untuk upload files
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Terlalu banyak unggahan file, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for uploads: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = {
  auth: authLimiter,
  api: apiLimiter,
  upload: uploadLimiter
};