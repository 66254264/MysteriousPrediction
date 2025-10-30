/**
 * Network status utilities
 * Helps detect and handle network issues
 */

export interface NetworkStatus {
  online: boolean
  effectiveType: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

/**
 * Get current network status
 */
export function getNetworkStatus(): NetworkStatus {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection

  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData
  }
}

/**
 * Check if network is slow
 */
export function isSlowNetwork(): boolean {
  const status = getNetworkStatus()
  
  // Consider slow if:
  // - Effective type is slow-2g or 2g
  // - RTT is greater than 500ms
  // - Downlink is less than 0.5 Mbps
  return (
    status.effectiveType === 'slow-2g' ||
    status.effectiveType === '2g' ||
    (status.rtt !== undefined && status.rtt > 500) ||
    (status.downlink !== undefined && status.downlink < 0.5)
  )
}

/**
 * Check if backend is reachable
 */
export async function checkBackendHealth(apiUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${apiUrl}/system/health`, {
      method: 'GET',
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.error('Backend health check failed:', error)
    return false
  }
}

/**
 * Wait for network to be online
 */
export function waitForOnline(timeout: number = 30000): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve(true)
      return
    }

    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onlineHandler)
      resolve(false)
    }, timeout)

    const onlineHandler = () => {
      clearTimeout(timeoutId)
      window.removeEventListener('online', onlineHandler)
      resolve(true)
    }

    window.addEventListener('online', onlineHandler)
  })
}

/**
 * Retry an operation when network is available
 */
export async function retryWhenOnline<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Wait for network if offline
      if (!navigator.onLine) {
        const isOnline = await waitForOnline()
        if (!isOnline) {
          throw new Error('网络连接超时')
        }
      }

      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // If this is the last retry, throw the error
      if (i === maxRetries - 1) {
        throw lastError
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }

  throw lastError || new Error('Operation failed')
}
