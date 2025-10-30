import { ApiResponse } from '../services/api'

export interface ErrorDetails {
  code: string
  message: string
  userMessage: string
  details?: any
}

// Map error codes to user-friendly messages
const errorMessages: Record<string, string> = {
  // Authentication errors
  AUTHENTICATION_ERROR: '登录已过期，请重新登录',
  AUTHORIZATION_ERROR: '您没有权限执行此操作',
  INVALID_CREDENTIALS: '邮箱或密码错误',
  USER_EXISTS: '该邮箱已被注册',
  
  // Validation errors
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  INVALID_INPUT: '输入格式不正确',
  MISSING_REQUIRED_FIELD: '请填写所有必填项',
  
  // Resource errors
  NOT_FOUND: '请求的资源不存在',
  RESOURCE_NOT_FOUND: '未找到相关数据',
  
  // Server errors
  INTERNAL_SERVER_ERROR: '服务器出错了，请稍后重试',
  DATABASE_ERROR: '数据库错误，请稍后重试',
  EXTERNAL_SERVICE_ERROR: '外部服务暂时不可用',
  
  // Network errors
  NETWORK_ERROR: '网络连接失败，请检查您的网络连接',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  CONNECTION_REFUSED: '无法连接到服务器，请稍后重试',
  SERVICE_UNAVAILABLE: '服务暂时不可用，请稍后重试',
  
  // Default
  UNKNOWN_ERROR: '发生未知错误，请重试'
}

export function getErrorDetails(error: any): ErrorDetails {
  // Handle API response errors
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error.error
    const code = apiError.code || 'UNKNOWN_ERROR'
    
    return {
      code,
      message: apiError.message || 'An error occurred',
      userMessage: errorMessages[code] || apiError.message || errorMessages.UNKNOWN_ERROR,
      details: apiError.details
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    // Check for specific error types
    let code = 'UNKNOWN_ERROR'
    let userMessage = errorMessages.UNKNOWN_ERROR
    
    if (error.message.includes('超时') || error.message.includes('timeout')) {
      code = 'TIMEOUT_ERROR'
      userMessage = errorMessages.TIMEOUT_ERROR
    } else if (error.message.includes('网络') || error.message.includes('network')) {
      code = 'NETWORK_ERROR'
      userMessage = errorMessages.NETWORK_ERROR
    } else if (error.message.includes('Failed to fetch')) {
      code = 'CONNECTION_REFUSED'
      userMessage = errorMessages.CONNECTION_REFUSED
    }
    
    return {
      code,
      message: error.message,
      userMessage,
      details: error.stack
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: 'UNKNOWN_ERROR',
      message: error,
      userMessage: error,
      details: undefined
    }
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    userMessage: errorMessages.UNKNOWN_ERROR,
    details: error
  }
}

export function handleApiError(response: ApiResponse, showToast?: (message: string, type: 'error') => void): ErrorDetails {
  const errorDetails = getErrorDetails(response)
  
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', errorDetails)
  }

  // Show toast notification if callback provided
  if (showToast) {
    showToast(errorDetails.userMessage, 'error')
  }

  return errorDetails
}

export function logError(error: any, context?: string): void {
  const errorDetails = getErrorDetails(error)
  
  console.error(`[Error${context ? ` - ${context}` : ''}]:`, {
    code: errorDetails.code,
    message: errorDetails.message,
    details: errorDetails.details,
    timestamp: new Date().toISOString()
  })

  // In production, you could send this to an error tracking service
  if (import.meta.env.PROD) {
    // Example: sendToErrorTracking(errorDetails, context)
  }
}

// Global error handler for unhandled errors
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'Unhandled Promise Rejection')
    event.preventDefault()
  })

  // Handle global errors
  window.addEventListener('error', (event) => {
    logError(event.error, 'Global Error')
  })
}
