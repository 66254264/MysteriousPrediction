import mongoose, { Schema, Document } from 'mongoose'

export interface IServiceConfig extends Document {
  serviceType: string
  name: string
  description: string
  requiredFields: string[]
  algorithmConfig: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const serviceConfigSchema = new Schema<IServiceConfig>({
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    unique: true,
    trim: true,
    lowercase: true,
    enum: {
      values: ['tarot', 'astrology', 'bazi', 'yijing'],
      message: 'Service type must be tarot, astrology, bazi, or yijing'
    },
    index: true
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  requiredFields: {
    type: [String],
    required: [true, 'Required fields must be specified'],
    validate: {
      validator: function(value: string[]) {
        return Array.isArray(value) && value.length > 0
      },
      message: 'At least one required field must be specified'
    }
  },
  algorithmConfig: {
    type: Schema.Types.Mixed,
    required: [true, 'Algorithm configuration is required'],
    default: {}
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  }
}, {
  timestamps: true
})

// Index for active services
serviceConfigSchema.index({ isActive: 1, serviceType: 1 })

// Static method to get all active services
serviceConfigSchema.statics.getActiveServices = async function() {
  return this.find({ isActive: true })
    .select('-__v')
    .sort({ serviceType: 1 })
    .lean()
}

// Static method to get service by type
serviceConfigSchema.statics.getByServiceType = async function(serviceType: string) {
  return this.findOne({ serviceType: serviceType.toLowerCase() }).lean()
}

// Static method to validate if service is active
serviceConfigSchema.statics.isServiceActive = async function(serviceType: string): Promise<boolean> {
  const service = await this.findOne({ serviceType: serviceType.toLowerCase(), isActive: true })
  return !!service
}

// Instance method to validate input data
serviceConfigSchema.methods.validateInputData = function(inputData: Record<string, any>): { isValid: boolean, missingFields: string[] } {
  const missingFields: string[] = []
  
  for (const field of this.requiredFields) {
    if (!(field in inputData) || inputData[field] === undefined || inputData[field] === null || inputData[field] === '') {
      missingFields.push(field)
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

export const ServiceConfig = mongoose.model<IServiceConfig>('ServiceConfig', serviceConfigSchema)
