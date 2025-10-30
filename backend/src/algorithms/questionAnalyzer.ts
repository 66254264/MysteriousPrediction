/**
 * 问题分析模块
 * 分析用户问题的类型、关键词和情感倾向，为预测提供更精准的上下文
 */

export interface QuestionAnalysis {
  category: QuestionCategory
  keywords: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  timeframe: 'past' | 'present' | 'future' | 'general'
  aspects: string[]
  urgency: 'low' | 'medium' | 'high'
}

export type QuestionCategory =
  | 'love' // 爱情感情
  | 'career' // 事业工作
  | 'wealth' // 财运金钱
  | 'health' // 健康
  | 'study' // 学业
  | 'family' // 家庭
  | 'decision' // 决策选择
  | 'general' // 综合运势

// 关键词库
const categoryKeywords: Record<QuestionCategory, string[]> = {
  love: ['爱情', '感情', '恋爱', '婚姻', '伴侣', '对象', '喜欢', '爱', '分手', '复合', '表白', '约会', '结婚', '离婚', '暗恋', '单身', '桃花'],
  career: ['工作', '事业', '职业', '升职', '跳槽', '面试', '老板', '同事', '公司', '项目', '业绩', '晋升', '辞职', '创业', '合作'],
  wealth: ['财运', '金钱', '财富', '投资', '理财', '赚钱', '收入', '工资', '奖金', '股票', '基金', '生意', '买卖', '借钱', '还钱'],
  health: ['健康', '身体', '疾病', '生病', '医院', '治疗', '养生', '锻炼', '减肥', '体检', '手术', '康复', '精神', '心理'],
  study: ['学习', '考试', '学业', '成绩', '升学', '毕业', '论文', '考研', '留学', '培训', '证书', '技能'],
  family: ['家庭', '父母', '孩子', '亲人', '家人', '兄弟', '姐妹', '长辈', '晚辈', '亲戚', '家事', '搬家'],
  decision: ['选择', '决定', '该不该', '要不要', '是否', '怎么办', '如何', '方向', '道路', '机会', '风险'],
  general: ['运势', '未来', '命运', '前途', '发展', '变化', '趋势', '吉凶', '好坏']
}

// 时间关键词
const timeKeywords = {
  past: ['过去', '以前', '曾经', '之前', '原来', '当初'],
  present: ['现在', '目前', '当前', '此刻', '眼下', '最近'],
  future: ['未来', '将来', '以后', '今后', '明天', '下个月', '明年', '会不会', '能不能'],
  general: ['一直', '总是', '经常', '通常', '整体']
}

// 紧急程度关键词
const urgencyKeywords = {
  high: ['紧急', '马上', '立刻', '急', '赶紧', '尽快', '现在就', '迫切'],
  medium: ['近期', '最近', '不久', '快要', '即将'],
  low: ['长远', '以后', '将来', '未来', '慢慢']
}

/**
 * 分析问题
 */
export function analyzeQuestion(question: string): QuestionAnalysis {
  const lowerQuestion = question.toLowerCase()
  
  // 1. 识别问题类别
  const category = identifyCategory(lowerQuestion)
  
  // 2. 提取关键词
  const keywords = extractKeywords(lowerQuestion, category)
  
  // 3. 分析情感倾向
  const sentiment = analyzeSentiment(lowerQuestion)
  
  // 4. 识别时间框架
  const timeframe = identifyTimeframe(lowerQuestion)
  
  // 5. 识别涉及方面
  const aspects = identifyAspects(lowerQuestion)
  
  // 6. 评估紧急程度
  const urgency = assessUrgency(lowerQuestion)
  
  return {
    category,
    keywords,
    sentiment,
    timeframe,
    aspects,
    urgency
  }
}

/**
 * 识别问题类别
 */
