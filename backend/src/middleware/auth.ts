import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { User } from '../models/User.js'

export interface AuthRequest extends Request {
  userId?: string
  user?: any
  headers: any
}

export interface JwtPayload {
  userId: string
  email: string
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email } as JwtPayload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  )
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided'
        }
      })
      return
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    // Attach user ID to request
    req.userId = decoded.userId

    // Optionally fetch full user data
    const user = await User.findById(decoded.userId).select('-passwordHash')
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      })
      return
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired'
        }
      })
      return
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is provided, but doesn't fail if not
 */
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      next()
      return
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    // Attach user ID to request
    req.userId = decoded.userId

    // Fetch full user data
    const user = await User.findById(decoded.userId).select('-passwordHash')
    if (user) {
      req.user = user
    }

    next()
  } catch (error) {
    // If token is invalid, just continue without user info
    next()
  }
}
