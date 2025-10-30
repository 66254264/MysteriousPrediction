/**
 * Performance monitoring and optimization utilities
 */

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

/**
 * Get network connection type
 */
export function getConnectionType(): string {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  return connection?.effectiveType || 'unknown'
}

/**
 * Check if connection is slow
 */
export function isSlowConnection(): boolean {
  const type = getConnectionType()
  return type === 'slow-2g' || type === '2g'
}

/**
 * Preload image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(callback: () => void, timeout = 2000): number {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout })
  } else {
    return window.setTimeout(callback, 1) as unknown as number
  }
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}

/**
 * Performance monitoring
 */
interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  domContentLoaded: number
  timeToInteractive: number
}

export function getPerformanceMetrics(): PerformanceMetrics | null {
  if (!window.performance || !window.performance.timing) {
    return null
  }

  const timing = window.performance.timing
  const navigation = timing.navigationStart

  return {
    pageLoadTime: timing.loadEventEnd - navigation,
    firstContentfulPaint: timing.responseEnd - navigation,
    domContentLoaded: timing.domContentLoadedEventEnd - navigation,
    timeToInteractive: timing.domInteractive - navigation
  }
}

/**
 * Monitor API call performance
 */
export function measureApiCall<T>(
  apiCall: () => Promise<T>,
  endpoint: string
): Promise<T> {
  const startTime = performance.now()

  return apiCall().then(
    (result) => {
      const duration = performance.now() - startTime
      console.debug(`API Call [${endpoint}]: ${duration.toFixed(2)}ms`)
      return result
    },
    (error) => {
      const duration = performance.now() - startTime
      console.error(`API Call Failed [${endpoint}]: ${duration.toFixed(2)}ms`, error)
      throw error
    }
  )
}

/**
 * Check system health from frontend
 */
export async function checkSystemHealth(): Promise<{
  healthy: boolean
  latency: number
  error?: string
}> {
  const startTime = performance.now()
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/system/health`)
    const latency = performance.now() - startTime
    
    if (!response.ok) {
      return {
        healthy: false,
        latency,
        error: `HTTP ${response.status}`
      }
    }

    const data = await response.json()
    return {
      healthy: data.data?.status === 'healthy',
      latency,
      error: data.data?.status !== 'healthy' ? `Status: ${data.data?.status}` : undefined
    }
  } catch (error) {
    const latency = performance.now() - startTime
    return {
      healthy: false,
      latency,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

/**
 * Monitor memory usage (if available)
 */
export function getMemoryUsage(): { used: number; total: number; percentage: number } | null {
  const memory = (performance as any).memory
  if (!memory) {
    return null
  }

  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    total: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
    percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  }
}
