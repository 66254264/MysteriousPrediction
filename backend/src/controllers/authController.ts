import { Request, Response } from 'express'
import { User } from '../models/User.js'
import { generateToken } from '../middleware/auth.js'
import { validateRegisterInput, validateLoginInput } from '../validators/userValidator.js'
import type { AuthRequest } from '../middleware/auth.js'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, profile } = req.body

    // Validate input
    const validation = validateRegisterInput({ username, email, password })
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        }
      })
      return
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username'
      res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: `User with this ${field} already exists`
        }
      })
      return
    }

    // Create new user
    const user = new User({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      profile: profile || {},
      lastLoginAt: new Date()
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id.toString(), user.email)

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTER_ERROR',
        message: 'Failed to register user'
      }
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validate input
    const validation = validateLoginInput({ email, password })
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        }
      })
      return
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      })
      return
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      })
      return
    }

    // Update last login time
    user.lastLoginAt = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id.toString(), user.email)

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          lastLoginAt: user.lastLoginAt
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Failed to login'
      }
    })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  // Since we're using JWT, logout is handled client-side by removing the token
  // This endpoint is here for consistency and future enhancements (e.g., token blacklisting)
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
}

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      })
      return
    }

    const user = await User.findById(req.userId).select('-passwordHash')
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_ERROR',
        message: 'Failed to get user profile'
      }
    })
  }
}
