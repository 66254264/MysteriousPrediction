import mongoose, { Schema, Document, Types } from 'mongoose'

export type ServiceType = 'tarot' | 'astrology' | 'bazi' | 'yijing'

export interface IPredictionResult {
  title: string
  content: string
  summary: string
  advice: string[]
  imagery?: string
}

export interface IPredictionRecord extends Document {
  userId: Types.ObjectId
  serviceType: ServiceType
  inputData: Record<string, any>
  result: IPredictionResult
  createdAt: Date
}

const predictionRecordSchema = new Schema<IPredictionRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: {
      values: ['tarot', 'astrology', 'bazi', 'yijing'],
      message: 'Service type must be tarot, astrology, bazi, or yijing'
    },
    index: true
  },
  inputData: {
    type: Schema.Types.Mixed,
    required: [true, 'Input data is required'],
    validate: {
      validator: function(value: any) {
        return value && typeof value === 'object' && Object.keys(value).length > 0
      },
      message: 'Input data must be a non-empty object'
    }
  },
  result: {
    title: {
      type: String,
      required: [true, 'Result title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Result content is required'],
      minlength: [200, 'Content must be at least 200 characters'],
      maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    summary: {
      type: String,
      required: [true, 'Result summary is required'],
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    advice: {
      type: [String],
      required: [true, 'Advice is required'],
      validate: {
        validator: function(value: string[]) {
          return Array.isArray(value) && value.length > 0
        },
        message: 'At least one piece of advice is required'
      }
    },
    imagery: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries (Requirement 5.1, 5.2)
predictionRecordSchema.index({ userId: 1, createdAt: -1 }) // For history queries sorted by date
predictionRecordSchema.index({ userId: 1, serviceType: 1 }) // For filtered history queries
predictionRecordSchema.index({ userId: 1, serviceType: 1, createdAt: -1 }) // Compound index for filtered + sorted queries

// Static method to get user's prediction history
predictionRecordSchema.statics.getUserHistory = async function(
  userId: Types.ObjectId,
  options?: {
    serviceType?: ServiceType
    limit?: number
    skip?: number
  }
) {
  const query: any = { userId }
  
  if (options?.serviceType) {
    query.serviceType = options.serviceType
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options?.limit || 50)
    .skip(options?.skip || 0)
    .select('-__v')
    .lean()
}

// Static method to get prediction count by service type
predictionRecordSchema.statics.getServiceTypeStats = async function(userId: Types.ObjectId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$serviceType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

// Instance method to get summary info
predictionRecordSchema.methods.getSummaryInfo = function() {
  return {
    id: this._id,
    serviceType: this.serviceType,
    title: this.result.title,
    summary: this.result.summary,
    createdAt: this.createdAt
  }
}

export const PredictionRecord = mongoose.model<IPredictionRecord>('PredictionRecord', predictionRecordSchema)
