import { Request, Response, NextFunction } from 'express'
import { generateTarotReading } from '../algorithms/tarotAlgorithm.js'
import { generateEnhancedTarotReading } from '../algorithms/tarotAlgorithmEnhanced.js'
import { generateAstrologyReading } from '../algorithms/astrologyAlgorithm.js'
import { generateEnhancedAstrologyReading } from '../algorithms/astrologyAlgorithmEnhanced.js'
import { generateBaziReading } from '../algorithms/baziAlgorithm.js'
import { generateEnhancedBaziReading } from '../algorithms/baziAlgorithmEnhanced.js'
import { generateIChingReading } from '../algorithms/iChingAlgorithm.js'
import { generateEnhancedIChingReading } from '../algorithms/iChingAlgorithmEnhanced.js'
import { PredictionRecord } from '../models/PredictionRecord.js'
import { Types } from 'mongoose'
import {
  validateTarotInput,
  validateAstrologyInput,
  validateBaziInput,
  validateYijingInput
} from '../validators/divinationValidator.js'
import { invalidateUserCache } from '../middleware/cache.js'

/**
 * 塔罗牌占卜
 */
export const tarotDivination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 验证输入
    const validation = validateTarotInput(req.body)
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    const { spreadType, question, name, birthDate, enhanced = true } = req.body
    const userId = (req as any).user?._id

    // 生成塔罗牌解读（使用增强版算法）
    const reading = enhanced 
      ? generateEnhancedTarotReading(spreadType, {
          question,
          name,
          birthDate: birthDate ? birthDate : undefined
        })
      : generateTarotReading(spreadType, {
          question,
          name,
          birthDate: birthDate ? birthDate : undefined
        })

    // 构建预测结果
    // 尝试从不同的标题中提取建议
    let adviceArray: string[] = []
    
    // 尝试提取【指引与建议】或【建议】部分
    const adviceSection = reading.interpretation.split('【指引与建议】\n')[1] || 
                         reading.interpretation.split('【建议】\n')[1]
    
    if (adviceSection) {
      adviceArray = adviceSection
        .split('\n')
        .filter(line => line.trim() && /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
    }
    
    // 如果没有提取到建议，提供默认建议
    if (adviceArray.length === 0) {
      adviceArray = [
        '保持开放的心态，接受生命的指引',
        '相信自己的直觉，它会为您指明方向',
        '塔罗牌是一面镜子，最终的选择权在您手中'
      ]
    }
    
    const result = {
      title: `塔罗牌占卜 - ${reading.spread}`,
      content: reading.interpretation,
      summary: `使用${reading.spread}为您进行占卜，抽取了${reading.cards.length}张牌`,
      advice: adviceArray,
      imagery: reading.cards[0]?.card.name
    }

    // 如果用户已登录，保存预测记录
    if (userId) {
      await PredictionRecord.create({
        userId: new Types.ObjectId(userId),
        serviceType: 'tarot',
        inputData: { spreadType, question, name, birthDate },
        result
      })
      // Invalidate user's cache after creating new prediction
      invalidateUserCache(userId.toString())
    }

    res.json({
      success: true,
      data: {
        serviceType: 'tarot',
        spread: reading.spread,
        cards: reading.cards.map(card => ({
          name: card.card.name,
          nameEn: card.card.nameEn,
          position: card.position,
          isReversed: card.isReversed,
          suit: card.card.suit
        })),
        result
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 星座预测
 */
export const astrologyDivination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = validateAstrologyInput(req.body)
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    const { birthDate, name, question, enhanced = true } = req.body
    const userId = (req as any).user?._id

    // 生成星座运势（使用增强版算法）
    const reading = enhanced
      ? generateEnhancedAstrologyReading(new Date(birthDate), name, question)
      : generateAstrologyReading({ birthDate: new Date(birthDate), name })

    // 构建预测结果
    let content = ''
    let advice: string[] = []
    
    if (enhanced && 'detailedInterpretation' in reading) {
      // 增强版算法
      content = reading.detailedInterpretation
      content += `\n【综合运势】\n${reading.fortune.overall}\n\n`
      content += `【爱情运势】\n${reading.fortune.love}\n\n`
      content += `【事业运势】\n${reading.fortune.career}\n\n`
      content += `【健康运势】\n${reading.fortune.health}\n\n`
      content += `【财运】\n${reading.fortune.finance}\n\n`
      content += `【幸运元素】\n`
      content += `幸运颜色：${reading.luckyElements.color}\n`
      content += `幸运数字：${reading.luckyElements.number}\n`
      content += `幸运方位：${reading.luckyElements.direction}\n`
      content += `幸运时间：${reading.luckyElements.time}`
      
      advice = reading.advice
    } else {
      // 原版算法
      content = `
【星座】${reading.sign.name} (${reading.sign.nameEn})
${reading.sign.element}象 | ${reading.sign.quality}

【综合运势】
${reading.fortune.overall}

【爱情运势】
${reading.fortune.love}

【事业运势】
${reading.fortune.career}

【健康运势】
${reading.fortune.health}

【财运】
${reading.fortune.finance}

【幸运元素】
幸运颜色：${reading.luckyElements.color}
幸运数字：${reading.luckyElements.number}
幸运方位：${reading.luckyElements.direction}
      `.trim()
      
      advice = reading.advice
    }

    const result = {
      title: `${reading.sign.name}运势预测`,
      content,
      summary: `${reading.sign.name}座今日运势，${reading.sign.element}象星座`,
      advice,
      imagery: reading.sign.name
    }

    // 如果用户已登录，保存预测记录
    if (userId) {
      await PredictionRecord.create({
        userId: new Types.ObjectId(userId),
        serviceType: 'astrology',
        inputData: { birthDate, name },
        result
      })
      // Invalidate user's cache after creating new prediction
      invalidateUserCache(userId.toString())
    }

    res.json({
      success: true,
      data: {
        serviceType: 'astrology',
        sign: {
          name: reading.sign.name,
          nameEn: reading.sign.nameEn,
          element: reading.sign.element,
          quality: reading.sign.quality
        },
        fortune: reading.fortune,
        luckyElements: reading.luckyElements,
        result
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 八字算命
 */
export const baziDivination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = validateBaziInput(req.body)
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    const { birthDate, birthTime, name, gender, question, enhanced = true } = req.body
    const userId = (req as any).user?._id

    // 生成八字分析（使用增强版算法）
    const reading = enhanced
      ? generateEnhancedBaziReading({
          birthDate: new Date(birthDate),
          birthTime,
          name,
          gender
        }, question)
      : generateBaziReading({
          birthDate: new Date(birthDate),
          birthTime,
          name,
          gender
        })

    // 构建预测结果
    let content = ''
    
    if (enhanced && 'detailedInterpretation' in reading) {
      // 增强版算法输出
      content = reading.detailedInterpretation + '\n\n'
      content += `【性格分析】\n${reading.personality}\n\n`
      content += `【事业运势】\n${reading.fortune.career}\n\n`
      content += `【财运分析】\n${reading.fortune.wealth}\n\n`
      content += `【健康运势】\n${reading.fortune.health}\n\n`
      content += `【感情运势】\n${reading.fortune.relationships}`
    } else {
      // 原版算法输出
      content = `
【八字命盘】
年柱：${reading.chart.year.name} (${reading.chart.year.stem.name}${reading.chart.year.stem.element} ${reading.chart.year.branch.name}${reading.chart.year.branch.element})
月柱：${reading.chart.month.name} (${reading.chart.month.stem.name}${reading.chart.month.stem.element} ${reading.chart.month.branch.name}${reading.chart.month.branch.element})
日柱：${reading.chart.day.name} (${reading.chart.day.stem.name}${reading.chart.day.stem.element} ${reading.chart.day.branch.name}${reading.chart.day.branch.element})
时柱：${reading.chart.hour.name} (${reading.chart.hour.stem.name}${reading.chart.hour.stem.element} ${reading.chart.hour.branch.name}${reading.chart.hour.branch.element})

【五行分布】
木：${reading.elements.distribution['木']} | 火：${reading.elements.distribution['火']} | 土：${reading.elements.distribution['土']} | 金：${reading.elements.distribution['金']} | 水：${reading.elements.distribution['水']}
主导五行：${reading.elements.dominant}
${reading.elements.lacking.length > 0 ? `缺失五行：${reading.elements.lacking.join('、')}` : '五行齐全'}

【性格分析】
${reading.personality}

【事业运势】
${reading.fortune.career}

【财运分析】
${reading.fortune.wealth}

【健康运势】
${reading.fortune.health}

【感情运势】
${reading.fortune.relationships}
      `.trim()
    }

    const result = {
      title: '生辰八字命理分析',
      content,
      summary: `八字：${reading.chart.year.name} ${reading.chart.month.name} ${reading.chart.day.name} ${reading.chart.hour.name}，主导五行${reading.elements.dominant}`,
      advice: reading.advice,
      imagery: reading.chart.year.branch.zodiac
    }

    // 如果用户已登录，保存预测记录
    if (userId) {
      await PredictionRecord.create({
        userId: new Types.ObjectId(userId),
        serviceType: 'bazi',
        inputData: { birthDate, birthTime, name, gender },
        result
      })
      // Invalidate user's cache after creating new prediction
      invalidateUserCache(userId.toString())
    }

    res.json({
      success: true,
      data: {
        serviceType: 'bazi',
        chart: reading.chart,
        elements: reading.elements,
        result
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 周易占卜
 */
export const yijingDivination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = validateYijingInput(req.body)
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    const { method, timestamp, numbers, question, enhanced = true } = req.body
    const userId = (req as any).user?._id

    // 生成周易占卜（使用增强版算法）
    const reading = enhanced
      ? generateEnhancedIChingReading({
          method,
          timestamp: timestamp ? new Date(timestamp) : undefined,
          numbers,
          question
        })
      : generateIChingReading({
          method,
          timestamp: timestamp ? new Date(timestamp) : undefined,
          numbers,
          question
        })

    // 构建预测结果
    let content: string = ''
    
    if (enhanced && 'detailedInterpretation' in reading) {
      // 增强版算法输出
      content = reading.detailedInterpretation as string
    } else {
      // 原版算法输出
      content = reading.interpretation
    }
    
    const result = {
      title: `周易占卜 - ${reading.primaryHexagram.chineseName}卦`,
      content,
      summary: `得${reading.primaryHexagram.chineseName}卦，${reading.changingLines.length > 0 ? `第${reading.changingLines.join('、')}爻动` : '无动爻'}`,
      advice: reading.advice,
      imagery: reading.primaryHexagram.chineseName
    }

    // 如果用户已登录，保存预测记录
    if (userId) {
      await PredictionRecord.create({
        userId: new Types.ObjectId(userId),
        serviceType: 'yijing',
        inputData: { method, timestamp, numbers, question },
        result
      })
      // Invalidate user's cache after creating new prediction
      invalidateUserCache(userId.toString())
    }

    res.json({
      success: true,
      data: {
        serviceType: 'yijing',
        primaryHexagram: {
          number: reading.primaryHexagram.number,
          chineseName: reading.primaryHexagram.chineseName,
          name: reading.primaryHexagram.name,
          trigrams: reading.primaryHexagram.trigrams
        },
        changingLines: reading.changingLines,
        transformedHexagram: reading.transformedHexagram ? {
          number: reading.transformedHexagram.number,
          chineseName: reading.transformedHexagram.chineseName,
          name: reading.transformedHexagram.name
        } : undefined,
        result
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 获取用户预测历史
 */
export const getPredictionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?._id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to view history'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 获取查询参数
    const serviceType = req.query.serviceType as string | undefined
    const limit = parseInt(req.query.limit as string) || 50
    const page = parseInt(req.query.page as string) || 1
    const skip = (page - 1) * limit

    // 验证 serviceType
    if (serviceType && !['tarot', 'astrology', 'bazi', 'yijing'].includes(serviceType)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SERVICE_TYPE',
          message: 'Service type must be tarot, astrology, bazi, or yijing'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 构建查询
    const query: any = { userId: new Types.ObjectId(userId) }
    if (serviceType) {
      query.serviceType = serviceType
    }

    // 获取总数
    const total = await PredictionRecord.countDocuments(query)

    // 获取预测记录 (optimized query with field selection)
    const records = await PredictionRecord.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('serviceType result.title result.summary createdAt')
      .lean() // Use lean() for better performance (Requirement 5.2)

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 获取单个预测记录详情
 */
export const getPredictionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?._id
    const predictionId = req.params.id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 验证 ID 格式
    if (!Types.ObjectId.isValid(predictionId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid prediction ID format'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 查找预测记录
    const record = await PredictionRecord.findOne({
      _id: new Types.ObjectId(predictionId),
      userId: new Types.ObjectId(userId)
    }).select('-__v').lean()

    if (!record) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Prediction record not found'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    res.json({
      success: true,
      data: record,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 获取用户预测统计
 */
export const getPredictionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?._id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 获取各类型预测的数量
    const stats = await PredictionRecord.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          lastPrediction: { $max: '$createdAt' }
        }
      },
      { $sort: { count: -1 } }
    ])

    // 获取总数
    const total = await PredictionRecord.countDocuments({ userId: new Types.ObjectId(userId) })

    // 格式化统计数据
    const formattedStats = {
      total,
      byServiceType: stats.map((stat: any) => ({
        serviceType: stat._id,
        count: stat.count,
        lastPrediction: stat.lastPrediction
      }))
    }

    res.json({
      success: true,
      data: formattedStats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 删除预测记录
 */
export const deletePrediction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?._id
    const predictionId = req.params.id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 验证 ID 格式
    if (!Types.ObjectId.isValid(predictionId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid prediction ID format'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // 删除预测记录
    const result = await PredictionRecord.deleteOne({
      _id: new Types.ObjectId(predictionId),
      userId: new Types.ObjectId(userId)
    })

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Prediction record not found'
        },
        timestamp: new Date().toISOString()
      })
      return
    }

    // Invalidate user's cache after deleting prediction
    invalidateUserCache(userId.toString())

    res.json({
      success: true,
      message: 'Prediction record deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    next(error)
  }
}
