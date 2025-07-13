import { describe, it, expect, vi, beforeEach } from 'vitest'
import { errorHandler } from '../error-handler'

// Mock console methods
const mockConsole = {
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

Object.defineProperty(global, 'console', {
  value: mockConsole,
})

describe('ErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error message')
      
      const result = errorHandler.handleError(error)

      expect(result).toEqual({
        message: 'Test error message',
        type: 'Error',
        stack: expect.any(String),
      })
      expect(mockConsole.error).toHaveBeenCalledWith('Error caught:', error)
    })

    it('should handle string errors', () => {
      const error = 'String error message'
      
      const result = errorHandler.handleError(error)

      expect(result).toEqual({
        message: 'String error message',
        type: 'string',
        stack: undefined,
      })
      expect(mockConsole.error).toHaveBeenCalledWith('Error caught:', error)
    })

    it('should handle HTTP errors with status', () => {
      const error = {
        message: 'HTTP error',
        status: 404,
        statusText: 'Not Found',
      }
      
      const result = errorHandler.handleError(error)

      expect(result).toEqual({
        message: 'HTTP error',
        type: 'object',
        status: 404,
        statusText: 'Not Found',
        stack: undefined,
      })
    })

    it('should handle network errors', () => {
      const error = new TypeError('Failed to fetch')
      
      const result = errorHandler.handleError(error)

      expect(result).toEqual({
        message: 'Failed to fetch',
        type: 'TypeError',
        stack: expect.any(String),
      })
    })

    it('should handle unknown error types', () => {
      const error = { someProperty: 'value' }
      
      const result = errorHandler.handleError(error)

      expect(result).toEqual({
        message: 'Unknown error occurred',
        type: 'object',
        stack: undefined,
      })
    })

    it('should handle null/undefined errors', () => {
      const result1 = errorHandler.handleError(null)
      const result2 = errorHandler.handleError(undefined)

      expect(result1).toEqual({
        message: 'Unknown error occurred',
        type: 'object',
        stack: undefined,
      })

      expect(result2).toEqual({
        message: 'Unknown error occurred',
        type: 'undefined',
        stack: undefined,
      })
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from Error objects', () => {
      const error = new Error('Test error')
      
      const message = errorHandler.getErrorMessage(error)

      expect(message).toBe('Test error')
    })

    it('should return string errors as-is', () => {
      const error = 'String error'
      
      const message = errorHandler.getErrorMessage(error)

      expect(message).toBe('String error')
    })

    it('should extract message from objects with message property', () => {
      const error = { message: 'Object error message' }
      
      const message = errorHandler.getErrorMessage(error)

      expect(message).toBe('Object error message')
    })

    it('should return default message for unknown errors', () => {
      const error = { someProperty: 'value' }
      
      const message = errorHandler.getErrorMessage(error)

      expect(message).toBe('An unexpected error occurred')
    })

    it('should handle null/undefined errors', () => {
      const message1 = errorHandler.getErrorMessage(null)
      const message2 = errorHandler.getErrorMessage(undefined)

      expect(message1).toBe('An unexpected error occurred')
      expect(message2).toBe('An unexpected error occurred')
    })
  })

  describe('isNetworkError', () => {
    it('should identify network errors', () => {
      const networkError = new TypeError('Failed to fetch')
      
      const isNetwork = errorHandler.isNetworkError(networkError)

      expect(isNetwork).toBe(true)
    })

    it('should identify network timeout errors', () => {
      const timeoutError = new Error('Network timeout')
      
      const isNetwork = errorHandler.isNetworkError(timeoutError)

      expect(isNetwork).toBe(true)
    })

    it('should identify connection refused errors', () => {
      const connectionError = new Error('Connection refused')
      
      const isNetwork = errorHandler.isNetworkError(connectionError)

      expect(isNetwork).toBe(true)
    })

    it('should not identify non-network errors as network errors', () => {
      const regularError = new Error('Regular error')
      
      const isNetwork = errorHandler.isNetworkError(regularError)

      expect(isNetwork).toBe(false)
    })

    it('should handle non-Error objects', () => {
      const stringError = 'Failed to fetch'
      const objectError = { message: 'Network timeout' }
      
      const isNetwork1 = errorHandler.isNetworkError(stringError)
      const isNetwork2 = errorHandler.isNetworkError(objectError)

      expect(isNetwork1).toBe(true)
      expect(isNetwork2).toBe(true)
    })
  })

  describe('isHttpError', () => {
    it('should identify HTTP errors with status codes', () => {
      const httpError = { status: 404, message: 'Not found' }
      
      const isHttp = errorHandler.isHttpError(httpError)

      expect(isHttp).toBe(true)
    })

    it('should identify HTTP errors with statusCode property', () => {
      const httpError = { statusCode: 500, message: 'Internal server error' }
      
      const isHttp = errorHandler.isHttpError(httpError)

      expect(isHttp).toBe(true)
    })

    it('should not identify non-HTTP errors as HTTP errors', () => {
      const regularError = new Error('Regular error')
      
      const isHttp = errorHandler.isHttpError(regularError)

      expect(isHttp).toBe(false)
    })

    it('should handle null/undefined', () => {
      const isHttp1 = errorHandler.isHttpError(null)
      const isHttp2 = errorHandler.isHttpError(undefined)

      expect(isHttp1).toBe(false)
      expect(isHttp2).toBe(false)
    })
  })

  describe('getHttpStatus', () => {
    it('should extract status from HTTP errors', () => {
      const httpError = { status: 404, message: 'Not found' }
      
      const status = errorHandler.getHttpStatus(httpError)

      expect(status).toBe(404)
    })

    it('should extract statusCode from HTTP errors', () => {
      const httpError = { statusCode: 500, message: 'Internal server error' }
      
      const status = errorHandler.getHttpStatus(httpError)

      expect(status).toBe(500)
    })

    it('should return null for non-HTTP errors', () => {
      const regularError = new Error('Regular error')
      
      const status = errorHandler.getHttpStatus(regularError)

      expect(status).toBeNull()
    })

    it('should handle null/undefined', () => {
      const status1 = errorHandler.getHttpStatus(null)
      const status2 = errorHandler.getHttpStatus(undefined)

      expect(status1).toBeNull()
      expect(status2).toBeNull()
    })
  })

  describe('formatErrorForUser', () => {
    it('should format network errors for users', () => {
      const networkError = new TypeError('Failed to fetch')
      
      const userMessage = errorHandler.formatErrorForUser(networkError)

      expect(userMessage).toBe('Network connection error. Please check your internet connection and try again.')
    })

    it('should format HTTP 401 errors for users', () => {
      const authError = { status: 401, message: 'Unauthorized' }
      
      const userMessage = errorHandler.formatErrorForUser(authError)

      expect(userMessage).toBe('Your session has expired. Please log in again.')
    })

    it('should format HTTP 403 errors for users', () => {
      const forbiddenError = { status: 403, message: 'Forbidden' }
      
      const userMessage = errorHandler.formatErrorForUser(forbiddenError)

      expect(userMessage).toBe('You do not have permission to perform this action.')
    })

    it('should format HTTP 404 errors for users', () => {
      const notFoundError = { status: 404, message: 'Not found' }
      
      const userMessage = errorHandler.formatErrorForUser(notFoundError)

      expect(userMessage).toBe('The requested resource was not found.')
    })

    it('should format HTTP 500 errors for users', () => {
      const serverError = { status: 500, message: 'Internal server error' }
      
      const userMessage = errorHandler.formatErrorForUser(serverError)

      expect(userMessage).toBe('A server error occurred. Please try again later.')
    })

    it('should format other HTTP errors for users', () => {
      const clientError = { status: 422, message: 'Validation failed' }
      
      const userMessage = errorHandler.formatErrorForUser(clientError)

      expect(userMessage).toBe('Validation failed')
    })

    it('should format generic errors for users', () => {
      const genericError = new Error('Some internal error')
      
      const userMessage = errorHandler.formatErrorForUser(genericError)

      expect(userMessage).toBe('An unexpected error occurred. Please try again.')
    })

    it('should handle errors with user-friendly messages', () => {
      const userFriendlyError = { message: 'Username is already taken' }
      
      const userMessage = errorHandler.formatErrorForUser(userFriendlyError)

      expect(userMessage).toBe('Username is already taken')
    })
  })

  describe('logError', () => {
    it('should log errors with context', () => {
      const error = new Error('Test error')
      const context = { userId: '123', action: 'login' }
      
      errorHandler.logError(error, context)

      expect(mockConsole.error).toHaveBeenCalledWith('Error logged:', {
        error: expect.objectContaining({
          message: 'Test error',
          type: 'Error',
        }),
        context,
        timestamp: expect.any(String),
      })
    })

    it('should log errors without context', () => {
      const error = new Error('Test error')
      
      errorHandler.logError(error)

      expect(mockConsole.error).toHaveBeenCalledWith('Error logged:', {
        error: expect.objectContaining({
          message: 'Test error',
          type: 'Error',
        }),
        context: undefined,
        timestamp: expect.any(String),
      })
    })
  })

  describe('createErrorBoundary', () => {
    it('should create error boundary with custom fallback', () => {
      const customFallback = 'Custom error message'
      
      const boundary = errorHandler.createErrorBoundary(customFallback)

      expect(boundary).toEqual({
        fallback: customFallback,
        onError: expect.any(Function),
      })
    })

    it('should create error boundary with default fallback', () => {
      const boundary = errorHandler.createErrorBoundary()

      expect(boundary).toEqual({
        fallback: 'Something went wrong. Please refresh the page.',
        onError: expect.any(Function),
      })
    })

    it('should handle errors in error boundary', () => {
      const boundary = errorHandler.createErrorBoundary()
      const error = new Error('Boundary error')
      
      boundary.onError(error)

      expect(mockConsole.error).toHaveBeenCalledWith('Error boundary caught:', error)
    })
  })
})
