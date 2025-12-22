const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
import process from "node:process";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file or environment configuration.');
  process.exit(1);
}

// Validate JWT_SECRET strength in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long in production');
    process.exit(1);
  }
}

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

// Import middleware
const { _authenticateToken, _requireRole, _requireOwnershipOrAdmin } = require('./middleware/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Audit logging
class AuditLogger {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'audit.log');
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    try {
      await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  async log(action, userId, details = {}) {
    if (process.env.ENABLE_AUDIT_LOGS !== 'true') return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      ...details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };

    try {
      await fs.appendFile(this.logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}

const auditLogger = new AuditLogger();

// Database connection with error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: isProduction ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
  auditLogger.log('DATABASE_ERROR', 'system', { error: err.message });
});

// Verify database connection on startup
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection established');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('Please check your DATABASE_URL environment variable.');
    process.exit(1);
  });

// Compression middleware (production only)
if (isProduction) {
  app.use(compression());
}

// Enhanced middleware for audit logging
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log request
  auditLogger.log('API_REQUEST', req.user?.id || 'anonymous', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    auditLogger.log('API_RESPONSE', req.user?.id || 'anonymous', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration
    });
  });

  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "https://lh3.googleusercontent.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin && isDevelopment) {
      return callback(null, true);
    }

    if (isDevelopment) {
      // Allow localhost in development
      const allowedOrigins = ['http://localhost:8000', 'http://localhost:3000', 'http://localhost:3001'];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Production: strict origin checking
      const allowedOrigins = process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
        : [];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (!origin) {
        // In production, reject requests with no origin for security
        callback(new Error('Origin required in production'));
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting with environment-specific settings
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment && req.ip === '127.0.0.1'
});

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 5 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 300000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment && req.ip === '127.0.0.1'
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Maintenance mode
app.use('/api/', (req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true' && req.path !== '/health') {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable for maintenance'
    });
  }
  next();
});

// Body parsing with size limits
app.use(express.json({
  limit: isProduction ? '1mb' : '10mb',
  verify: (req, _res, buf) => {
    // Log large payloads in production
    if (isProduction && buf.length > 1000000) {
      auditLogger.log('LARGE_PAYLOAD', req.user?.id || 'anonymous', {
        size: buf.length,
        url: req.url
      });
    }
  }
}));
app.use(express.urlencoded({
  extended: true,
  limit: isProduction ? '1mb' : '10mb'
}));

// Make pool available to routes
app.set('pool', pool);

// Routes with enhanced error handling
app.use('/api/auth', (req, _res, next) => {
  auditLogger.log('AUTH_ENDPOINT_ACCESS', req.user?.id || 'anonymous', {
    endpoint: req.path,
    method: req.method
  });
  next();
}, authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Admin routes with enhanced logging
app.use('/api/admin', (req, _res, next) => {
  auditLogger.log('ADMIN_ENDPOINT_ACCESS', req.user?.id || 'anonymous', {
    endpoint: req.path,
    method: req.method,
    role: req.user?.role
  });
  next();
}, adminRoutes);

// Enhanced health check
app.get('/api/health', (_req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: pool.totalCount > 0 ? 'connected' : 'disconnected'
  };

  // Log health checks less frequently
  if (Math.random() < 0.1) { // 10% of health checks
    auditLogger.log('HEALTH_CHECK', 'system', health);
  }

  res.json(health);
});

// Comprehensive error handling
app.use((err, req, res, _next) => {
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Log error details
  auditLogger.log('ERROR_OCCURRED', req.user?.id || 'anonymous', {
    errorId,
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  console.error(`[${errorId}] Error:`, err);

  // Database errors
  if (err.code && err.code.startsWith('42')) {
    return res.status(400).json({
      success: false,
      message: 'Database constraint violation',
      errorId
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      errorId
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired',
      errorId
    });
  }

  // Rate limiting
  if (err.message && err.message.includes('Too many')) {
    return res.status(429).json({
      success: false,
      message: err.message,
      errorId
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: isProduction ? 'An unexpected error occurred' : err.message,
    errorId,
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  auditLogger.log('NOT_FOUND', req.user?.id || 'anonymous', {
    url: req.originalUrl,
    method: req.method
  });

  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  auditLogger.log('SERVER_SHUTDOWN', 'system', { reason: 'SIGTERM' });
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  auditLogger.log('SERVER_SHUTDOWN', 'system', { reason: 'SIGINT' });
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  auditLogger.log('UNHANDLED_REJECTION', 'system', {
    reason: reason?.toString(),
    stack: reason?.stack
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📊 Audit logging: ${process.env.ENABLE_AUDIT_LOGS ? 'enabled' : 'disabled'}`);
  console.log(`🛡️  Rate limiting: active`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);

  // Log server start
  auditLogger.log('SERVER_START', 'system', {
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version
  });
});

module.exports = app;