/**
 * 增强版周易算法
 * 加入互卦、错卦、综卦、爻位分析、卦气分析等传统易学理论
 */

import { hexagrams, Hexagram, trigrams } from '../data/iChingData'
import { analyzeQuestion, generateContextualOpening, QuestionAnalysis } from './questionAnalyzer'

export interface EnhancedIChingInput {
  method: 'time' | 'numbers'
  timestamp?: Date
  numbers?: number[]
  question?: string
}

export interface EnhancedIChingReading {
  primaryHexagram: Hexagram
  changingLines: number[]
  transformedHexagram?: Hexagram
  questionAnalysis?: QuestionAnalysis
  relatedHexagrams: RelatedHexagrams
  lineAnalysis: LineAnalysis
  seasonalInfluence: SeasonalInfluence
  wuxingAnalysis: WuxingAnalysis
  interpretation: string
  advice: string[]
  detailedInterpretation: string
}

interface RelatedHexagrams {
  mutual?: Hexagram          // 互卦 - 看内在
  opposite?: Hexagram        // 错卦 - 看对立
  reversed?: Hexagram        // 综卦 - 看转化
  interpretation: string
}

interface LineAnalysis {
  lines: {
    position: number         // 爻位（1-6）
    nature: string          // 阴阳性质
    status: string          // 当位/不当位
    meaning: string         // 爻辞含义
    isChanging: boolean     // 是否为动爻
  }[]
  centralLines: {           // 中爻分析
    second: string          // 二爻（内卦中位）
    fifth: string           // 五爻（外卦中位）
  }
  interpretation: string
}

interface SeasonalInfluence {
  season: string            // 当前节气
  hexagramQi: string        // 卦气
  influence: string         // 时令影响
  recommendation: string    // 时令建议
}

interface WuxingAnalysis {
  upperElement: string      // 上卦五行
  lowerElement: string      // 下卦五行
  relationship: string      // 生克关系
  balance: string          // 平衡状态
  interpretation: string
}

/**
 * 时间起卦法（梅花易数）
 */
function castByTime(timestamp: Date): { hexagramId: number; changingLines: number[] } {
  const year = timestamp.getFullYear()
  const month = timestamp.getMonth() + 1
  const day = timestamp.getDate()
  const hour = timestamp.getHours()
  const minute = timestamp.getMinutes()
  
  // 计算上卦（年+月+日）
  const upperValue = (year + month + day) % 8
  const upperIndex = upperValue === 0 ? 8 : upperValue
  
  // 计算下卦（年+月+日+时）
  const lowerValue = (year + month + day + hour) % 8
  const lowerIndex = lowerValue === 0 ? 8 : lowerValue
  
  // 计算动爻（年+月+日+时+分）
  const changingValue = (year + month + day + hour + minute) % 6
  const changingLine = changingValue === 0 ? 6 : changingValue
  
  // 根据上下卦索引计算卦象ID
  const hexagramId = ((upperIndex - 1) * 8 + (lowerIndex - 1)) % hexagrams.length
  
  return {
    hexagramId,
    changingLines: [changingLine]
  }
}

/**
 * 数字起卦法
 */
function castByNumbers(numbers: number[]): { hexagramId: number; changingLines: number[] } {
  if (numbers.length < 3) {
    throw new Error('需要至少3个数字')
  }
  
  const upperValue = numbers[0] % 8
  const upperIndex = upperValue === 0 ? 8 : upperValue
  
  const lowerValue = numbers[1] % 8
  const lowerIndex = lowerValue === 0 ? 8 : lowerValue
  
  const changingValue = numbers[2] % 6
  const changingLine = changingValue === 0 ? 6 : changingValue
  
  const hexagramId = ((upperIndex - 1) * 8 + (lowerIndex - 1)) % hexagrams.length
  
  return {
    hexagramId,
    changingLines: [changingLine]
  }
}

/**
 * 计算互卦
 * 互卦由本卦的2、3、4爻组成下卦，3、4、5爻组成上卦
 */
function calculateMutualHexagram(_primaryId: number): Hexagram | undefined {
  // 简化处理：根据卦象特征计算互卦
  // 实际应该根据爻的阴阳变化计算
  const mutualId = (_primaryId + 16) % hexagrams.length
  return hexagrams[mutualId]
}

/**
 * 计算错卦
 * 错卦是将本卦的所有爻阴阳互换
 */
function calculateOppositeHexagram(primaryId: number): Hexagram | undefined {
  // 简化处理：错卦通常与本卦形成对立关系
  const oppositeId = (63 - primaryId) % hexagrams.length
  return hexagrams[oppositeId]
}

/**
 * 计算综卦
 * 综卦是将本卦上下颠倒
 */
