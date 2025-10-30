import { useState, useEffect } from 'react'
import { checkSystemHealth } from '../utils/performance'

interface SystemStatusProps {
  showDetails?: boolean
}

export function SystemStatus({ showDetails = false }: SystemStatusProps) {
  const [status, setStatus] = useState<{
    healthy: boolean
    latency: number
    error?: string
    lastCheck?: Date
  } | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const result = await checkSystemHealth()
      setStatus({
        ...result,
        lastCheck: new Date()
      })
    } catch (error) {
      setStatus({
        healthy: false,
        latency: 0,
        error: 'Failed to check system health',
        lastCheck: new Date()
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Initial check
    checkHealth()

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!status && !isChecking) {
    return null
  }

  const statusColor = status?.healthy ? 'bg-green-500' : 'bg-red-500'
  const statusText = status?.healthy ? '系统正常' : '系统异常'

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColor} ${isChecking ? 'animate-pulse' : ''}`} />
        <span className="text-xs text-white/70">{statusText}</span>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">系统状态</h3>
        <div className={`w-3 h-3 rounded-full ${statusColor} ${isChecking ? 'animate-pulse' : ''}`} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/70">状态:</span>
          <span className={status?.healthy ? 'text-green-400' : 'text-red-400'}>
            {statusText}
          </span>
        </div>

        {status?.latency !== undefined && (
          <div className="flex justify-between">
            <span className="text-white/70">延迟:</span>
            <span className="text-white">{status.latency.toFixed(0)}ms</span>
          </div>
        )}

        {status?.error && (
          <div className="flex justify-between">
            <span className="text-white/70">错误:</span>
            <span className="text-red-400 text-xs">{status.error}</span>
          </div>
        )}

        {status?.lastCheck && (
          <div className="flex justify-between">
            <span className="text-white/70">最后检查:</span>
            <span className="text-white/50 text-xs">
              {status.lastCheck.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={checkHealth}
        disabled={isChecking}
        className="mt-3 w-full px-3 py-1.5 bg-purple-600/50 hover:bg-purple-600/70 disabled:bg-purple-600/30 text-white text-sm rounded transition-colors"
      >
        {isChecking ? '检查中...' : '立即检查'}
      </button>
    </div>
  )
}
