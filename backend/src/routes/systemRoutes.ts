import { Router } from 'express'
import { getHealthCheck, getMetrics, getCacheMetrics, getDatabaseMetrics, getPerformanceMetrics } from '../controllers/systemController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// Public health check endpoint
router.get('/health', getHealthCheck)

// Protected metrics endpoint (requires authentication)
router.get('/metrics', authenticate, getMetrics)

// Protected cache metrics endpoint (requires authentication)
router.get('/cache', authenticate, getCacheMetrics)

// Protected database metrics endpoint (requires authentication)
router.get('/database', authenticate, getDatabaseMetrics)

// Protected performance metrics endpoint (requires authentication)
router.get('/performance', authenticate, getPerformanceMetrics)

export default router
