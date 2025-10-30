import { createApp } from './app.js'
import { connectDatabase } from './config/database.js'
import { config } from './config/env.js'
import { logger } from './utils/logger.js'

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase()
    logger.info('Database connected successfully')

    // Create Express app
    const app = createApp()

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`, {
        environment: config.nodeEnv,
        corsOrigin: config.corsOrigin
      })
    })

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`)
      
      server.close(async () => {
        logger.info('HTTP server closed')
        process.exit(0)
      })

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', error)
      process.exit(1)
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection', reason instanceof Error ? reason : new Error(String(reason)))
      process.exit(1)
    })

  } catch (error) {
    logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)))
    process.exit(1)
  }
}

startServer()
