/**
 * 增强版星座算法
 * 结合问题分析、行星相位、宫位系统、月相等多维度分析
 */

import { zodiacSigns, ZodiacSign } from '../data/zodiacSigns'
import { calculateZodiacSign } from './astrologyAlgorithm'
import { analyzeQuestion, generateContextualOpening, QuestionAnalysis } from './questionAnalyzer'

interface EnhancedAstrologyReading {
  sign: ZodiacSign
  questionAnalysis?: QuestionAnalysis
  planetaryInfluences: PlanetaryInfluences
  houseAnalysis: HouseAnalysis
  moonPhase: MoonPhase
  fortune: {
    overall: string
    love: string
    career: string
    health: string
    finance: string
  }
  luckyElements: {
    color: string
    number: number
    direction: string
    time: string
  }
  advice: string[]
  detailedInterpretation: string
}

interface PlanetaryInfluences {
  sun: string // 太阳 - 自我、生命力
  moon: string // 月亮 - 情绪、直觉
  mercury: string // 水星 - 沟通、思维
  venus: string // 金星 - 爱情、美感
  mars: string // 火星 - 行动、欲望
  dominant: string
  interpretation: string
}

interface HouseAnalysis {
  relevantHouse: number
  houseName: string
  houseTheme: string
  influence: string
}

interface MoonPhase {
  phase: string
  percentage: number
  influence: string
  recommendation: string
}

/**
 * 生成增强版星座运势
 */
export function generateEnhancedAstrologyReading(
  birthDate: Date,
  name?: string,
  question?: string
): EnhancedAstrologyReading {
  // 1. 计算星座
  const sign = calculateZodiacSign(birthDate)
  
  // 2. 分析问题（如果有）
  const questionAnalysis = question ? analyzeQuestion(question) : undefined
  
  // 3. 分析行星影响
  const planetaryInfluences = analyzePlanetaryInfluences(sign, new Date(), questionAnalysis)
  
  // 4. 分析相关宫位
  const houseAnalysis = analyzeRelevantHouse(sign, questionAnalysis)
  
  // 5. 分析月相
  const moonPhase = analyzeMoonPhase(new Date())
  
  // 6. 生成运势
  const fortune = generateEnhancedFortune(sign, questionAnalysis, planetaryInfluences, moonPhase)
  
  // 7. 生成幸运元素
  const luckyElements = generateEnhancedLuckyElements(sign, new Date(), moonPhase)
  
  // 8. 生成建议
  const advice = generateEnhancedAdvice(sign, questionAnalysis, planetaryInfluences, houseAnalysis)
  
  // 9. 生成详细解读
  const detailedInterpretation = generateDetailedInterpretation(
    sign,
    questionAnalysis,
    planetaryInfluences,
    houseAnalysis,
    moonPhase,
    question
  )
  
  return {
    sign,
    questionAnalysis,
    planetaryInfluences,
    houseAnalysis,
    moonPhase,
    fortune,
    luckyElements,
    advice,
    detailedInterpretation
  }
}

/**
 * 分析行星影响
 */
