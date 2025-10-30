import { Query } from 'mongoose'

/**
 * Query optimization utilities for better database performance
 * Implements best practices for MongoDB queries (Requirement 5.1, 5.2)
 */

/**
 * Apply common optimizations to a Mongoose query
 */
export const optimizeQuery = <T>(query: Query<T, any>) => {
  return query
    .lean() // Return plain JavaScript objects instead of Mongoose documents
    .select('-__v') // Exclude version key
}

/**
 * Create pagination options with limits
 */
export const getPaginationOptions = (page?: number, limit?: number) => {
  const safePage = Math.max(1, page || 1)
  const safeLimit = Math.min(100, Math.max(1, limit || 50)) // Max 100 items per page
  const skip = (safePage - 1) * safeLimit

  return {
    page: safePage,
    limit: safeLimit,
    skip
  }
}

/**
 * Build efficient sort options
 */
export const buildSortOptions = (sortBy?: string, order?: 'asc' | 'desc') => {
  const sortField = sortBy || 'createdAt'
  const sortOrder = order === 'asc' ? 1 : -1
  
  return { [sortField]: sortOrder }
}

/**
 * Optimize aggregation pipeline
 */
export const optimizeAggregation = (pipeline: any[]) => {
  // Add $limit early in pipeline to reduce documents processed
  // Add $project to select only needed fields
  return pipeline
}

/**
 * Create efficient text search query
 */
export const buildTextSearchQuery = (searchTerm: string, fields: string[]) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return {}
  }

  const regex = new RegExp(searchTerm.trim(), 'i')
  
  return {
    $or: fields.map(field => ({ [field]: regex }))
  }
}

/**
 * Batch operations helper
 */
export const batchOperation = async <T>(
  items: T[],
  operation: (batch: T[]) => Promise<void>,
  batchSize: number = 100
): Promise<void> => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await operation(batch)
  }
}

/**
 * Query timeout wrapper
 */
export const withTimeout = <T>(
  query: Query<T, any>,
  timeoutMs: number = 5000
): Query<T, any> => {
  return query.maxTimeMS(timeoutMs)
}
