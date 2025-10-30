import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { asyncHandler } from '../middleware/errorHandler.js'
import { getCacheStats } from '../middleware/cache.js'
import { getConnectionPoolStats, getDatabaseStats } from '../utils/dbMonitor.js'
import { getPerformanceMetrics as getPerformanceMetricsData } from '../middleware/performance.js'

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error'
      responseTime?: number
    }
    memory: {
      used: number
      total: number
      percentage: number
    }
    cpu: {
      usage: number
    }
  }
  version: string
}

interface SystemMetrics {
  activeConnections: number
  totalRequests: number
  errorCount: number
  averageResponseTime: number
}

// In-memory metrics storage (in production, use Redis or similar)
const metrics: SystemMetrics = {
  activeConnections: 0,
  totalRequests: 0,
  errorCount: 0,
  averageResponseTime: 0
}

const responseTimes: number[] = []

export const getHealthCheck = asyncHandler(async (_req: Request, res: Response) => {
  
  // Check database connection
  let dbStatus: 'connected' | 'disconnected' | 'error' = 'disconnected'
  let dbResponseTime: number | undefined
  
  try {
    const dbStartTime = Date.now()
    await mongoose.connection.db?.admin().ping()
    dbResponseTime = Date.now() - dbStartTime
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  } catch (error) {
    dbStatus = 'error'
  }

  // Get memory usage
  const memoryUsage = process.memoryUsage()
  const totalMemory = memoryUsage.heapTotal
  const usedMemory = memoryUsage.heapUsed
  const memoryPercentage = (usedMemory / totalMemory) * 100

  // Get CPU usage (simplified)
  const cpuUsage = process.cpuUsage()
  const cpuPercentage = (cpuUsage.user + cpuUsage.system) / 1000000 // Convert to percentage

  // Determine overall health status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
  
  if (dbStatus === 'error' || memoryPercentage > 90) {
    status = 'unhealthy'
  } else if (dbStatus === 'disconnected' || memoryPercentage > 75) {
    status = 'degraded'
  }

  const healthCheck: HealthCheckResponse = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: {
        status: dbStatus,
        responseTime: dbResponseTime
      },
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage)
      },
      cpu: {
        usage: Math.round(cpuPercentage)
      }
    },
    version: process.env.npm_package_version || '1.0.0'
  }

  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503

  res.status(statusCode).json({
    success: true,
    data: healthCheck
  })
})

export const getMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const averageResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0

  res.json({
    success: true,
    data: {
      ...metrics,
      averageResponseTime: Math.round(averageResponseTime),
      timestamp: new Date().toISOString()
    }
  })
})

// Middleware to track metrics
export const metricsMiddleware = (_req: Request, res: Response, next: Function) => {
  const startTime = Date.now()
  metrics.activeConnections++
  metrics.totalRequests++

  res.on('finish', () => {
    metrics.activeConnections--
    const responseTime = Date.now() - startTime
    
    // Keep last 100 response times for average calculation
    responseTimes.push(responseTime)
    if (responseTimes.length > 100) {
      responseTimes.shift()
    }

    // Track errors
    if (res.statusCode >= 400) {
      metrics.errorCount++
    }
  })

  next()
}

// Reset metrics (for testing or periodic reset)
export const resetMetrics = () => {
  metrics.activeConnections = 0
  metrics.totalRequests = 0
  metrics.errorCount = 0
  metrics.averageResponseTime = 0
  responseTimes.length = 0
}

// Get cache statistics
export const getCacheMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const cacheStats = getCacheStats()
  
  res.json({
    success: true,
    data: {
      ...cacheStats,
      hitRate: cacheStats.hits + cacheStats.misses > 0
        ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2) + '%'
        : '0%',
      memoryUsageMB: (cacheStats.memoryUsage / 1024 / 1024).toFixed(2),
      timestamp: new Date().toISOString()
    }
  })
})

// Get database performance statistics
export const getDatabaseMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const poolStats = getConnectionPoolStats()
  const dbStats = await getDatabaseStats()
  
  res.json({
    success: true,
    data: {
      connectionPool: poolStats,
      database: dbStats,
      timestamp: new Date().toISOString()
    }
  })
})

// Get performance metrics
export const getPerformanceMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const perfMetrics = getPerformanceMetricsData()
  
  res.json({
    success: true,
    data: {
      ...perfMetrics,
      timestamp: new Date().toISOString()
    }
  })
})