function analyzePlanetaryInfluences(
  sign: ZodiacSign,
  date: Date,
  analysis?: QuestionAnalysis
): PlanetaryInfluences {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  
  // 简化的行星位置计算（实际应该使用天文算法）
  const sunPosition = (dayOfYear % 30) / 30
  const moonPosition = (dayOfYear % 28) / 28
  const mercuryPosition = (dayOfYear % 88) / 88
  const venusPosition = (dayOfYear % 225) / 225
  const marsPosition = (dayOfYear % 687) / 687
  
  // 太阳影响（生命力、自我表达）
  const sunInfluence = sunPosition > 0.5 
    ? `太阳能量强劲，${sign.name}的自信和创造力处于高峰期。这是展现自我、追求目标的绝佳时机。`
    : `太阳能量温和，${sign.name}适合内省和规划。保持耐心，积蓄力量等待时机。`
  
  // 月亮影响（情绪、直觉）
  const moonInfluence = moonPosition > 0.7
    ? `月亮能量充盈，${sign.name}的直觉和情感敏锐度提升。相信你的第六感，它会为你指引方向。`
    : moonPosition > 0.3
    ? `月亮能量平衡，${sign.name}的情绪稳定。这是处理人际关系和情感事务的好时机。`
    : `月亮能量较弱，${sign.name}需要多关注内心需求。给自己一些独处和休息的时间。`
  
  // 水星影响（沟通、思维）
  const mercuryInfluence = mercuryPosition > 0.6
    ? `水星活跃，${sign.name}的思维敏捷，沟通顺畅。适合学习、写作、谈判等需要脑力的活动。`
    : `水星能量平稳，${sign.name}适合深度思考。避免仓促决策，多花时间理清思路。`
  
  // 金星影响（爱情、美感）
  const venusInfluence = venusPosition > 0.5
    ? `金星祝福，${sign.name}的魅力值爆表。感情运势上升，艺术灵感丰富。享受美好的人际互动吧。`
    : `金星能量温和，${sign.name}适合培养内在美。专注于自我提升，魅力会自然散发。`
  
  // 火星影响（行动、欲望）
  const marsInfluence = marsPosition > 0.6
    ? `火星激发，${sign.name}充满行动力和勇气。这是采取主动、突破障碍的好时机。`
    : `火星能量稳定，${sign.name}适合稳扎稳打。制定计划，循序渐进地推进目标。`
  
  // 确定主导行星
  let dominant = sign.rulingPlanet
  let dominantInfluence = ''
  
  if (sign.rulingPlanet === '太阳') {
    dominantInfluence = sunInfluence
  } else if (sign.rulingPlanet === '月亮') {
    dominantInfluence = moonInfluence
  } else if (sign.rulingPlanet === '水星') {
    dominantInfluence = mercuryInfluence
  } else if (sign.rulingPlanet === '金星') {
    dominantInfluence = venusInfluence
  } else if (sign.rulingPlanet === '火星') {
    dominantInfluence = marsInfluence
  } else {
    // 外行星（木星、土星、天王星、海王星、冥王星）
    dominantInfluence = `${sign.rulingPlanet}作为${sign.name}的守护星，为你带来深远的影响和转变的力量。`
  }
  
  // 综合解读
  let interpretation = `当前行星配置对${sign.name}整体有利。`
  
  if (analysis?.category === 'love') {
    interpretation += `金星的位置特别值得关注，它直接影响你的感情运势。`
  } else if (analysis?.category === 'career') {
    interpretation += `太阳和火星的能量将助力你的事业发展。`
  } else if (analysis?.category === 'wealth') {
    interpretation += `木星的扩张能量可能为你带来财务机会。`
  }
  
  return {
    sun: sunInfluence,
    moon: moonInfluence,
    mercury: mercuryInfluence,
    venus: venusInfluence,
    mars: marsInfluence,
    dominant,
    interpretation
  }
}

/**
 * 分析相关宫位
 */