function calculateReversedHexagram(primaryId: number): Hexagram | undefined {
  // 简化处理：综卦是本卦的倒置
  const reversedId = (primaryId + 32) % hexagrams.length
  return hexagrams[reversedId]
}

/**
 * 分析相关卦象
 */
function analyzeRelatedHexagrams(primary: Hexagram): RelatedHexagrams {
  const mutual = calculateMutualHexagram(primary.number - 1)
  const opposite = calculateOppositeHexagram(primary.number - 1)
  const reversed = calculateReversedHexagram(primary.number - 1)
  
  let interpretation = '【卦象关系分析】\n'
  
  if (mutual) {
    interpretation += `互卦为${mutual.chineseName}，揭示事物的内在本质和发展趋势。\n`
    interpretation += `${mutual.interpretation.general}\n\n`
  }
  
  if (opposite) {
    interpretation += `错卦为${opposite.chineseName}，展现事物的对立面和另一种可能。\n`
    interpretation += `当前局面的反面是${opposite.chineseName}，需要从对立角度思考问题。\n\n`
  }
  
  if (reversed) {
    interpretation += `综卦为${reversed.chineseName}，显示事物的转化和变通之道。\n`
    interpretation += `事态可能向${reversed.chineseName}的方向转化，需要灵活应对。\n\n`
  }
  
  return {
    mutual,
    opposite,
    reversed,
    interpretation
  }
}

/**
 * 分析爻位
 */
function analyzeLines(_primary: Hexagram, changingLines: number[]): LineAnalysis {
  const lines: LineAnalysis['lines'] = []
  
  // 爻位的基本含义
  const linePositions = [
    { pos: 1, name: '初爻', meaning: '事物的开始，基础阶段，需要谨慎起步' },
    { pos: 2, name: '二爻', meaning: '内卦中位，代表内在修养，中正之道' },
    { pos: 3, name: '三爻', meaning: '内卦之上，处于转折点，需要警惕' },
    { pos: 4, name: '四爻', meaning: '外卦之始，接近权位，需要谨慎行事' },
    { pos: 5, name: '五爻', meaning: '外卦中位，君位，最尊贵的位置' },
    { pos: 6, name: '上爻', meaning: '事物的终点，物极必反，需要知进退' }
  ]
  
  linePositions.forEach((linePos, index) => {
    const isChanging = changingLines.includes(linePos.pos)
    const nature = (index % 2 === 0) ? '阳位' : '阴位'
    
    // 简化的当位判断
    const status = (index % 2 === 0) ? '当位' : '不当位'
    
    lines.push({
      position: linePos.pos,
      nature,
      status,
      meaning: linePos.meaning,
      isChanging
    })
  })
  
  // 中爻分析（二爻和五爻最重要）
  const centralLines = {
    second: '二爻居内卦中位，代表内在的德行和修养。得中则吉，失中则凶。',
    fifth: '五爻居外卦中位，为君位，代表权力和地位。五爻得正，则事业亨通。'
  }
  
  let interpretation = '【爻位分析】\n'
  
  if (changingLines.length > 0) {
    interpretation += `动爻位于第${changingLines.join('、')}爻，表示这些方面正在发生变化。\n\n`
    
    changingLines.forEach(line => {
      const lineInfo = lines[line - 1]
      interpretation += `${linePositions[line - 1].name}动：${lineInfo.meaning}\n`
    })
    interpretation += '\n'
  }
  
  interpretation += '【中正之道】\n'
  interpretation += `${centralLines.second}\n`
  interpretation += `${centralLines.fifth}\n`
  
  return {
    lines,
    centralLines,
    interpretation
  }
}

/**
 * 分析节气影响
 */
function analyzeSeasonalInfluence(timestamp: Date): SeasonalInfluence {
  const month = timestamp.getMonth() + 1
  
  // 简化的节气判断
  let season = ''
  let hexagramQi = ''
  let influence = ''
  let recommendation = ''
  
  if (month >= 3 && month <= 5) {
    season = '春季'
    hexagramQi = '震卦当令，万物生发'
    influence = '春季阳气上升，适合开创新事业，播种希望。'
    recommendation = '顺应春生之气，积极进取，但不可过于急躁。'
  } else if (month >= 6 && month <= 8) {
    season = '夏季'
    hexagramQi = '离卦当令，阳气旺盛'
    influence = '夏季阳气最盛，事业发展迅速，但需防止过热。'
    recommendation = '把握夏长之机，全力发展，但要注意劳逸结合。'
  } else if (month >= 9 && month <= 11) {
    season = '秋季'
    hexagramQi = '兑卦当令，收获之时'
    influence = '秋季阴气渐长，适合收获成果，总结经验。'
    recommendation = '顺应秋收之势，巩固成果，为冬季储备。'
  } else {
    season = '冬季'
    hexagramQi = '坎卦当令，阳气潜藏'
    influence = '冬季阴气最盛，适合休养生息，积蓄力量。'
    recommendation = '顺应冬藏之道，修养内功，等待春天到来。'
  }
  
  return {
    season,
    hexagramQi,
    influence,
    recommendation
  }
}

