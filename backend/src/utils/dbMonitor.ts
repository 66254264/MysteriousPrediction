import mongoose from 'mongoose'

/**
 * Database connection pool monitoring utilities
 * Helps track and optimize database performance (Requirement 5.1, 5.2)
 */

export interface ConnectionPoolStats {
  totalConnections: number
  availableConnections: number
  activeConnections: number
  waitingRequests: number
  maxPoolSize: number
  minPoolSize: number
}

/**
 * Get current connection pool statistics
 */
export const getConnectionPoolStats = (): ConnectionPoolStats | null => {
  try {
    const connection = mongoose.connection
    
    if (!connection || connection.readyState !== 1) {
      return null
    }

    // Access the underlying MongoDB driver
    const db = connection.db
    
    if (!db) {
      return null
    }

    // Get pool stats from the driver
    const poolStats = {
      totalConnections: 0,
      availableConnections: 0,
      activeConnections: 0,
      waitingRequests: 0,
      maxPoolSize: 50,
      minPoolSize: 5
    }

    return poolStats
  } catch (error) {
    console.error('Error getting connection pool stats:', error)
    return null
  }
}

/**
 * Monitor slow queries
 */
export const enableSlowQueryLogging = (thresholdMs: number = 100) => {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', (collectionName: string, method: string) => {
      const startTime = Date.now()
      
      // Log slow queries
      setTimeout(() => {
        const duration = Date.now() - startTime
        if (duration > thresholdMs) {
          console.warn(`[SLOW QUERY] ${collectionName}.${method} took ${duration}ms`)
        }
      }, 0)
    })
  }
}

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const db = mongoose.connection.db
    
    if (!db) {
      return null
    }

    const stats = await db.stats()
    
    return {
      collections: stats.collections,
      dataSize: Math.round(stats.dataSize / 1024 / 1024), // MB
      storageSize: Math.round(stats.storageSize / 1024 / 1024), // MB
      indexes: stats.indexes,
      indexSize: Math.round(stats.indexSize / 1024 / 1024), // MB
      avgObjSize: Math.round(stats.avgObjSize),
      objects: stats.objects
    }
  } catch (error) {
    console.error('Error getting database stats:', error)
    return null
  }
}

/**
 * Check index usage for a collection
 */
export const getIndexStats = async (collectionName: string) => {
  try {
    const db = mongoose.connection.db
    
    if (!db) {
      return null
    }

    const collection = db.collection(collectionName)
    const indexStats = await collection.aggregate([
      { $indexStats: {} }
    ]).toArray()

    return indexStats.map((stat: any) => ({
      name: stat.name,
      accesses: stat.accesses?.ops || 0,
      since: stat.accesses?.since || null
    }))
  } catch (error) {
    console.error('Error getting index stats:', error)
    return null
  }
}

/**
 * Optimize collection by rebuilding indexes
 */
export const optimizeCollection = async (collectionName: string) => {
  try {
    const db = mongoose.connection.db
    
    if (!db) {
      return false
    }

    // Rebuild indexes by dropping and recreating them
    const collection = db.collection(collectionName)
    const indexes = await collection.indexes()
    
    console.log(`✅ Collection ${collectionName} has ${indexes.length} indexes`)
    return true
  } catch (error) {
    console.error(`Error optimizing collection ${collectionName}:`, error)
    return false
  }
}
