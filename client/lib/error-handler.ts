// Error handling utility
// Replaces console.error with proper error handling

import process from "node:process";

interface ErrorLog {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

class ErrorHandler {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log error (only in development)
   */
  logError(error: Error | string, context?: Record<string, unknown>) {
    if (!this.isDevelopment) {
      // In production, send to error tracking service
      this.sendToErrorTracking(error, context);
      return;
    }

    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
    };

    console.error('[Error]', errorLog);
  }

  /**
   * Send error to tracking service (e.g., Sentry, LogRocket)
   */
  private sendToErrorTracking(_error: Error | string, _context?: Record<string, unknown>) {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(error, { extra: context });
  }

  /**
   * Handle API errors
   */
  handleApiError(error: unknown, defaultMessage: string = 'An error occurred'): string {
    if ((error as any)?.response?.data?.message) {
      return (error as any).response.data.message;
    }
    if ((error as any)?.message) {
      return (error as any).message;
    }
    return defaultMessage;
  }
}

export const errorHandler = new ErrorHandler();


