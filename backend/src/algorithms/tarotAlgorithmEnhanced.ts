/**
 * 增强版塔罗牌算法
 * 结合问题分析、牌面组合、元素平衡等多维度分析
 */

import { tarotCards, TarotCard } from '../data/tarotCards'
import { analyzeQuestion, generateContextualOpening, QuestionAnalysis } from './questionAnalyzer'
import { TarotSpread, DrawnCard, TarotReading, tarotSpreads, drawCards } from './tarotAlgorithm'

interface EnhancedTarotReading extends TarotReading {
  questionAnalysis: QuestionAnalysis
  elementBalance: ElementBalance
  cardCombinations: CardCombination[]
  numerology: NumerologyAnalysis
}

interface ElementBalance {
  fire: number // 火 - 权杖
  water: number // 水 - 圣杯
  air: number // 风 - 宝剑
  earth: number // 土 - 星币
  dominant: string
  lacking: string[]
  interpretation: string
}

interface CardCombination {
  cards: string[]
  meaning: string
  relevance: string
}

interface NumerologyAnalysis {
  totalValue: number
  reducedValue: number
  meaning: string
}

/**
 * 生成增强版塔罗牌解读
 */
export function generateEnhancedTarotReading(
  spreadType: keyof typeof tarotSpreads,
  userInfo?: { name?: string; birthDate?: string; question?: string }
): EnhancedTarotReading {
  // 1. 分析问题
  const questionAnalysis = userInfo?.question 
    ? analyzeQuestion(userInfo.question)
    : {
        category: 'general' as const,
        keywords: [],
        sentiment: 'neutral' as const,
        timeframe: 'general' as const,
        aspects: [],
        urgency: 'low' as const
      }
  
  // 2. 抽牌
  const spread = tarotSpreads[spreadType]
  const drawnCards = drawCards(spreadType, userInfo)
  
  // 3. 分析元素平衡
  const elementBalance = analyzeElementBalance(drawnCards)
  
  // 4. 分析牌面组合
  const cardCombinations = analyzeCardCombinations(drawnCards, questionAnalysis)
  
  // 5. 数字命理分析
  const numerology = analyzeNumerology(drawnCards)
  
  // 6. 生成综合解读
  const interpretation = generateEnhancedInterpretation(
    drawnCards,
    spread,
    questionAnalysis,
    elementBalance,
    cardCombinations,
    numerology,
    userInfo?.question
  )
  
  return {
    spread: spread.name,
    cards: drawnCards,
    interpretation,
    questionAnalysis,
    elementBalance,
    cardCombinations,
    numerology
  }
}

/**
 * 分析元素平衡
 */
function analyzeElementBalance(cards: DrawnCard[]): ElementBalance {
  const balance = {
    fire: 0,    // 权杖
    water: 0,   // 圣杯
    air: 0,     // 宝剑
    earth: 0    // 星币
  }
  
  cards.forEach(drawn => {
    const suit = drawn.card.suit
    if (suit === 'wands') balance.fire++
    else if (suit === 'cups') balance.water++
    else if (suit === 'swords') balance.air++
    else if (suit === 'pentacles') balance.earth++
    // major arcana 不计入元素统计
  })
  
  // 找出主导和缺失元素
  let maxCount = 0
  let dominant = 'balanced'
  const lacking: string[] = []
  
  const elementNames = {
    fire: '火（权杖）',
    water: '水（圣杯）',
    air: '风（宝剑）',
    earth: '土（星币）'
  }
  
  Object.entries(balance).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominant = elementNames[element as keyof typeof elementNames]
    }
    if (count === 0 && cards.length > 3) {
      lacking.push(elementNames[element as keyof typeof elementNames])
    }
  })
  
  // 生成元素解读
  let interpretation = ''
  if (maxCount > cards.length / 2) {
    interpretation = `牌阵中${dominant}元素占主导，`
    if (dominant.includes('火')) {
      interpretation += '显示出强烈的行动力、热情和创造力。这是采取主动、追求目标的好时机。'
    } else if (dominant.includes('水')) {
      interpretation += '显示出丰富的情感、直觉和想象力。关注内心感受和人际关系很重要。'
    } else if (dominant.includes('风')) {
      interpretation += '显示出清晰的思维、沟通和分析能力。理性思考和有效沟通是关键。'
    } else if (dominant.includes('土')) {
      interpretation += '显示出务实、稳定和物质层面的关注。脚踏实地、循序渐进会带来成功。'
    }
  } else {
    interpretation = '牌阵中各元素较为平衡，显示出全面发展的趋势。'
  }
  
  if (lacking.length > 0) {
    interpretation += `\n\n需要注意的是，牌阵中缺少${lacking.join('和')}元素，`
    interpretation += '建议在相关方面多加关注和补充。'
  }
  
  return {
    ...balance,
    dominant,
    lacking,
    interpretation
  }
}