function analyzeRelevantHouse(
  sign: ZodiacSign,
  analysis?: QuestionAnalysis
): HouseAnalysis {
  // 十二宫位对应
  const houses = [
    { number: 1, name: '命宫', theme: '自我、外貌、个性' },
    { number: 2, name: '财帛宫', theme: '金钱、价值观、物质' },
    { number: 3, name: '兄弟宫', theme: '沟通、学习、兄弟姐妹' },
    { number: 4, name: '田宅宫', theme: '家庭、根基、内心安全' },
    { number: 5, name: '子女宫', theme: '创造、恋爱、娱乐' },
    { number: 6, name: '奴仆宫', theme: '工作、健康、日常' },
    { number: 7, name: '夫妻宫', theme: '婚姻、合作、人际' },
    { number: 8, name: '疾厄宫', theme: '转变、深度、共享资源' },
    { number: 9, name: '迁移宫', theme: '哲学、旅行、高等教育' },
    { number: 10, name: '官禄宫', theme: '事业、地位、公众形象' },
    { number: 11, name: '福德宫', theme: '朋友、愿望、社群' },
    { number: 12, name: '相貌宫', theme: '潜意识、灵性、隐秘' }
  ]
  
  // 根据问题类别选择相关宫位
  let relevantHouse = houses[0] // 默认命宫
  
  if (analysis) {
    switch (analysis.category) {
      case 'love':
        relevantHouse = houses[4] // 第5宫 - 恋爱
        break
      case 'career':
        relevantHouse = houses[9] // 第10宫 - 事业
        break
      case 'wealth':
        relevantHouse = houses[1] // 第2宫 - 财富
        break
      case 'health':
        relevantHouse = houses[5] // 第6宫 - 健康
        break
      case 'family':
        relevantHouse = houses[3] // 第4宫 - 家庭
        break
      case 'study':
        relevantHouse = houses[2] // 第3宫 - 学习
        break
      default:
        relevantHouse = houses[0] // 第1宫 - 综合
    }
  }
  
  // 生成宫位影响解读
  const influence = `第${relevantHouse.number}宫（${relevantHouse.name}）当前受到${sign.rulingPlanet}的影响，`
    + `这个宫位主管${relevantHouse.theme}。`
    + `对于${sign.name}来说，这意味着在${relevantHouse.theme}方面会有特别的能量和机遇。`
  
  return {
    relevantHouse: relevantHouse.number,
    houseName: relevantHouse.name,
    houseTheme: relevantHouse.theme,
    influence
  }
}

/**
 * 分析月相
 */
function analyzeMoonPhase(date: Date): MoonPhase {
  // 简化的月相计算（实际应该使用天文算法）
  const knownNewMoon = new Date('2024-01-11') // 已知新月日期
  const daysSinceNewMoon = Math.floor((date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24))
  const lunarCycle = 29.53 // 月球周期
  const currentPhase = (daysSinceNewMoon % lunarCycle) / lunarCycle
  
  let phase = ''
  let influence = ''
  let recommendation = ''
  
  if (currentPhase < 0.125) {
    phase = '新月'
    influence = '新月代表新的开始和种子的播种。这是设定意图、开启新计划的最佳时机。'
    recommendation = '制定新目标，开始新项目，播下希望的种子。'
  } else if (currentPhase < 0.25) {
    phase = '娥眉月'
    influence = '娥眉月象征成长和建立。你的计划开始显现雏形，保持耐心和努力。'
    recommendation = '采取行动，克服初期障碍，坚持你的目标。'
  } else if (currentPhase < 0.375) {
    phase = '上弦月'
    influence = '上弦月带来挑战和决策的时刻。这是检验你决心的时候。'
    recommendation = '做出关键决定，调整策略，克服阻力。'
  } else if (currentPhase < 0.5) {
    phase = '盈凸月'
    influence = '盈凸月象征完善和精进。你的努力即将开花结果。'
    recommendation = '完善细节，做最后的准备，保持专注。'
  } else if (currentPhase < 0.625) {
    phase = '满月'
    influence = '满月代表圆满和显化。这是收获成果、庆祝成就的时刻。'
    recommendation = '享受成果，表达感恩，释放不再需要的东西。'
  } else if (currentPhase < 0.75) {
    phase = '亏凸月'
    influence = '亏凸月象征分享和传播。将你的收获与他人分享。'
    recommendation = '分享经验，帮助他人，传播智慧。'
  } else if (currentPhase < 0.875) {
    phase = '下弦月'
    influence = '下弦月带来反思和释放。这是放下过去、清理空间的时候。'
    recommendation = '反思总结，释放负担，为新周期做准备。'
  } else {
    phase = '残月'
    influence = '残月象征休息和内省。这是充电和准备新开始的时期。'
    recommendation = '休息放松，冥想内省，信任生命的循环。'
  }
  
  return {
    phase,
    percentage: Math.round(currentPhase * 100),
    influence,
    recommendation
  }
}

