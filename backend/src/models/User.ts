import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUserProfile {
  birthDate?: Date
  birthTime?: string
  birthPlace?: string
  gender?: 'male' | 'female' | 'other'
}

export interface IUser extends Document {
  username: string
  email: string
  passwordHash: string
  profile: IUserProfile
  createdAt: Date
  lastLoginAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profile: {
    birthDate: {
      type: Date,
      validate: {
        validator: function(value: Date) {
          return !value || value <= new Date()
        },
        message: 'Birth date cannot be in the future'
      }
    },
    birthTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Birth time must be in HH:MM format']
    },
    birthPlace: {
      type: String,
      trim: true,
      maxlength: [100, 'Birth place cannot exceed 100 characters']
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: 'Gender must be male, female, or other'
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash)
  } catch (error) {
    return false
  }
}

export const User = mongoose.model<IUser>('User', userSchema)