/**
 * 分析牌面组合
 */
function analyzeCardCombinations(
  cards: DrawnCard[],
  analysis: QuestionAnalysis
): CardCombination[] {
  const combinations: CardCombination[] = []
  
  // 1. 分析大阿卡纳的出现
  const majorCards = cards.filter(c => c.card.suit === 'major')
  if (majorCards.length >= 2) {
    combinations.push({
      cards: majorCards.map(c => c.card.name),
      meaning: '多张大阿卡纳牌的出现表明这是人生中的重要时刻，涉及深层次的转变和成长。',
      relevance: '这些重大主题将主导当前的情况发展。'
    })
  }
  
  // 2. 分析相邻牌的关系（针对三张牌阵）
  if (cards.length === 3) {
    const past = cards[0]
    const present = cards[1]
    const future = cards[2]
    
    // 过去到现在的转变
    if (past.isReversed && !present.isReversed) {
      combinations.push({
        cards: [past.card.name, present.card.name],
        meaning: '从过去的困境中走出，当前状况正在好转。',
        relevance: '这种积极的转变值得珍惜和巩固。'
      })
    }
    
    // 现在到未来的发展
    if (!present.isReversed && !future.isReversed) {
      combinations.push({
        cards: [present.card.name, future.card.name],
        meaning: '当前的积极状态将延续到未来，前景乐观。',
        relevance: '保持现在的方向和努力，会有好的结果。'
      })
    }
  }
  
  // 3. 根据问题类别分析特定组合
  if (analysis.category === 'love') {
    const loveCards = cards.filter(c => 
      c.card.name.includes('恋人') || 
      c.card.name.includes('圣杯') ||
      c.card.suit === 'cups'
    )
    if (loveCards.length > 0) {
      combinations.push({
        cards: loveCards.map(c => c.card.name),
        meaning: '这些牌直接关联到您的感情问题。',
        relevance: '它们揭示了感情状况的核心动态。'
      })
    }
  }
  
  if (analysis.category === 'career') {
    const careerCards = cards.filter(c =>
      c.card.name.includes('战车') ||
      c.card.name.includes('权杖') ||
      c.card.suit === 'wands'
    )
    if (careerCards.length > 0) {
      combinations.push({
        cards: careerCards.map(c => c.card.name),
        meaning: '这些牌与您的事业发展密切相关。',
        relevance: '它们指示了职业道路上的机遇和挑战。'
      })
    }
  }
  
  return combinations
}

/**
 * 数字命理分析
 */