function identifyCategory(question: string): QuestionCategory {
  const scores: Record<QuestionCategory, number> = {
    love: 0,
    career: 0,
    wealth: 0,
    health: 0,
    study: 0,
    family: 0,
    decision: 0,
    general: 0
  }
  
  // 计算每个类别的匹配分数
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (question.includes(keyword)) {
        scores[category as QuestionCategory] += 1
      }
    })
  })
  
  // 找出得分最高的类别
  let maxScore = 0
  let bestCategory: QuestionCategory = 'general'
  
  Object.entries(scores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestCategory = category as QuestionCategory
    }
  })
  
  return bestCategory
}

/**
 * 提取关键词
 */
function extractKeywords(question: string, category: QuestionCategory): string[] {
  const keywords: string[] = []
  const categoryWords = categoryKeywords[category]
  
  categoryWords.forEach(keyword => {
    if (question.includes(keyword)) {
      keywords.push(keyword)
    }
  })
  
  return keywords.slice(0, 5) // 最多返回5个关键词
}

/**
 * 分析情感倾向
 */
function analyzeSentiment(question: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['好', '顺利', '成功', '幸福', '开心', '快乐', '希望', '机会', '发展', '进步']
  const negativeWords = ['不好', '失败', '困难', '问题', '担心', '害怕', '焦虑', '痛苦', '分手', '失去', '危机']
  
  let positiveCount = 0
  let negativeCount = 0
  
  positiveWords.forEach(word => {
    if (question.includes(word)) positiveCount++
  })
  
  negativeWords.forEach(word => {
    if (question.includes(word)) negativeCount++
  })
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

/**
 * 识别时间框架
 */
function identifyTimeframe(question: string): 'past' | 'present' | 'future' | 'general' {
  const scores = {
    past: 0,
    present: 0,
    future: 0,
    general: 0
  }
  
  Object.entries(timeKeywords).forEach(([timeframe, keywords]) => {
    keywords.forEach(keyword => {
      if (question.includes(keyword)) {
        scores[timeframe as keyof typeof scores]++
      }
    })
  })
  
  let maxScore = 0
  let bestTimeframe: 'past' | 'present' | 'future' | 'general' = 'general'
  
  Object.entries(scores).forEach(([timeframe, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestTimeframe = timeframe as typeof bestTimeframe
    }
  })
  
  return bestTimeframe
}

/**
 * 识别涉及方面
 */
function identifyAspects(question: string): string[] {
  const aspects: string[] = []
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const hasMatch = keywords.some(keyword => question.includes(keyword))
    if (hasMatch && category !== 'general') {
      aspects.push(category)
    }
  })
  
  return aspects
}

/**
 * 评估紧急程度
 */
function assessUrgency(question: string): 'low' | 'medium' | 'high' {
  let urgencyScore = 0
  
  urgencyKeywords.high.forEach(keyword => {
    if (question.includes(keyword)) urgencyScore += 3
  })
  
  urgencyKeywords.medium.forEach(keyword => {
    if (question.includes(keyword)) urgencyScore += 2
  })
  
  urgencyKeywords.low.forEach(keyword => {
    if (question.includes(keyword)) urgencyScore += 1
  })
  
  if (urgencyScore >= 3) return 'high'
  if (urgencyScore >= 2) return 'medium'
  return 'low'
}

/**
 * 生成针对性的开场白
 */
export function generateContextualOpening(analysis: QuestionAnalysis, question: string): string {
  const categoryNames: Record<QuestionCategory, string> = {
    love: '感情',
    career: '事业',
    wealth: '财运',
    health: '健康',
    study: '学业',
    family: '家庭',
    decision: '抉择',
    general: '运势'
  }
  
  let opening = `关于您的${categoryNames[analysis.category]}问题："${question}"\n\n`
  
  if (analysis.urgency === 'high') {
    opening += '我感受到您的急切心情，让我们深入探索这个问题。\n\n'
  } else if (analysis.sentiment === 'negative') {
    opening += '我理解您当前的困扰，让我们一起寻找答案和方向。\n\n'
  } else if (analysis.sentiment === 'positive') {
    opening += '您的积极态度很好，让我们看看未来的发展趋势。\n\n'
  }
  
  return opening
}
