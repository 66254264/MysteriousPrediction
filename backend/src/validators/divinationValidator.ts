export interface TarotInput {
  spreadType: string
  question?: string
  name?: string
  birthDate?: string
}

export interface AstrologyInput {
  birthDate: string
  name?: string
}

export interface BaziInput {
  birthDate: string
  birthTime?: { hour: number; minute: number }
  name?: string
  gender?: 'male' | 'female' | 'other'
}

export interface YijingInput {
  method: 'time' | 'numbers'
  timestamp?: string
  numbers?: number[]
  question?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class DivinationValidator {
  /**
   * 验证塔罗牌输入
   */
  static validateTarotInput(input: TarotInput): ValidationResult {
    const errors: string[] = []

    // Spread type validation
    if (!input.spreadType) {
      errors.push('Spread type is required')
    } else if (!['threeCard', 'celticCross', 'singleCard', 'relationship', 'three-card', 'celtic-cross', 'single-card'].includes(input.spreadType)) {
      errors.push('Invalid spread type')
    }

    // Question validation
    if (input.question !== undefined) {
      if (typeof input.question !== 'string') {
        errors.push('Question must be a string')
      } else if (input.question.length > 500) {
        errors.push('Question cannot exceed 500 characters')
      }
    }

    // Name validation
    if (input.name !== undefined) {
      if (typeof input.name !== 'string') {
        errors.push('Name must be a string')
      } else if (input.name.length > 100) {
        errors.push('Name cannot exceed 100 characters')
      }
    }

    // Birth date validation
    if (input.birthDate !== undefined) {
      const date = new Date(input.birthDate)
      if (isNaN(date.getTime())) {
        errors.push('Birth date must be a valid date')
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  /**
   * 验证星座输入
   */
  static validateAstrologyInput(input: AstrologyInput): ValidationResult {
    const errors: string[] = []

    // Birth date validation
    if (!input.birthDate) {
      errors.push('Birth date is required')
    } else {
      const date = new Date(input.birthDate)
      if (isNaN(date.getTime())) {
        errors.push('Birth date must be a valid date')
      } else if (date > new Date()) {
        errors.push('Birth date cannot be in the future')
      }
    }

    // Name validation
    if (input.name !== undefined) {
      if (typeof input.name !== 'string') {
        errors.push('Name must be a string')
      } else if (input.name.length > 100) {
        errors.push('Name cannot exceed 100 characters')
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  /**
   * 验证八字输入
   */
  static validateBaziInput(input: BaziInput): ValidationResult {
    const errors: string[] = []

    // Birth date validation
    if (!input.birthDate) {
      errors.push('Birth date is required')
    } else {
      const date = new Date(input.birthDate)
      if (isNaN(date.getTime())) {
        errors.push('Birth date must be a valid date')
      } else if (date > new Date()) {
        errors.push('Birth date cannot be in the future')
      }
    }

    // Birth time validation
    if (input.birthTime !== undefined) {
      if (typeof input.birthTime !== 'object') {
        errors.push('Birth time must be an object')
      } else {
        if (input.birthTime.hour !== undefined) {
          if (!Number.isInteger(input.birthTime.hour) || input.birthTime.hour < 0 || input.birthTime.hour > 23) {
            errors.push('Hour must be between 0 and 23')
          }
        }
        if (input.birthTime.minute !== undefined) {
          if (!Number.isInteger(input.birthTime.minute) || input.birthTime.minute < 0 || input.birthTime.minute > 59) {
            errors.push('Minute must be between 0 and 59')
          }
        }
      }
    }

    // Name validation
    if (input.name !== undefined) {
      if (typeof input.name !== 'string') {
        errors.push('Name must be a string')
      } else if (input.name.length > 100) {
        errors.push('Name cannot exceed 100 characters')
      }
    }

    // Gender validation
    if (input.gender !== undefined) {
      if (!['male', 'female', 'other'].includes(input.gender)) {
        errors.push('Gender must be male, female, or other')
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  /**
   * 验证周易输入
   */
  static validateYijingInput(input: YijingInput): ValidationResult {
    const errors: string[] = []

    // Method validation
    if (!input.method) {
      errors.push('Method is required')
    } else if (!['time', 'numbers'].includes(input.method)) {
      errors.push('Method must be time or numbers')
    }

    // Timestamp validation (for time method)
    if (input.method === 'time' && input.timestamp !== undefined) {
      const date = new Date(input.timestamp)
      if (isNaN(date.getTime())) {
        errors.push('Timestamp must be a valid date')
      }
    }

    // Numbers validation (for numbers method)
    if (input.method === 'numbers') {
      if (!input.numbers) {
        errors.push('Numbers are required for numbers method')
      } else if (!Array.isArray(input.numbers)) {
        errors.push('Numbers must be an array')
      } else if (input.numbers.length < 3) {
        errors.push('At least 3 numbers are required')
      } else {
        for (const num of input.numbers) {
          if (!Number.isInteger(num) || num < 1) {
            errors.push('Each number must be a positive integer')
            break
          }
        }
      }
    }

    // Question validation
    if (input.question !== undefined) {
      if (typeof input.question !== 'string') {
        errors.push('Question must be a string')
      } else if (input.question.length > 500) {
        errors.push('Question cannot exceed 500 characters')
      }
    }

    return { isValid: errors.length === 0, errors }
  }
}

// Export convenience functions
export const validateTarotInput = (input: TarotInput): ValidationResult => {
  return DivinationValidator.validateTarotInput(input)
}

export const validateAstrologyInput = (input: AstrologyInput): ValidationResult => {
  return DivinationValidator.validateAstrologyInput(input)
}

export const validateBaziInput = (input: BaziInput): ValidationResult => {
  return DivinationValidator.validateBaziInput(input)
}

export const validateYijingInput = (input: YijingInput): ValidationResult => {
  return DivinationValidator.validateYijingInput(input)
}
