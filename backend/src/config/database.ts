import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fortune-prediction'
    
    // Optimized connection options for better performance
    await mongoose.connect(mongoUri, {
      maxPoolSize: 50, // Increased pool size for concurrent requests (Requirement 5.1)
      minPoolSize: 5,  // Maintain minimum connections for faster response
      maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      family: 4, // Use IPv4, skip trying IPv6
      compressors: ['zlib'], // Enable compression for network traffic
      zlibCompressionLevel: 6, // Balanced compression level
      retryWrites: true, // Retry failed writes automatically
      retryReads: true, // Retry failed reads automatically
      readPreference: 'primaryPreferred', // Read from primary, fallback to secondary
      w: 'majority', // Write concern for data durability
      journal: true // Enable journaling for data safety
    })
    
    console.log('✅ MongoDB connected successfully with optimized pool settings')
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected')
    })
    
    // Enable query logging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true)
    }
    
    // Create indexes on startup for better query performance
    await createIndexes()
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

/**
 * Create database indexes for optimized query performance
 */
const createIndexes = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db
    
    if (!db) {
      console.warn('⚠️  Database not available for index creation')
      return
    }
    
    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true, background: true })
    await db.collection('users').createIndex({ username: 1 }, { unique: true, background: true })
    await db.collection('users').createIndex({ lastLoginAt: -1 }, { background: true })
    
    // PredictionRecord collection indexes
    await db.collection('predictionrecords').createIndex({ userId: 1, createdAt: -1 }, { background: true })
    await db.collection('predictionrecords').createIndex({ userId: 1, serviceType: 1 }, { background: true })
    await db.collection('predictionrecords').createIndex({ serviceType: 1, createdAt: -1 }, { background: true })
    await db.collection('predictionrecords').createIndex({ createdAt: -1 }, { background: true })
    
    // ServiceConfig collection indexes
    await db.collection('serviceconfigs').createIndex({ serviceType: 1 }, { unique: true, background: true })
    await db.collection('serviceconfigs').createIndex({ isActive: 1, serviceType: 1 }, { background: true })
    
    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.warn('⚠️  Index creation warning (may already exist):', error)
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB disconnected')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  }
}
