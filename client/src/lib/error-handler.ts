/**
 * Error Handler Utility
 * Provides comprehensive error handling, logging, and user-friendly error formatting
 */

export interface ErrorInfo {
  message: string
  type: string
  status?: number
  statusText?: string
  stack?: string
}

export interface ErrorBoundary {
  fallback: string
  onError: (error: any) => void
}

class ErrorHandler {
  /**
   * Main error handling method that processes any type of error
   */
  handleError(error: any): ErrorInfo {
    console.error('Error caught:', error)

    if (error instanceof Error) {
      return {
        message: error.message,
        type: error.constructor.name,
        stack: error.stack,
      }
    }

    if (typeof error === 'string') {
      return {
        message: error,
        type: 'string',
        stack: undefined,
      }
    }

    if (error && typeof error === 'object') {
      const result: ErrorInfo = {
        message: error.message || 'Unknown error occurred',
        type: 'object',
        stack: undefined,
      }

      // Add HTTP-specific properties if they exist
      if (error.status !== undefined) {
        result.status = error.status
      }
      if (error.statusText !== undefined) {
        result.statusText = error.statusText
      }

      return result
    }

    // Handle null, undefined, or other primitive types
    if (error === null) {
      return {
        message: 'Unknown error occurred',
        type: 'object',
        stack: undefined,
      }
    }

    if (error === undefined) {
      return {
        message: 'Unknown error occurred',
        type: 'undefined',
        stack: undefined,
      }
    }

    return {
      message: 'Unknown error occurred',
      type: 'object',
      stack: undefined,
    }
  }

  /**
   * Extract error message from various error types
   */
  getErrorMessage(error: any): string {
    if (!error) {
      return 'An unexpected error occurred'
    }

    if (typeof error === 'string') {
      return error
    }

    if (error instanceof Error) {
      return error.message
    }

    if (error && typeof error === 'object' && error.message) {
      return error.message
    }

    return 'An unexpected error occurred'
  }

  /**
   * Check if error is a network-related error
   */
  isNetworkError(error: any): boolean {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return true
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('network timeout') ||
             message.includes('connection refused') ||
             message.includes('failed to fetch')
    }

    if (typeof error === 'string') {
      const message = error.toLowerCase()
      return message.includes('failed to fetch') ||
             message.includes('network timeout') ||
             message.includes('connection refused')
    }

    if (error && typeof error === 'object' && error.message) {
      const message = error.message.toLowerCase()
      return message.includes('network timeout') ||
             message.includes('connection refused') ||
             message.includes('failed to fetch')
    }

    return false
  }

  /**
   * Check if error is an HTTP error with status code
   */
  isHttpError(error: any): boolean {
    if (!error || typeof error !== 'object') {
      return false
    }

    return error.status !== undefined || error.statusCode !== undefined
  }

  /**
   * Extract HTTP status code from error
   */
  getHttpStatus(error: any): number | null {
    if (!error || typeof error !== 'object') {
      return null
    }

    return error.status || error.statusCode || null
  }

  /**
   * Format error message for end users
   */
  formatErrorForUser(error: any): string {
    // Check for network errors first
    if (this.isNetworkError(error)) {
      return 'Network connection error. Please check your internet connection and try again.'
    }

    // Check for HTTP errors
    if (this.isHttpError(error)) {
      const status = this.getHttpStatus(error)

      switch (status) {
        case 401:
          return 'Your session has expired. Please log in again.'
        case 403:
          return 'You do not have permission to perform this action.'
        case 404:
          return 'The requested resource was not found.'
        case 500:
          return 'A server error occurred. Please try again later.'
        default:
          // For other HTTP errors, return the original message if it exists
          const message = this.getErrorMessage(error)
          return message !== 'An unexpected error occurred' ? message : 'An unexpected error occurred. Please try again.'
      }
    }

    // For non-HTTP errors, check if the message seems user-friendly
    const message = this.getErrorMessage(error)

    // If the message seems like a user-friendly validation message, return it
    // But exclude technical error messages
    if (message && !message.includes('stack') && !message.includes('TypeError') &&
        !message.includes('ReferenceError') && !message.includes('internal') &&
        !message.includes('Internal') && message.length < 100) {
      return message
    }

    // Default fallback for technical errors
    return 'An unexpected error occurred. Please try again.'
  }

  /**
   * Log error with optional context
   */
  logError(error: any, context?: any): void {
    const errorInfo = this.handleError(error)
    const logData = {
      error: errorInfo,
      context,
      timestamp: new Date().toISOString(),
    }

    console.error('Error logged:', logData)
  }

  /**
   * Create error boundary configuration for React components
   */
  createErrorBoundary(fallback?: string): ErrorBoundary {
    return {
      fallback: fallback || 'Something went wrong. Please refresh the page.',
      onError: (error: any) => {
        console.error('Error boundary caught:', error)
        this.logError(error, { source: 'ErrorBoundary' })
      },
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler()

// Export class for testing or custom instances
export { ErrorHandler }
