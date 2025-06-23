const multer = require('multer');
const rateLimit = require('express-rate-limit');

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // 1. Handle rate limit errors
  if (err instanceof rateLimit.RateLimitError) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti',
      timestamp: new Date().toISOString(),
      retryAfter: err.retryAfter || null
    });
  }

  // 2. Prisma errors
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'Data already exists',
          field: err.meta?.target,
          timestamp: new Date().toISOString()
        });
      
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
          timestamp: new Date().toISOString()
        });
      
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Foreign key constraint failed',
          timestamp: new Date().toISOString()
        });
      
      case 'P2014':
        return res.status(400).json({
          success: false,
          message: 'Invalid ID provided',
          timestamp: new Date().toISOString()
        });
      
      default:
        return res.status(500).json({
          success: false,
          message: 'Database error occurred',
          code: err.code,
          timestamp: new Date().toISOString()
        });
    }
  }

  // 3. Multer errors (file upload)
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File size too large',
          maxSize: req.app.get('maxFileSize') || '10MB',
          timestamp: new Date().toISOString()
        });
      
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files uploaded',
          maxCount: req.app.get('maxFileCount') || 5,
          timestamp: new Date().toISOString()
        });
      
      case 'LIMIT_FIELD_KEY':
        return res.status(400).json({
          success: false,
          message: 'Field name too long',
          timestamp: new Date().toISOString()
        });
      
      case 'LIMIT_PART_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many form parts',
          timestamp: new Date().toISOString()
        });
      
      default:
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
          code: err.code,
          timestamp: new Date().toISOString()
        });
    }
  }

  // 4. JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      expiresAt: err.expiredAt,
      timestamp: new Date().toISOString()
    });
  }

  // 5. Validation errors
  if (err.name === 'ValidationError') {
    const errors = {};
    
    // Extract validation errors
    for (const field in err.errors) {
      errors[field] = {
        message: err.errors[field].message,
        kind: err.errors[field].kind
      };
    }
    
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // 6. Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      timestamp: new Date().toISOString()
    });
  }

  // 7. Custom application errors
  if (err.isCustomError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
      timestamp: new Date().toISOString()
    });
  }

  // 8. Default server error
  const statusCode = err.status || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
    suggestions: [
      'Check the URL for typos',
      'Verify the HTTP method (GET, POST, etc.)',
      'Consult the API documentation'
    ]
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};