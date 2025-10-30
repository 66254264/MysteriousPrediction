import express, { Application } from 'express'
import cors from 'cors'
import compression from 'compression'
import { config } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'
import { metricsMiddleware } from './controllers/systemController.js'
import { performanceMiddleware } from './middleware/performance.js'
import routes from './routes/index.js'

export const createApp = (): Application => {
  const app = express()

  // Compression middleware - compress all responses (Requirement 3.3, 5.2)
  app.use(compression({
    filter: (req: any, res: any) => {
      if (req.headers['x-no-compression']) {
        return false
      }
      return compression.filter(req, res)
    },
    level: 6, // Compression level (0-9, 6 is balanced)
    threshold: 1024, // Only compress responses larger than 1KB
    memLevel: 8 // Memory level for compression (1-9, 8 is default)
  }))

  // CORS middleware
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true
  }))
  
  // Body parsing middleware with optimized size limits (Requirement 5.2)
  app.use(express.json({ 
    limit: '2mb', // Reduced from 10mb for better performance
    strict: true,
    type: 'application/json'
  }))
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '2mb',
    parameterLimit: 1000 // Limit number of parameters
  }))

  // Performance monitoring (Requirement 3.3, 5.2)
  app.use(performanceMiddleware)

  // Metrics tracking
  app.use(metricsMiddleware)

  // Request logging
  app.use(requestLogger)

  // Routes
  app.use('/api', routes)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`
      },
      timestamp: new Date().toISOString()
    })
  })

  // Error handling
  app.use(errorHandler)

  return app
}
