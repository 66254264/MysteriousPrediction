import { Request, Response, NextFunction } from 'express'

// Enhanced in-memory cache with LRU eviction
interface CacheEntry {
  data: any
  timestamp: number
  expiresAt: number
  hits: number
  size: number
}

interface CacheStats {
  size: number
  maxSize: number
  hits: number
  misses: number
  evictions: number
  memoryUsage: number
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private maxSize: number = 500 // Increased cache entries for better performance
  private maxMemory: number = 50 * 1024 * 1024 // 50MB memory limit
  private currentMemory: number = 0
  private stats: CacheStats = {
    size: 0,
    maxSize: this.maxSize,
    hits: 0,
    misses: 0,
    evictions: 0,
    memoryUsage: 0
  }

  // Periodic cleanup interval
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Run cleanup every 60 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  set(key: string, data: any, ttl: number = 300000): void {
    const dataSize = this.estimateSize(data)
    
    // Check memory limit
    if (this.currentMemory + dataSize > this.maxMemory) {
      this.evictLRU(dataSize)
    }

    // Clean up if cache is too large
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!
      this.currentMemory -= oldEntry.size
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      hits: 0,
      size: dataSize
    })

    this.currentMemory += dataSize
    this.stats.size = this.cache.size
    this.stats.memoryUsage = this.currentMemory
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key)
      this.stats.misses++
      return null
    }

    // Update hit count and timestamp for LRU
    entry.hits++
    entry.timestamp = Date.now()
    this.stats.hits++

    return entry.data
  }

  delete(key: string): void {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentMemory -= entry.size
      this.cache.delete(key)
      this.stats.size = this.cache.size
      this.stats.memoryUsage = this.currentMemory
    }
  }

  clear(): void {
    this.cache.clear()
    this.currentMemory = 0
    this.stats.size = 0
    this.stats.memoryUsage = 0
  }

  // Delete keys matching a pattern (simple implementation)
  deletePattern(pattern: string): number {
    let deleted = 0
    const regex = new RegExp(pattern.replace('*', '.*'))
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key)
        deleted++
      }
    }
    
    return deleted
  }

  // Remove expired entries and enforce size limits
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.delete(key)
      this.stats.evictions++
    })

    // If still too large, remove least recently used entries
    if (this.cache.size >= this.maxSize) {
      this.evictLRU(0)
    }
  }

  // Evict least recently used entries to free up space
  private evictLRU(requiredSpace: number): void {
    const entries = Array.from(this.cache.entries())
    
    // Sort by timestamp (oldest first) and hits (least used first)
    entries.sort((a, b) => {
      const scoreA = a[1].timestamp + (a[1].hits * 10000)
      const scoreB = b[1].timestamp + (b[1].hits * 10000)
      return scoreA - scoreB
    })
    
    let freedSpace = 0
    const toRemove = Math.max(
      Math.floor(this.maxSize * 0.2), // Remove at least 20%
      1
    )
    
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [key, entry] = entries[i]
      freedSpace += entry.size
      this.delete(key)
      this.stats.evictions++
      
      if (freedSpace >= requiredSpace) {
        break
      }
    }
  }

  // Estimate size of data in bytes
  private estimateSize(data: any): number {
    const str = JSON.stringify(data)
    return str.length * 2 // Rough estimate: 2 bytes per character
  }

  getStats(): CacheStats {
    return {
      ...this.stats,
      size: this.cache.size,
      memoryUsage: this.currentMemory
    }
  }

  // Cleanup on shutdown
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

export const cacheManager = new CacheManager()

// Cache middleware factory with enhanced features
export const cacheMiddleware = (ttl: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    // Generate cache key from URL and user ID
    const userId = (req as any).user?._id?.toString() || 'anonymous'
    const cacheKey = `${userId}:${req.originalUrl}`

    // Check cache
    const cachedData = cacheManager.get(cacheKey)
    if (cachedData) {
      // Add cache hit header
      res.setHeader('X-Cache', 'HIT')
      res.setHeader('X-Cache-Key', cacheKey)
      return res.json(cachedData)
    }

    // Add cache miss header
    res.setHeader('X-Cache', 'MISS')

    // Store original json method
    const originalJson = res.json.bind(res)

    // Override json method to cache response
    res.json = function(data: any) {
      // Only cache successful responses
      if (res.statusCode === 200 && data.success !== false) {
        cacheManager.set(cacheKey, data, ttl)
      }
      return originalJson(data)
    }

    next()
  }
}

// Invalidate cache for specific user
export const invalidateUserCache = (userId: string): number => {
  const pattern = `${userId}:*`
  return cacheManager.deletePattern(pattern)
}

// Invalidate cache by pattern
export const invalidateCachePattern = (pattern: string): number => {
  return cacheManager.deletePattern(pattern)
}

// Get cache statistics
export const getCacheStats = () => {
  return cacheManager.getStats()
}
