import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now()
  const requestId = req.headers['x-request-id'] as string || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Attach request ID to request object
  req.headers['x-request-id'] = requestId

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  })

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info'
    
    logger[logLevel]('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    })
  })

  next()
}