/**
 * 生成增强版运势
 */
function generateEnhancedFortune(
  sign: ZodiacSign,
  analysis: QuestionAnalysis | undefined,
  planetary: PlanetaryInfluences,
  moon: MoonPhase
): EnhancedAstrologyReading['fortune'] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  // 综合运势（结合行星和月相）
  let overall = `今天是${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayOfWeek]}，`
  overall += `对${sign.name}来说是充满${sign.traits.positive[0]}能量的一天。`
  overall += `${planetary.interpretation}`
  overall += `当前${moon.phase}的能量${moon.influence.includes('新') ? '鼓励你开启新篇章' : '提醒你关注内在成长'}。`
  
  // 爱情运势（重点关注金星和第5/7宫）
  let love = ''
  if (analysis?.category === 'love') {
    love = `关于您的感情问题，${planetary.venus}`
    love += `${sign.name}的${sign.traits.positive[0]}特质在感情中特别有吸引力。`
    love += `建议${moon.phase === '满月' ? '表达真实感受，让关系更进一步' : '给彼此空间，培养内在连接'}。`
  } else {
    love = `感情方面，${planetary.venus}`
    love += `${sign.name}今天在人际互动中魅力十足。`
    love += `单身者保持开放心态，有伴者多一些浪漫举动。`
  }
  
  // 事业运势（重点关注太阳、火星和第10宫）
  let career = ''
  if (analysis?.category === 'career') {
    career = `关于您的事业问题，${planetary.sun}`
    career += `${planetary.mars}`
    career += `作为${sign.element}象星座，你在职场上的${sign.traits.positive[1]}会得到认可。`
  } else {
    career = `事业方面，${planetary.sun}`
    career += `${sign.name}今天适合${sign.traits.positive[4] === '领导力强' ? '展现领导才能' : '发挥专业优势'}。`
    career += `保持专注，机会就在眼前。`
  }
  
  // 健康运势（结合月相和元素）
  let health = `健康方面，${planetary.moon}`
  health += `作为${sign.element}象星座，建议${
    sign.element === '火' ? '适度运动，避免过度消耗' :
    sign.element === '土' ? '保持规律作息，注意饮食' :
    sign.element === '风' ? '多做深呼吸，放松神经' :
    '多喝水，关注情绪健康'
  }。`
  health += `${moon.phase}期间特别适合${moon.recommendation.includes('休息') ? '休息调养' : '积极锻炼'}。`
  
  // 财运（结合木星能量和第2/8宫）
  let finance = ''
  if (analysis?.category === 'wealth') {
    finance = `关于您的财运问题，当前行星配置对${sign.name}的财务状况有利。`
    finance += `${sign.traits.positive[3]}的特质会帮助你做出明智的财务决策。`
    finance += `建议${moon.phase === '新月' ? '规划新的投资' : moon.phase === '满月' ? '收获之前的投入' : '稳健管理现有资产'}。`
  } else {
    finance = `财运方面，${sign.name}今天有不错的机会。`
    finance += `保持${sign.traits.positive[3]}的态度，理性评估风险。`
    finance += `避免冲动消费，长期规划更重要。`
  }
  
  return { overall, love, career, health, finance }
}

/**
 * 生成增强版幸运元素
 */