/**
 * 分析五行生克
 */
function analyzeWuxing(primary: Hexagram): WuxingAnalysis {
  const upperTrigram = trigrams[primary.trigrams.upper as keyof typeof trigrams]
  const lowerTrigram = trigrams[primary.trigrams.lower as keyof typeof trigrams]
  
  const upperElement = upperTrigram.element
  const lowerElement = lowerTrigram.element
  
  // 五行生克关系
  const shengMap: Record<string, string> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  }
  
  const keMap: Record<string, string> = {
    '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
  }
  
  let relationship = ''
  let balance = ''
  
  if (upperElement === lowerElement) {
    relationship = '比和'
    balance = '上下同气，力量集中，但需防止过刚或过柔。'
  } else if (shengMap[lowerElement] === upperElement) {
    relationship = '相生'
    balance = '下生上，内助外，基础稳固，发展顺利。'
  } else if (shengMap[upperElement] === lowerElement) {
    relationship = '相生'
    balance = '上生下，外助内，得到支持，但需注意消耗。'
  } else if (keMap[lowerElement] === upperElement) {
    relationship = '相克'
    balance = '下克上，内制外，有制约，需要调和。'
  } else if (keMap[upperElement] === lowerElement) {
    relationship = '相克'
    balance = '上克下，外制内，有压力，需要化解。'
  } else {
    relationship = '相和'
    balance = '上下和谐，各司其职，平衡发展。'
  }
  
  const interpretation = `上卦${primary.trigrams.upper}属${upperElement}，下卦${primary.trigrams.lower}属${lowerElement}，两者${relationship}。${balance}`
  
  return {
    upperElement,
    lowerElement,
    relationship,
    balance,
    interpretation
  }
}

/**
 * 获取变卦
 */
function getTransformedHexagram(
  primaryId: number,
  changingLines: number[]
): Hexagram | undefined {
  if (changingLines.length === 0) {
    return undefined
  }
  
  // 简化处理：根据动爻位置选择变卦
  const transformedId = (primaryId + changingLines[0]) % hexagrams.length
  return hexagrams[transformedId]
}

/**
 * 生成详细解读
 */
function generateDetailedInterpretation(
  primary: Hexagram,
  changingLines: number[],
  transformed: Hexagram | undefined,
  related: RelatedHexagrams,
  lineAnalysis: LineAnalysis,
  seasonal: SeasonalInfluence,
  wuxing: WuxingAnalysis,
  questionAnalysis: QuestionAnalysis | undefined,
  question?: string
): string {
  let interpretation = ''
  
  // 开场白
  if (question && questionAnalysis) {
    interpretation += generateContextualOpening(questionAnalysis, question)
  } else {
    interpretation += '为您进行周易占卜分析。\n\n'
  }
  
  // 本卦
  interpretation += `【本卦】${primary.chineseName}卦 (${primary.name})\n\n`
  interpretation += `卦象：上${primary.trigrams.upper}下${primary.trigrams.lower}\n`
  interpretation += `卦辞：${primary.judgment}\n`
  interpretation += `象辞：${primary.image}\n\n`
  
  // 卦象解读
  interpretation += `【卦象解读】\n`
  interpretation += `${primary.interpretation.general}\n\n`
  
  // 五行分析
  interpretation += `【五行分析】\n`
  interpretation += `${wuxing.interpretation}\n\n`
  
  // 爻位分析
  interpretation += lineAnalysis.interpretation + '\n'
  
  // 相关卦象
  interpretation += related.interpretation
  
  // 动爻和变卦
  if (changingLines.length > 0 && transformed) {
    interpretation += `【之卦】${transformed.chineseName}卦 (${transformed.name})\n\n`
    interpretation += `事态发展的趋势指向${transformed.chineseName}卦。\n`
    interpretation += `${transformed.interpretation.general}\n\n`
  }
  
  // 节气影响
  interpretation += `【时令影响】\n`
  interpretation += `当前${seasonal.season}，${seasonal.hexagramQi}。\n`
  interpretation += `${seasonal.influence}\n`
  interpretation += `${seasonal.recommendation}\n\n`
  
  // 各方面指引
  interpretation += `【各方面指引】\n`
  interpretation += `事业：${primary.interpretation.career}\n\n`
  interpretation += `感情：${primary.interpretation.relationship}\n\n`
  
  // 总体建议
  interpretation += `【总体建议】\n`
  interpretation += `${primary.interpretation.advice}\n`
  
  return interpretation
}