function analyzeNumerology(cards: DrawnCard[]): NumerologyAnalysis {
  let totalValue = 0
  
  cards.forEach(drawn => {
    const card = drawn.card
    // 大阿卡纳使用编号，小阿卡纳使用牌面数字
    if (card.suit === 'major') {
      // 愚者=0, 魔术师=1, ... 世界=21
      const majorNumber = parseInt(card.nameEn.split(' ')[0]) || 0
      totalValue += majorNumber
    } else {
      // 小阿卡纳：Ace=1, 2-10=面值, 侍从=11, 骑士=12, 王后=13, 国王=14
      if (card.name.includes('王牌')) totalValue += 1
      else if (card.name.includes('侍从')) totalValue += 11
      else if (card.name.includes('骑士')) totalValue += 12
      else if (card.name.includes('王后')) totalValue += 13
      else if (card.name.includes('国王')) totalValue += 14
      else {
        // 提取数字
        const match = card.name.match(/\d+/)
        if (match) totalValue += parseInt(match[0])
      }
    }
  })
  
  // 数字归约（Pythagorean reduction）
  let reducedValue = totalValue
  while (reducedValue > 22 && reducedValue !== 11 && reducedValue !== 22) {
    reducedValue = reducedValue.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  
  // 数字含义
  const numberMeanings: Record<number, string> = {
    1: '新开始、独立、领导力',
    2: '平衡、合作、二元性',
    3: '创造、表达、成长',
    4: '稳定、结构、基础',
    5: '变化、自由、冒险',
    6: '和谐、责任、爱',
    7: '智慧、内省、灵性',
    8: '力量、成就、物质',
    9: '完成、智慧、人道',
    10: '完满、循环、新周期',
    11: '直觉、启示、灵性觉醒',
    22: '大师数字、实现梦想、建造'
  }
  
  const meaning = numberMeanings[reducedValue] || numberMeanings[reducedValue % 10] || '转变与成长'
  
  return {
    totalValue,
    reducedValue,
    meaning: `牌阵的数字能量为${reducedValue}，代表${meaning}。这个数字揭示了当前情况的核心主题。`
  }
}

/**
 * 生成增强版综合解读
 */
function generateEnhancedInterpretation(
  cards: DrawnCard[],
  spread: TarotSpread,
  analysis: QuestionAnalysis,
  elementBalance: ElementBalance,
  combinations: CardCombination[],
  numerology: NumerologyAnalysis,
  question?: string
): string {
  let interpretation = ''
  
  // 1. 开场白（结合问题分析）
  if (question) {
    interpretation += generateContextualOpening(analysis, question)
  } else {
    interpretation += `使用${spread.name}为您进行占卜。\n\n`
  }
  
  // 2. 逐张牌解读（根据问题类别调整侧重点）
  interpretation += '【牌面解读】\n\n'
  cards.forEach((drawn, index) => {
    const { card, position, isReversed } = drawn
    const orientation = isReversed ? '逆位' : '正位'
    const meaning = isReversed ? card.reversed : card.upright
    
    interpretation += `${position}：${card.name} (${card.nameEn}) - ${orientation}\n`
    interpretation += `关键词：${meaning.keywords.join('、')}\n`
    
    // 根据问题类别提供针对性解读
    interpretation += generateContextualMeaning(card, isReversed, analysis, position)
    
    if (index < cards.length - 1) {
      interpretation += '\n'
    }
  })
  
  // 3. 元素平衡分析
  interpretation += '\n\n【元素能量分析】\n'
  interpretation += elementBalance.interpretation
  
  // 4. 牌面组合分析
  if (combinations.length > 0) {
    interpretation += '\n\n【牌面组合洞察】\n'
    combinations.forEach((combo, index) => {
      interpretation += `${index + 1}. ${combo.meaning}\n`
      interpretation += `   ${combo.relevance}\n`
    })
  }
  
  // 5. 数字命理
  interpretation += '\n\n【数字能量】\n'
  interpretation += numerology.meaning
  
  // 6. 综合解读
  interpretation += '\n\n【综合解读】\n'
  interpretation += generateContextualOverall(cards, spread, analysis, elementBalance)
  
  // 7. 针对性建议
  interpretation += '\n\n【指引与建议】\n'
  interpretation += generateContextualAdvice(cards, analysis, elementBalance)
  
  return interpretation
}

/**
 * 根据问题类别生成针对性牌义
 */
function generateContextualMeaning(
  card: TarotCard,
  isReversed: boolean,
  analysis: QuestionAnalysis,
  position: string
): string {
  const meaning = isReversed ? card.reversed : card.upright
  let contextual = `含义：${meaning.meaning}\n`
  
  // 根据问题类别添加针对性解读
  if (analysis.category === 'love' && position.includes('现在')) {
    contextual += `在感情方面：这张牌显示您当前的感情状态${isReversed ? '可能面临' : '正在经历'}${meaning.keywords[0]}的阶段。`
  } else if (analysis.category === 'career' && position.includes('未来')) {
    contextual += `在事业方面：这预示着您的职业发展将${isReversed ? '需要注意' : '迎来'}${meaning.keywords[0]}的机会。`
  } else if (analysis.category === 'wealth') {
    contextual += `在财运方面：${meaning.keywords[0]}的能量${isReversed ? '提醒您谨慎' : '支持您'}在金钱事务上的决策。`
  }
  
  return contextual
}

/**
 * 生成针对性综合解读
 */
function generateContextualOverall(
  cards: DrawnCard[],
  spread: TarotSpread,
  analysis: QuestionAnalysis,
  elementBalance: ElementBalance
): string {
  let overall = ''
  
  // 根据问题类别定制开头
  const categoryIntros = {
    love: '从感情的角度来看，',
    career: '从事业发展的角度来看，',
    wealth: '从财运的角度来看，',
    health: '从健康的角度来看，',
    decision: '关于您面临的选择，',
    general: '从整体运势来看，'
  }
  
  overall += categoryIntros[analysis.category] || '从整体来看，'
  
  // 分析牌阵的整体趋势
  const majorCards = cards.filter(c => c.card.suit === 'major')
  const reversedCards = cards.filter(c => c.isReversed)
  
  if (majorCards.length > cards.length / 2) {
    overall += '大阿卡纳牌的主导表明这是一个重要的转折点，涉及深层次的变化。'
  }
  
  if (reversedCards.length > cards.length / 2) {
    overall += '较多的逆位牌提示您需要内省和调整，某些方面可能存在阻碍或延迟。'
  } else if (reversedCards.length === 0) {
    overall += '所有牌都是正位，显示能量流动顺畅，事态发展积极。'
  }
  
  // 结合元素平衡
  if (elementBalance.dominant !== 'balanced') {
    overall += `${elementBalance.dominant}元素的主导影响着整体局势的发展方向。`
  }
  
  // 根据时间框架给出预测
  if (analysis.timeframe === 'future') {
    overall += '从牌面来看，未来的发展趋势是可以把握的，关键在于您当下的选择和行动。'
  } else if (analysis.timeframe === 'present') {
    overall += '当前的情况需要您保持清醒的认知，及时做出调整。'
  }
  
  return overall
}

/**
 * 生成针对性建议
 */
function generateContextualAdvice(
  cards: DrawnCard[],
  analysis: QuestionAnalysis,
  elementBalance: ElementBalance
): string {
  const advicePoints: string[] = []
  
  // 1. 基于问题类别的建议
  if (analysis.category === 'love') {
    advicePoints.push('在感情中保持真诚和开放的沟通')
    advicePoints.push('倾听内心的声音，同时也要理解对方的感受')
  } else if (analysis.category === 'career') {
    advicePoints.push('把握当前的机会，展现您的能力和价值')
    advicePoints.push('保持专业态度，同时不忘初心')
  } else if (analysis.category === 'wealth') {
    advicePoints.push('理性分析财务状况，避免冲动决策')
    advicePoints.push('长期规划比短期收益更重要')
  }
  
  // 2. 基于元素平衡的建议
  if (elementBalance.lacking.length > 0) {
    elementBalance.lacking.forEach(element => {
      if (element.includes('火')) {
        advicePoints.push('增加行动力和热情，不要过于被动')
      } else if (element.includes('水')) {
        advicePoints.push('多关注情感需求，培养同理心')
      } else if (element.includes('风')) {
        advicePoints.push('加强理性思考和沟通能力')
      } else if (element.includes('土')) {
        advicePoints.push('注重实际行动，脚踏实地')
      }
    })
  }
  
  // 3. 基于紧急程度的建议
  if (analysis.urgency === 'high') {
    advicePoints.push('当前情况需要及时处理，但也要避免过于焦虑')
  }
  
  // 4. 基于情感倾向的建议
  if (analysis.sentiment === 'negative') {
    advicePoints.push('保持积极的心态，困难是暂时的')
    advicePoints.push('寻求支持和帮助，不要独自承担')
  }
  
  // 5. 通用建议
  advicePoints.push('相信自己的直觉，它会为您指明方向')
  advicePoints.push('塔罗牌是一面镜子，最终的选择权在您手中')
  advicePoints.push('保持开放的心态，接受生命的指引')
  
  return advicePoints.map((point, index) => `${index + 1}. ${point}`).join('\n')
}

export { EnhancedTarotReading, ElementBalance, CardCombination, NumerologyAnalysis }
