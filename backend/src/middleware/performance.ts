import { Request, Response, NextFunction } from 'express'

/**
 * Performance monitoring middleware
 * Tracks response times and adds performance headers (Requirement 3.3, 5.2)
 */

interface PerformanceMetrics {
  slowRequests: Array<{
    path: string
    method: string
    duration: number
    timestamp: Date
  }>
  averageResponseTime: number
  requestCount: number
}

const metrics: PerformanceMetrics = {
  slowRequests: [],
  averageResponseTime: 0,
  requestCount: 0
}

const responseTimes: number[] = []
const SLOW_REQUEST_THRESHOLD = 3000 // 3 seconds (Requirement 3.3: 5 seconds target)
const MAX_SLOW_REQUESTS = 50

/**
 * Performance tracking middleware
 */
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const startMemory = process.memoryUsage().heapUsed

  // Store original end method
  const originalEnd = res.end

  // Override end method to add headers before response is sent
  res.end = function(this: Response, ...args: any[]): Response {
    const duration = Date.now() - startTime
    const endMemory = process.memoryUsage().heapUsed
    const memoryDelta = endMemory - startMemory

    // Add performance headers BEFORE ending response
    try {
      if (!res.headersSent) {
        res.setHeader('X-Response-Time', `${duration}ms`)
        res.setHeader('X-Memory-Delta', `${Math.round(memoryDelta / 1024)}KB`)
      }
    } catch (error) {
      // Ignore header errors
    }

    // Update metrics
    responseTimes.push(duration)
    if (responseTimes.length > 100) {
      responseTimes.shift()
    }

    metrics.requestCount++
    metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length

    // Track slow requests
    if (duration > SLOW_REQUEST_THRESHOLD) {
      metrics.slowRequests.push({
        path: req.path,
        method: req.method,
        duration,
        timestamp: new Date()
      })

      // Keep only recent slow requests
      if (metrics.slowRequests.length > MAX_SLOW_REQUESTS) {
        metrics.slowRequests.shift()
      }

      // Log slow requests in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[SLOW REQUEST] ${req.method} ${req.path} took ${duration}ms`)
      }
    }

    // Call original end method
    return originalEnd.apply(this, args)
  }

  next()
}

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics => {
  return {
    ...metrics,
    averageResponseTime: Math.round(metrics.averageResponseTime)
  }
}

/**
 * Reset performance metrics
 */
export const resetPerformanceMetrics = () => {
  metrics.slowRequests = []
  metrics.averageResponseTime = 0
  metrics.requestCount = 0
  responseTimes.length = 0
}

/**
 * Middleware to warn about potentially slow operations
 */
export const slowOperationWarning = (operationName: string, thresholdMs: number = 1000) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    // Store original end method
    const originalEnd = res.end

    // Override end method to check duration
    res.end = function(this: Response, ...args: any[]): Response {
      const duration = Date.now() - startTime
      if (duration > thresholdMs) {
        console.warn(`[SLOW OPERATION] ${operationName} took ${duration}ms (threshold: ${thresholdMs}ms)`)
      }

      // Call original end method
      return originalEnd.apply(this, args)
    }

    next()
  }
}
