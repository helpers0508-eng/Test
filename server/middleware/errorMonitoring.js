const fs = require('fs').promises;
const path = require('path');

class ErrorMonitor {
  constructor() {
    this.errorLogFile = path.join(__dirname, '..', 'logs', 'errors.log');
    this.performanceLogFile = path.join(__dirname, '..', 'logs', 'performance.log');
    this.ensureLogDirectories();

    // Error tracking
    this.errorCounts = new Map();
    this.errorThresholds = {
      'VALIDATION_ERROR': 10,
      'AUTH_ERROR': 5,
      'DATABASE_ERROR': 3,
      'RATE_LIMIT_ERROR': 20
    };

    // Performance tracking
    this.slowRequests = [];
    this.slowThreshold = 5000; // 5 seconds
  }

  async ensureLogDirectories() {
    try {
      await fs.mkdir(path.dirname(this.errorLogFile), { recursive: true });
      await fs.mkdir(path.dirname(this.performanceLogFile), { recursive: true });
    } catch (error) {
      console.error('Failed to create log directories:', error);
    }
  }

  async logError(error, req, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      errorId: context.errorId || Date.now().toString(36),
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      url: req?.url,
      method: req?.method,
      userId: req?.user?.id || 'anonymous',
      ip: req?.ip,
      userAgent: req?.get?.('User-Agent'),
      ...context
    };

    // Track error frequency
    const errorType = this.categorizeError(error);
    this.errorCounts.set(errorType, (this.errorCounts.get(errorType) || 0) + 1);

    // Alert on threshold breaches
    if (this.errorThresholds[errorType] && this.errorCounts.get(errorType) >= this.errorThresholds[errorType]) {
      await this.alertThresholdBreach(errorType, this.errorCounts.get(errorType));
      this.errorCounts.set(errorType, 0); // Reset counter
    }

    try {
      await fs.appendFile(this.errorLogFile, JSON.stringify(errorEntry) + '\n');
    } catch (logError) {
      console.error('Failed to write error log:', logError);
    }

    // In production, send to external monitoring service
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      // Integrate with Sentry or similar service
      this.sendToExternalMonitor(errorEntry);
    }
  }

  categorizeError(error) {
    if (error.message.includes('validation') || error.name === 'ValidationError') {
      return 'VALIDATION_ERROR';
    }
    if (error.message.includes('auth') || error.name === 'JsonWebTokenError') {
      return 'AUTH_ERROR';
    }
    if (error.code && error.code.startsWith('42')) {
      return 'DATABASE_ERROR';
    }
    if (error.message.includes('Too many')) {
      return 'RATE_LIMIT_ERROR';
    }
    return 'UNKNOWN_ERROR';
  }

  async alertThresholdBreach(errorType, count) {
    const alertEntry = {
      timestamp: new Date().toISOString(),
      type: 'ERROR_THRESHOLD_BREACH',
      errorType,
      count,
      threshold: this.errorThresholds[errorType]
    };

    console.error(`🚨 ALERT: ${errorType} threshold breached (${count}/${this.errorThresholds[errorType]})`);

    try {
      await fs.appendFile(this.errorLogFile, JSON.stringify(alertEntry) + '\n');
    } catch (error) {
      console.error('Failed to write alert log:', error);
    }

    // In production, send alert to monitoring system
    if (process.env.NODE_ENV === 'production') {
      this.sendAlert(alertEntry);
    }
  }

  async logPerformance(req, res, duration) {
    if (duration < this.slowThreshold) return;

    const perfEntry = {
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
      duration,
      userId: req.user?.id || 'anonymous',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode
    };

    this.slowRequests.push(perfEntry);

    // Keep only last 100 slow requests
    if (this.slowRequests.length > 100) {
      this.slowRequests = this.slowRequests.slice(-100);
    }

    try {
      await fs.appendFile(this.performanceLogFile, JSON.stringify(perfEntry) + '\n');
    } catch (error) {
      console.error('Failed to write performance log:', error);
    }

    // Alert on very slow requests
    if (duration > 30000) { // 30 seconds
      console.warn(`🐌 CRITICAL: Very slow request (${duration}ms) - ${req.method} ${req.url}`);
    }
  }

  getErrorStats() {
    return {
      totalErrors: Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0),
      errorBreakdown: Object.fromEntries(this.errorCounts),
      slowRequestsCount: this.slowRequests.length,
      recentSlowRequests: this.slowRequests.slice(-5)
    };
  }

  sendToExternalMonitor(errorEntry) {
    // Placeholder for external monitoring service integration
    // Example: Sentry, Rollbar, Bugsnag, etc.
    if (process.env.SENTRY_DSN) {
      // Sentry.captureException(errorEntry);
      console.log('Would send to external monitor:', errorEntry.errorId);
    }
  }

  sendAlert(alertEntry) {
    // Placeholder for alert system integration
    // Example: Slack, PagerDuty, email alerts, etc.
    console.log('Would send alert:', alertEntry);
  }
}

// Create singleton instance
const errorMonitor = new ErrorMonitor();

// Middleware for error monitoring
const errorMonitoringMiddleware = (err, req, res, next) => {
  errorMonitor.logError(err, req, {
    statusCode: res.statusCode,
    responseTime: res.responseTime
  });
  next(err); // Continue to next error handler
};

// Middleware for performance monitoring
const performanceMonitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    errorMonitor.logPerformance(req, res, duration);
  });

  next();
};

module.exports = {
  errorMonitor,
  errorMonitoringMiddleware,
  performanceMonitoringMiddleware
};