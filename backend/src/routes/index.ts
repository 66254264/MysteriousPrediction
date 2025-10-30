import { Router } from 'express'
import authRoutes from './authRoutes.js'
import divinationRoutes from './divinationRoutes.js'
import systemRoutes from './systemRoutes.js'

const router = Router()

// API version info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fortune Prediction API',
    version: '1.0.0',
    endpoints: {
      health: '/api/system/health',
      auth: '/api/auth',
      divination: '/api/divination',
      system: '/api/system'
    }
  })
})

// Mount route modules
router.use('/auth', authRoutes)
router.use('/divination', divinationRoutes)
router.use('/system', systemRoutes)

export default router
