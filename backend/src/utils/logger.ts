import { config } from '../config/env.js'

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: any
  error?: Error
}

class Logger {
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    let logMessage = `[${timestamp}] [${level}] ${message}`
    
    if (context) {
      logMessage += `\nContext: ${JSON.stringify(context, null, 2)}`
    }
    
    if (error) {
      logMessage += `\nError: ${error.message}`
      if (error.stack && config.nodeEnv === 'development') {
        logMessage += `\nStack: ${error.stack}`
      }
    }
    
    return logMessage
  }

  private log(level: LogLevel, message: string, context?: any, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }

    const formattedLog = this.formatLog(entry)

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.INFO:
        console.info(formattedLog)
        break
      case LogLevel.DEBUG:
        if (config.nodeEnv === 'development') {
          console.debug(formattedLog)
        }
        break
    }
  }

  error(message: string, error?: Error, context?: any): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context)
  }
}

export const logger = new Logger()
