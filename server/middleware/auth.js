import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audit logging for auth events
class AuthAuditLogger {
  constructor() {
    this.logFile = path.join(__dirname, '..', '..', 'logs', 'auth.log');
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    try {
      await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    } catch (error) {
      console.error('Failed to create auth log directory:', error);
    }
  }

  async log(event, userId, details = {}) {
    if (process.env.ENABLE_AUDIT_LOGS !== 'true') return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId,
      ...details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };

    try {
      await fs.appendFile(this.logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write auth log:', error);
    }
  }
}

const authAuditLogger = new AuthAuditLogger();

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  user: 1,
  helper: 2,
  admin: 3
};

// Middleware to verify JWT token with enhanced security
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    authAuditLogger.log('AUTH_MISSING_TOKEN', 'anonymous', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      authAuditLogger.log('AUTH_INVALID_TOKEN', 'anonymous', {
        error: err.message,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Validate token payload
    if (!user.id || !user.email || !user.role) {
      authAuditLogger.log('AUTH_MALFORMED_TOKEN', user?.id || 'unknown', {
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Check if user role is valid
    if (!(user.role in ROLE_HIERARCHY)) {
      authAuditLogger.log('AUTH_INVALID_ROLE', user.id, {
        role: user.role,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Invalid user role'
      });
    }

    req.user = user;

    // Log successful authentication
    authAuditLogger.log('AUTH_SUCCESS', user.id, {
      role: user.role,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    next();
  });
};

// Middleware to check if user has required role(s)
const requireRole = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      authAuditLogger.log('ROLE_CHECK_NO_USER', 'anonymous', {
        requiredRoles,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const hasPermission = requiredRoles.includes(userRole);

    if (!hasPermission) {
      authAuditLogger.log('ROLE_CHECK_DENIED', req.user.id, {
        userRole,
        requiredRoles,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: requiredRoles,
        current: userRole
      });
    }

    authAuditLogger.log('ROLE_CHECK_SUCCESS', req.user.id, {
      userRole,
      requiredRoles,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    next();
  };
};

// Middleware to check if user has minimum role level
const requireRoleLevel = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 999;

    if (userLevel < requiredLevel) {
      authAuditLogger.log('ROLE_LEVEL_DENIED', req.user.id, {
        userRole: req.user.role,
        userLevel,
        requiredRole: minRole,
        requiredLevel,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Insufficient role level',
        required: minRole,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or has sufficient permissions
const requireOwnershipOrAdmin = (resourceType = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin has access to everything
    if (req.user.role === 'admin') {
      authAuditLogger.log('OWNERSHIP_ADMIN_ACCESS', req.user.id, {
        resourceType,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return next();
    }

    // Check ownership based on resource type
    let resourceOwnerId = null;

    switch (resourceType) {
      case 'user':
        resourceOwnerId = req.params.userId || req.body.userId;
        break;
      case 'booking':
        // For bookings, ownership is checked in the route handler
        // This middleware just ensures authentication
        return next();
      case 'service':
        // Services can be viewed by anyone, edited by admins only
        if (req.method === 'GET') {
          return next();
        }
        break;
      default:
        resourceOwnerId = req.params.id || req.body.id;
    }

    if (resourceOwnerId && req.user.id !== parseInt(resourceOwnerId)) {
      authAuditLogger.log('OWNERSHIP_DENIED', req.user.id, {
        resourceType,
        resourceOwnerId,
        url: req.url,
        method: req.method,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied: resource ownership required'
      });
    }

    authAuditLogger.log('OWNERSHIP_SUCCESS', req.user.id, {
      resourceType,
      resourceOwnerId,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    next();
  };
};

// Middleware to log admin actions
const logAdminAction = (action) => {
  return (req, _res, next) => {
    if (req.user && req.user.role === 'admin') {
      authAuditLogger.log('ADMIN_ACTION', req.user.id, {
        action,
        details: {
          body: req.method !== 'GET' ? req.body : undefined,
          params: req.params,
          query: req.query
        },
        url: req.url,
        method: req.method,
        ip: req.ip
      });
    }
    next();
  };
};

// Middleware to validate request data
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Basic validation - in production, use a validation library like Joi
    const errors = [];

    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];

        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
        }

        if (value && rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }

        if (value && rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }

        if (value && rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters`);
        }

        if (value && rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

export {
  authenticateToken,
  requireRole,
  requireRoleLevel,
  requireOwnershipOrAdmin,
  logAdminAction,
  validateRequest,
  authAuditLogger
};