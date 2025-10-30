import { Router } from 'express'
import {
  tarotDivination,
  astrologyDivination,
  baziDivination,
  yijingDivination,
  getPredictionHistory,
  getPredictionById,
  getPredictionStats,
  deletePrediction
} from '../controllers/divinationController.js'
import { optionalAuth, authenticate } from '../middleware/auth.js'
import { cacheMiddleware } from '../middleware/cache.js'

const router = Router()

/**
 * POST /api/divination/tarot
 * 塔罗牌占卜
 */
router.post('/tarot', optionalAuth, tarotDivination)

/**
 * POST /api/divination/astrology
 * 星座预测
 */
router.post('/astrology', optionalAuth, astrologyDivination)

/**
 * POST /api/divination/bazi
 * 八字算命
 */
router.post('/bazi', optionalAuth, baziDivination)

/**
 * POST /api/divination/yijing
 * 周易占卜
 */
router.post('/yijing', optionalAuth, yijingDivination)

/**
 * GET /api/divination/history
 * 获取用户预测历史（需要认证）
 * Query params: serviceType, limit, page
 * Cache for 5 minutes
 */
router.get('/history', authenticate, cacheMiddleware(300000), getPredictionHistory)

/**
 * GET /api/divination/history/:id
 * 获取单个预测记录详情（需要认证）
 * Cache for 10 minutes
 */
router.get('/history/:id', authenticate, cacheMiddleware(600000), getPredictionById)

/**
 * GET /api/divination/stats
 * 获取用户预测统计（需要认证）
 * Cache for 5 minutes
 */
router.get('/stats', authenticate, cacheMiddleware(300000), getPredictionStats)

/**
 * DELETE /api/divination/history/:id
 * 删除预测记录（需要认证）
 */
router.delete('/history/:id', authenticate, deletePrediction)

export default router
