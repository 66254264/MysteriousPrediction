import { useState, useEffect } from 'react'

interface ConnectionStatus {
  online: boolean
  type: string
  downlink?: number
  rtt?: number
}

export function useConnectionMonitor() {
  const [status, setStatus] = useState<ConnectionStatus>({
    online: navigator.onLine,
    type: 'unknown'
  })

  useEffect(() => {
    const updateConnectionStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      setStatus({
        online: navigator.onLine,
        type: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink,
        rtt: connection?.rtt
      })
    }

    // Initial update
    updateConnectionStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateConnectionStatus)
    window.addEventListener('offline', updateConnectionStatus)

    // Listen for connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', updateConnectionStatus)
    }

    return () => {
      window.removeEventListener('online', updateConnectionStatus)
      window.removeEventListener('offline', updateConnectionStatus)
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionStatus)
      }
    }
  }, [])

  return status
}
