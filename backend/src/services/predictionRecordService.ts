import { Types } from 'mongoose'
import { PredictionRecord, IPredictionRecord, IPredictionResult, ServiceType } from '../models/PredictionRecord.js'

export interface CreatePredictionInput {
  userId: Types.ObjectId | string
  serviceType: ServiceType
  inputData: Record<string, any>
  result: IPredictionResult
}

export interface GetHistoryOptions {
  serviceType?: ServiceType
  limit?: number
  skip?: number
  page?: number
}

export class PredictionRecordService {
  /**
   * Create a new prediction record
   */
  static async createRecord(input: CreatePredictionInput): Promise<IPredictionRecord> {
    const record = new PredictionRecord({
      userId: input.userId,
      serviceType: input.serviceType,
      inputData: input.inputData,
      result: input.result
    })

    await record.save()
    return record
  }

  /**
   * Get a prediction record by ID
   */
  static async getRecordById(recordId: string, userId?: string): Promise<IPredictionRecord | null> {
    const query: any = { _id: recordId }
    
    if (userId) {
      query.userId = userId
    }

    return PredictionRecord.findOne(query).lean()
  }

  /**
   * Get user's prediction history with pagination
   */
  static async getUserHistory(
    userId: string,
    options: GetHistoryOptions = {}
  ): Promise<{ records: any[], total: number, page: number, totalPages: number }> {
    const limit = options.limit || 20
    const page = options.page || 1
    const skip = options.skip !== undefined ? options.skip : (page - 1) * limit

    const query: any = { userId }
    
    if (options.serviceType) {
      query.serviceType = options.serviceType
    }

    const [records, total] = await Promise.all([
      PredictionRecord.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select('-__v')
        .lean(),
      PredictionRecord.countDocuments(query)
    ])

    return {
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * Get user's latest prediction for a specific service type
   */
  static async getLatestByServiceType(
    userId: string,
    serviceType: ServiceType
  ): Promise<IPredictionRecord | null> {
    return PredictionRecord.findOne({ userId, serviceType })
      .sort({ createdAt: -1 })
      .lean()
  }

  /**
   * Get statistics about user's predictions
   */
  static async getUserStats(userId: string): Promise<any> {
    const stats = await PredictionRecord.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          lastUsed: { $max: '$createdAt' }
        }
      },
      { $sort: { count: -1 } }
    ])

    const total = await PredictionRecord.countDocuments({ userId })

    return {
      total,
      byServiceType: stats
    }
  }

  /**
   * Delete a prediction record
   */
  static async deleteRecord(recordId: string, userId: string): Promise<boolean> {
    const result = await PredictionRecord.deleteOne({ _id: recordId, userId })
    return result.deletedCount > 0
  }

  /**
   * Delete all records for a user
   */
  static async deleteAllUserRecords(userId: string): Promise<number> {
    const result = await PredictionRecord.deleteMany({ userId })
    return result.deletedCount
  }
}
