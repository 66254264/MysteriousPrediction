import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import { config } from '../config/env.js'

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    stack?: string
  }
  timestamp: string
  requestId?: string
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

// Common error types
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, 'AUTHENTICATION_ERROR', message)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(403, 'AUTHORIZATION_ERROR', message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(500, 'DATABASE_ERROR', message, details, false)
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(503, 'EXTERNAL_SERVICE_ERROR', `${service}: ${message}`, undefined, false)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Generate request ID for tracking
  const requestId = req.headers['x-request-id'] as string || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Log error with context
  const errorContext = {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: (req as any).user?.id
  }

  if (err instanceof AppError) {
    // Log operational errors at appropriate level
    if (err.statusCode >= 500) {
      logger.error(`AppError: ${err.message}`, err, errorContext)
    } else {
      logger.warn(`AppError: ${err.message}`, { ...errorContext, details: err.details })
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: config.nodeEnv === 'development' ? err.details : undefined,
        stack: config.nodeEnv === 'development' ? err.stack : undefined
      },
      timestamp: new Date().toISOString(),
      requestId
    }
    
    res.status(err.statusCode).json(errorResponse)
    return
  }

  // Handle unexpected errors
  logger.error('Unexpected error', err, errorContext)

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred',
      stack: config.nodeEnv === 'development' ? err.stack : undefined
    },
    timestamp: new Date().toISOString(),
    requestId
  }
  
  res.status(500).json(errorResponse)
}

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
