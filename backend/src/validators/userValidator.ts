import { IUserProfile } from '../models/User.js'

export interface RegisterInput {
  username: string
  email: string
  password: string
  profile?: Partial<IUserProfile>
}

export interface LoginInput {
  email: string
  password: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class UserValidator {
  static validateRegistration(input: RegisterInput): ValidationResult {
    const errors: string[] = []

    // Username validation
    if (!input.username || input.username.trim().length === 0) {
      errors.push('Username is required')
    } else if (input.username.length < 3) {
      errors.push('Username must be at least 3 characters long')
    } else if (input.username.length > 30) {
      errors.push('Username cannot exceed 30 characters')
    } else if (!/^[a-zA-Z0-9_]+$/.test(input.username)) {
      errors.push('Username can only contain letters, numbers, and underscores')
    }

    // Email validation
    if (!input.email || input.email.trim().length === 0) {
      errors.push('Email is required')
    } else if (!/^\S+@\S+\.\S+$/.test(input.email)) {
      errors.push('Please provide a valid email address')
    }

    // Password validation
    if (!input.password || input.password.length === 0) {
      errors.push('Password is required')
    } else if (input.password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    } else if (input.password.length > 100) {
      errors.push('Password cannot exceed 100 characters')
    }

    // Profile validation (if provided)
    if (input.profile) {
      const profileErrors = this.validateProfile(input.profile)
      errors.push(...profileErrors)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateLogin(input: LoginInput): ValidationResult {
    const errors: string[] = []

    // Email validation
    if (!input.email || input.email.trim().length === 0) {
      errors.push('Email is required')
    } else if (!/^\S+@\S+\.\S+$/.test(input.email)) {
      errors.push('Please provide a valid email address')
    }

    // Password validation
    if (!input.password || input.password.length === 0) {
      errors.push('Password is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateProfile(profile: Partial<IUserProfile>): string[] {
    const errors: string[] = []

    // Birth date validation
    if (profile.birthDate) {
      const birthDate = new Date(profile.birthDate)
      if (isNaN(birthDate.getTime())) {
        errors.push('Invalid birth date format')
      } else if (birthDate > new Date()) {
        errors.push('Birth date cannot be in the future')
      }
    }

    // Birth time validation
    if (profile.birthTime) {
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(profile.birthTime)) {
        errors.push('Birth time must be in HH:MM format')
      }
    }

    // Birth place validation
    if (profile.birthPlace) {
      if (profile.birthPlace.length > 100) {
        errors.push('Birth place cannot exceed 100 characters')
      }
    }

    // Gender validation
    if (profile.gender) {
      if (!['male', 'female', 'other'].includes(profile.gender)) {
        errors.push('Gender must be male, female, or other')
      }
    }

    return errors
  }

  static validateProfileUpdate(profile: Partial<IUserProfile>): ValidationResult {
    const errors = this.validateProfile(profile)

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export convenience functions for use in controllers
export const validateRegisterInput = (input: RegisterInput): ValidationResult => {
  return UserValidator.validateRegistration(input)
}

export const validateLoginInput = (input: LoginInput): ValidationResult => {
  return UserValidator.validateLogin(input)
}

export const validateProfileUpdate = (profile: Partial<IUserProfile>): ValidationResult => {
  return UserValidator.validateProfileUpdate(profile)
}