function generateEnhancedLuckyElements(
  sign: ZodiacSign,
  date: Date,
  moon: MoonPhase
): EnhancedAstrologyReading['luckyElements'] {
  // 根据星座元素确定幸运颜色
  const elementColors = {
    '火': ['红色', '橙色', '金色'],
    '土': ['棕色', '绿色', '黄色'],
    '风': ['白色', '浅蓝', '银色'],
    '水': ['蓝色', '紫色', '海绿']
  }
  
  const colors = elementColors[sign.element]
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const colorIndex = dayOfYear % colors.length
  
  // 幸运数字（结合星座ID和日期）
  const number = ((sign.id + dayOfYear) % 9) + 1
  
  // 幸运方位（根据元素）
  const elementDirections = {
    '火': '南方',
    '土': '中央',
    '风': '东方',
    '水': '北方'
  }
  
  // 幸运时间（根据月相）
  const time = moon.phase.includes('月') && moon.percentage < 50 
    ? '上午时段（6:00-12:00）'
    : '下午时段（14:00-18:00）'
  
  return {
    color: colors[colorIndex],
    number,
    direction: elementDirections[sign.element],
    time
  }
}

/**
 * 生成增强版建议
 */
function generateEnhancedAdvice(
  sign: ZodiacSign,
  analysis: QuestionAnalysis | undefined,
  planetary: PlanetaryInfluences,
  house: HouseAnalysis
): string[] {
  const advice: string[] = []
  
  // 基于问题类别的建议
  if (analysis) {
    if (analysis.category === 'love') {
      advice.push(`在感情中发挥${sign.name}的${sign.traits.positive[0]}特质`)
      advice.push('金星的能量支持你表达真实感受')
    } else if (analysis.category === 'career') {
      advice.push(`在职场上展现${sign.name}的${sign.traits.positive[4]}`)
      advice.push('太阳和火星的能量助力你的事业发展')
    } else if (analysis.category === 'wealth') {
      advice.push(`运用${sign.name}的${sign.traits.positive[3]}进行财务规划`)
      advice.push('木星的扩张能量可能带来财务机会')
    }
  }
  
  // 基于行星影响的建议
  advice.push(`${planetary.dominant}作为守护星，为你带来特别的指引`)
  
  // 基于宫位的建议
  advice.push(`关注第${house.relevantHouse}宫（${house.houseName}）的事务`)
  
  // 基于星座特质的建议
  advice.push(`发挥你的${sign.traits.positive[0]}，避免过度${sign.traits.negative[0]}`)
  
  // 基于元素的建议
  advice.push(`作为${sign.element}象星座，保持元素平衡很重要`)
  
  // 通用建议
  advice.push('相信宇宙的安排，一切都在最好的时机发生')
  
  return advice
}

/**
 * 生成详细解读
 */
function generateDetailedInterpretation(
  sign: ZodiacSign,
  analysis: QuestionAnalysis | undefined,
  planetary: PlanetaryInfluences,
  house: HouseAnalysis,
  moon: MoonPhase,
  question?: string
): string {
  let interpretation = ''
  
  // 开场白
  if (question && analysis) {
    interpretation += generateContextualOpening(analysis, question)
  } else {
    interpretation += `为${sign.name}进行今日星座运势分析。\n\n`
  }
  
  // 星座基本信息
  interpretation += `【星座特质】\n`
  interpretation += `${sign.name}（${sign.nameEn}）是${sign.element}象${sign.quality}星座，`
  interpretation += `守护星为${sign.rulingPlanet}。`
  interpretation += `${sign.description}\n\n`
  
  // 行星影响
  interpretation += `【行星能量分析】\n`
  interpretation += `${planetary.interpretation}\n\n`
  interpretation += `太阳：${planetary.sun}\n`
  interpretation += `月亮：${planetary.moon}\n`
  interpretation += `水星：${planetary.mercury}\n`
  interpretation += `金星：${planetary.venus}\n`
  interpretation += `火星：${planetary.mars}\n\n`
  
  // 宫位分析
  interpretation += `【宫位指引】\n`
  interpretation += `${house.influence}\n\n`
  
  // 月相影响
  interpretation += `【月相能量】\n`
  interpretation += `当前月相：${moon.phase}（${moon.percentage}%）\n`
  interpretation += `${moon.influence}\n`
  interpretation += `建议：${moon.recommendation}\n\n`
  
  return interpretation
}

export { EnhancedAstrologyReading, PlanetaryInfluences, HouseAnalysis, MoonPhase }