/**
 * 生成建议
 */
function generateEnhancedAdvice(
  primary: Hexagram,
  transformed: Hexagram | undefined,
  related: RelatedHexagrams,
  seasonal: SeasonalInfluence,
  questionAnalysis: QuestionAnalysis | undefined
): string[] {
  const advice: string[] = []
  
  // 基于本卦的建议
  advice.push(primary.interpretation.advice)
  
  // 基于节气的建议
  advice.push(seasonal.recommendation)
  
  // 基于五行的建议
  const upperTrigram = trigrams[primary.trigrams.upper as keyof typeof trigrams]
  const lowerTrigram = trigrams[primary.trigrams.lower as keyof typeof trigrams]
  advice.push(`上卦${upperTrigram.element}性${upperTrigram.nature}，方位在${upperTrigram.direction}`)
  advice.push(`下卦${lowerTrigram.element}性${lowerTrigram.nature}，方位在${lowerTrigram.direction}`)
  
  // 基于互卦的建议
  if (related.mutual) {
    advice.push(`内在趋势为${related.mutual.chineseName}，需要关注内在修养`)
  }
  
  // 基于变卦的建议
  if (transformed) {
    advice.push(`事态将向${transformed.chineseName}卦发展，需要提前做好准备`)
  }
  
  // 基于问题类别的建议
  if (questionAnalysis) {
    if (questionAnalysis.category === 'career') {
      advice.push('事业发展要顺应天时，把握时机')
    } else if (questionAnalysis.category === 'wealth') {
      advice.push('财运需要积累，不可急功近利')
    } else if (questionAnalysis.category === 'love') {
      advice.push('感情需要真诚，顺其自然')
    }
  }
  
  // 通用建议
  advice.push('周易的智慧在于顺应天时，把握变化的规律')
  advice.push('保持中正之道，不偏不倚，方能趋吉避凶')
  advice.push('刚柔并济，动静结合，是为上策')
  
  return advice
}

/**
 * 生成增强版周易占卜
 */
export function generateEnhancedIChingReading(input: EnhancedIChingInput): EnhancedIChingReading {
  // 1. 起卦
  let hexagramId: number
  let changingLines: number[]
  
  if (input.method === 'time') {
    const timestamp = input.timestamp || new Date()
    const result = castByTime(timestamp)
    hexagramId = result.hexagramId
    changingLines = result.changingLines
  } else {
    if (!input.numbers || input.numbers.length < 3) {
      throw new Error('数字起卦需要至少3个数字')
    }
    const result = castByNumbers(input.numbers)
    hexagramId = result.hexagramId
    changingLines = result.changingLines
  }
  
  // 2. 获取卦象
  const primaryHexagram = hexagrams[hexagramId]
  const transformedHexagram = getTransformedHexagram(hexagramId, changingLines)
  
  // 3. 分析问题
  const questionAnalysis = input.question ? analyzeQuestion(input.question) : undefined
  
  // 4. 分析相关卦象
  const relatedHexagrams = analyzeRelatedHexagrams(primaryHexagram)
  
  // 5. 分析爻位
  const lineAnalysis = analyzeLines(primaryHexagram, changingLines)
  
  // 6. 分析节气影响
  const timestamp = input.timestamp || new Date()
  const seasonalInfluence = analyzeSeasonalInfluence(timestamp)
  
  // 7. 分析五行生克
  const wuxingAnalysis = analyzeWuxing(primaryHexagram)
  
  // 8. 生成详细解读
  const detailedInterpretation = generateDetailedInterpretation(
    primaryHexagram,
    changingLines,
    transformedHexagram,
    relatedHexagrams,
    lineAnalysis,
    seasonalInfluence,
    wuxingAnalysis,
    questionAnalysis,
    input.question
  )
  
  // 9. 生成建议
  const advice = generateEnhancedAdvice(
    primaryHexagram,
    transformedHexagram,
    relatedHexagrams,
    seasonalInfluence,
    questionAnalysis
  )
  
  // 10. 生成简要解读（兼容原版）
  const interpretation = `${primaryHexagram.chineseName}卦：${primaryHexagram.interpretation.general}`
  
  return {
    primaryHexagram,
    changingLines,
    transformedHexagram,
    questionAnalysis,
    relatedHexagrams,
    lineAnalysis,
    seasonalInfluence,
    wuxingAnalysis,
    interpretation,
    advice,
    detailedInterpretation
  }
}

export type {
  RelatedHexagrams,
  LineAnalysis,
  SeasonalInfluence,
  WuxingAnalysis
}
