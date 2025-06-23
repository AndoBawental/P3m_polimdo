// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { handleUploadError } = require('./middlewares/uploadHandler');
const { ensureUploadDirs } = require('./utils/helper');

const app = express();
const prisma = new PrismaClient();

// === Configuration ===
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const API_BASE_PATH = '/api';
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || '10mb';

// Ensure upload directories exist
ensureUploadDirs();

// === Security Middleware ===
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// === CORS Configuration ===
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// === Rate Limiting ===
const { api: apiLimiter, auth: authLimiter, upload: uploadLimiter } = require('./middlewares/rateLimiter');
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// === Logging ===
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// === Body Parser ===
app.use(express.json({ limit: MAX_FILE_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_FILE_SIZE }));

// === Static File Serving ===
app.use('/uploads', express.static(UPLOAD_DIR));

// === API Routes ===
app.use(API_BASE_PATH, routes);

app.use(apiLimiter);

app.use('/auth', authLimiter);

app.use('/files', uploadLimiter);

// === Health Check ===
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'P3M Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.API_VERSION || 'v1',
    database: 'connected'
  });
});

// === Upload Error Handler ===
app.use(handleUploadError);

// === Error Handlers ===
app.use('*', notFoundHandler);
app.use(errorHandler);

// === Start Server ===
const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');

    app.listen(PORT, HOST, () => {
      console.log(`
        🚀 Server running at http://${HOST}:${PORT}
        📝 API Base Path: http://${HOST}:${PORT}${API_BASE_PATH}
        🏥 Health Check: http://${HOST}:${PORT}/health
        📁 Upload Directory: ${UPLOAD_DIR}
        🌿 Environment: ${process.env.NODE_ENV || 'development'}
        🔐 Auth Endpoints:
           - POST ${API_BASE_PATH}/auth/login
           - POST ${API_BASE_PATH}/auth/register
           - GET  ${API_BASE_PATH}/auth/profile
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Prisma disconnected');
  process.exit(0);
});