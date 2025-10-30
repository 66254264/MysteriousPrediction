import { ServiceConfig, IServiceConfig } from '../models/ServiceConfig.js'

export interface ServiceConfigData {
  serviceType: string
  name: string
  description: string
  requiredFields: string[]
  algorithmConfig: Record<string, any>
  isActive?: boolean
}

export class ServiceConfigService {
  private static configCache: Map<string, IServiceConfig> = new Map()
  private static cacheTimestamp: number = 0
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Initialize default service configurations
   */
  static async initializeDefaultConfigs(): Promise<void> {
    const defaultConfigs: ServiceConfigData[] = [
      {
        serviceType: 'tarot',
        name: '塔罗牌占卜',
        description: '通过塔罗牌解读您的过去、现在和未来，获得人生指引',
        requiredFields: ['question', 'spreadType'],
        algorithmConfig: {
          deckSize: 78,
          defaultSpread: 'three-card',
          availableSpreads: ['three-card', 'celtic-cross', 'single-card'],
          includeReversed: true
        },
        isActive: true
      },
      {
        serviceType: 'astrology',
        name: '星座运势',
        description: '基于您的星座和出生信息，预测您的运势和性格特点',
        requiredFields: ['birthDate', 'zodiacSign'],
        algorithmConfig: {
          zodiacSigns: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
          aspects: ['love', 'career', 'health', 'finance'],
          forecastPeriod: 'daily'
        },
        isActive: true
      },
      {
        serviceType: 'bazi',
        name: '生辰八字',
        description: '根据您的出生年月日时，分析命理和运势',
        requiredFields: ['birthDate', 'birthTime', 'gender'],
        algorithmConfig: {
          stems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
          branches: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
          elements: ['金', '木', '水', '火', '土'],
          analysisDepth: 'comprehensive'
        },
        isActive: true
      },
      {
        serviceType: 'yijing',
        name: '周易占卜',
        description: '运用周易六十四卦，为您解答疑惑，指点迷津',
        requiredFields: ['question', 'divinationMethod'],
        algorithmConfig: {
          hexagramCount: 64,
          divinationMethods: ['time-based', 'number-based', 'coin-toss'],
          includeChangingLines: true,
          interpretationStyle: 'traditional'
        },
        isActive: true
      }
    ]

    for (const config of defaultConfigs) {
      const existing = await ServiceConfig.findOne({ serviceType: config.serviceType })
      
      if (!existing) {
        await ServiceConfig.create(config)
        console.log(`✅ Initialized ${config.name} configuration`)
      }
    }
  }

  /**
   * Get all active service configurations
   */
  static async getActiveServices(): Promise<IServiceConfig[]> {
    return ServiceConfig.find({ isActive: true })
      .select('-__v')
      .sort({ serviceType: 1 })
      .lean()
  }

  /**
   * Get service configuration by type with caching
   */
  static async getServiceConfig(serviceType: string): Promise<IServiceConfig | null> {
    const now = Date.now()
    
    // Check cache validity
    if (now - this.cacheTimestamp > this.CACHE_TTL) {
      this.configCache.clear()
      this.cacheTimestamp = now
    }

    // Check cache
    const cached = this.configCache.get(serviceType)
    if (cached) {
      return cached
    }

    // Load from database
    const config = await ServiceConfig.findOne({ 
      serviceType: serviceType.toLowerCase() 
    }).lean()

    if (config) {
      this.configCache.set(serviceType, config as IServiceConfig)
    }

    return config
  }

  /**
   * Check if a service is active
   */
  static async isServiceActive(serviceType: string): Promise<boolean> {
    const config = await this.getServiceConfig(serviceType)
    return config?.isActive || false
  }

  /**
   * Validate input data against service requirements
   */
  static async validateServiceInput(
    serviceType: string,
    inputData: Record<string, any>
  ): Promise<{ isValid: boolean, missingFields: string[], errors: string[] }> {
    const config = await this.getServiceConfig(serviceType)
    
    if (!config) {
      return {
        isValid: false,
        missingFields: [],
        errors: [`Service type '${serviceType}' not found`]
      }
    }

    if (!config.isActive) {
      return {
        isValid: false,
        missingFields: [],
        errors: [`Service '${serviceType}' is currently inactive`]
      }
    }

    const missingFields: string[] = []
    const errors: string[] = []

    for (const field of config.requiredFields) {
      if (!(field in inputData) || inputData[field] === undefined || 
          inputData[field] === null || inputData[field] === '') {
        missingFields.push(field)
      }
    }

    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`)
    }

    return {
      isValid: missingFields.length === 0 && errors.length === 0,
      missingFields,
      errors
    }
  }

  /**
   * Update service configuration
   */
  static async updateServiceConfig(
    serviceType: string,
    updates: Partial<ServiceConfigData>
  ): Promise<IServiceConfig | null> {
    const config = await ServiceConfig.findOneAndUpdate(
      { serviceType: serviceType.toLowerCase() },
      { $set: updates },
      { new: true, runValidators: true }
    )

    // Clear cache for this service
    this.configCache.delete(serviceType)

    return config
  }

  /**
   * Toggle service active status
   */
  static async toggleServiceStatus(serviceType: string): Promise<IServiceConfig | null> {
    const config = await ServiceConfig.findOne({ serviceType: serviceType.toLowerCase() })
    
    if (!config) {
      return null
    }

    config.isActive = !config.isActive
    await config.save()

    // Clear cache
    this.configCache.delete(serviceType)

    return config
  }

  /**
   * Get algorithm configuration for a service
   */
  static async getAlgorithmConfig(serviceType: string): Promise<Record<string, any> | null> {
    const config = await this.getServiceConfig(serviceType)
    return config?.algorithmConfig || null
  }

  /**
   * Clear configuration cache
   */
  static clearCache(): void {
    this.configCache.clear()
    this.cacheTimestamp = 0
  }
}
