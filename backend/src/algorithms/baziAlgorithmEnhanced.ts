/**
 * 增强版八字算法
 * 加入十神分析、神煞系统、用神分析等传统命理理论
 */

import { elementRelations, elementCharacteristics } from '../data/baziData'
import { calculateBaziChart, BaziChart, BaziInput } from './baziAlgorithm'
import { analyzeQuestion, generateContextualOpening, QuestionAnalysis } from './questionAnalyzer'

interface EnhancedBaziReading {
  chart: BaziChart
  questionAnalysis?: QuestionAnalysis
  tenGods: TenGodsAnalysis
  spirits: SpiritsAnalysis
  useGod: UseGodAnalysis
  dayun: DayunAnalysis
  liunian: LiunianAnalysis
  elements: {
    distribution: Record<string, number>
    dominant: string
    lacking: string[]
    balance: string
  }
  personality: string
  fortune: {
    career: string
    wealth: string
    health: string
    relationships: string
  }
  advice: string[]
  detailedInterpretation: string
}

interface TenGodsAnalysis {
  dayMaster: string
  gods: {
    name: string
    element: string
    meaning: string
    influence: string
  }[]
  dominant: string
  interpretation: string
}

interface SpiritsAnalysis {
  auspicious: string[]
  inauspicious: string[]
  interpretation: string
}

interface UseGodAnalysis {
  useGod: string
  avoidGod: string
  recommendation: string
}

interface DayunAnalysis {
  current: {
    gan: string
    zhi: string
    age: string
  }
  influence: string
  favorable: boolean
  tenGod: string
  interpretation: string
}

interface LiunianAnalysis {
  current: {
    gan: string
    zhi: string
    year: number
  }
  influence: string
  tenGod: string
  keyEvents: string[]
  interpretation: string
}

/**
 * 十神含义说明
 * 比肩：同性同五行
 * 劫财：异性同五行
 * 食神：同性生
 * 伤官：异性生
 * 偏财：同性克
 * 正财：异性克
 * 七杀：同性克我
 * 正官：异性克我
 * 偏印：同性生我
 * 正印：异性生我
 */

/**
 * 生成增强版八字解读
 */
export function generateEnhancedBaziReading(
  input: BaziInput,
  question?: string
): EnhancedBaziReading {
  // 1. 计算八字命盘
  const chart = calculateBaziChart(input)
  
  // 2. 分析问题
  const questionAnalysis = question ? analyzeQuestion(question) : undefined
  
  // 3. 十神分析
  const tenGods = analyzeTenGods(chart)
  
  // 4. 神煞分析
  const spirits = analyzeSpirits(chart)
  
  // 5. 用神分析
  const useGod = analyzeUseGod(chart)
  
  // 6. 大运分析
  const dayun = analyzeDayun(chart, input.birthDate, input.gender || 'male')
  
  // 7. 流年分析
  const liunian = analyzeLiunian(chart)
  
  // 8. 五行分析
  const elements = analyzeElementsEnhanced(chart)
  
  // 9. 性格分析
  const personality = generateEnhancedPersonality(chart, elements, tenGods)
  
  // 10. 运势分析
  const fortune = generateEnhancedFortune(chart, questionAnalysis, tenGods, useGod, dayun, liunian)
  
  // 11. 建议
  const advice = generateEnhancedAdvice(chart, questionAnalysis, tenGods, useGod, elements, dayun, liunian)
  
  // 12. 详细解读
  const detailedInterpretation = generateDetailedBaziInterpretation(
    chart,
    questionAnalysis,
    tenGods,
    spirits,
    useGod,
    dayun,
    liunian,
    elements,
    question
  )
  
  return {
    chart,
    questionAnalysis,
    tenGods,
    spirits,
    useGod,
    dayun,
    liunian,
    elements,
    personality,
    fortune,
    advice,
    detailedInterpretation
  }
}

/**
 * 十神分析
 */
function analyzeTenGods(chart: BaziChart): TenGodsAnalysis {
  const dayMaster = chart.day.stem
  const dayMasterElement = dayMaster.element
  const dayMasterYinYang = dayMaster.yinYang
  
  const gods: TenGodsAnalysis['gods'] = []
  
  // 分析年、月、时的天干十神
  const pillars = [
    { name: '年干', stem: chart.year.stem },
    { name: '月干', stem: chart.month.stem },
    { name: '时干', stem: chart.hour.stem }
  ]
  
  pillars.forEach(pillar => {
    const god = calculateTenGod(dayMaster, pillar.stem)
    const meaning = getTenGodMeaning(god)
    const influence = getTenGodInfluence(god, pillar.name)
    
    gods.push({
      name: `${pillar.name}${god}`,
      element: pillar.stem.element,
      meaning,
      influence
    })
  })
  
  // 确定主导十神
  const godCounts: Record<string, number> = {}
  gods.forEach(g => {
    const godName = g.name.slice(2) // 去掉"年干"等前缀
    godCounts[godName] = (godCounts[godName] || 0) + 1
  })
  
  let dominant = '比肩'
  let maxCount = 0
  Object.entries(godCounts).forEach(([god, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominant = god
    }
  })
  
  // 生成十神解读
  const interpretation = `日主${dayMaster.name}${dayMasterElement}，${dayMasterYinYang}性。`
    + `命局中${dominant}较为突出，${getTenGodMeaning(dominant)}`
  
  return {
    dayMaster: `${dayMaster.name}${dayMasterElement}`,
    gods,
    dominant,
    interpretation
  }
}

/**
 * 计算十神
 */
function calculateTenGod(dayMaster: any, otherStem: any): string {
  if (dayMaster.name === otherStem.name) return '比肩'
  
  const sameYinYang = dayMaster.yinYang === otherStem.yinYang
  
  // 同五行
  if (dayMaster.element === otherStem.element) {
    return sameYinYang ? '比肩' : '劫财'
  }
  
  // 我生（食伤）
  if (elementRelations.generates[dayMaster.element as keyof typeof elementRelations.generates] === otherStem.element) {
    return sameYinYang ? '食神' : '伤官'
  }
  
  // 我克（财）
  if (elementRelations.controls[dayMaster.element as keyof typeof elementRelations.controls] === otherStem.element) {
    return sameYinYang ? '偏财' : '正财'
  }
  
  // 克我（官杀）
  if (elementRelations.controls[otherStem.element as keyof typeof elementRelations.controls] === dayMaster.element) {
    return sameYinYang ? '七杀' : '正官'
  }
  
  // 生我（印）
  if (elementRelations.generates[otherStem.element as keyof typeof elementRelations.generates] === dayMaster.element) {
    return sameYinYang ? '偏印' : '正印'
  }
  
  return '比肩'
}

/**
 * 获取十神含义
 */
function getTenGodMeaning(god: string): string {
  const meanings: Record<string, string> = {
    '比肩': '代表自我、竞争、独立。性格坚强，有主见，但可能固执。',
    '劫财': '代表合作、分享、竞争。善于交际，但需注意财务管理。',
    '食神': '代表才华、表达、享受。有艺术天赋，生活乐观。',
    '伤官': '代表创新、批判、表现。聪明才智，但需注意言行。',
    '偏财': '代表机遇、流动财富。善于把握机会，财运较好。',
    '正财': '代表稳定收入、勤劳。踏实工作，财富稳定增长。',
    '七杀': '代表压力、挑战、权威。有魄力，能克服困难。',
    '正官': '代表责任、地位、规范。有责任心，适合管理工作。',
    '偏印': '代表学习、思考、孤独。有学习能力，思维独特。',
    '正印': '代表智慧、保护、传承。有智慧，得长辈帮助。'
  }
  return meanings[god] || '影响命运发展。'
}

/**
 * 获取十神影响
 */
function getTenGodInfluence(_god: string, position: string): string {
  if (position.includes('年')) {
    return `在年柱出现，影响早年运势和祖辈关系。`
  } else if (position.includes('月')) {
    return `在月柱出现，影响青年运势和父母兄弟关系。`
  } else if (position.includes('时')) {
    return `在时柱出现，影响晚年运势和子女关系。`
  }
  return `影响整体运势。`
}

/**
 * 神煞分析
 */
function analyzeSpirits(chart: BaziChart): SpiritsAnalysis {
  const auspicious: string[] = []
  const inauspicious: string[] = []
  
  // 天乙贵人（简化判断）
  const dayBranch = chart.day.branch.name
  if (['丑', '未', '子', '申'].includes(dayBranch)) {
    auspicious.push('天乙贵人')
  }
  
  // 文昌星（简化判断）
  const dayStem = chart.day.stem.name
  if (['甲', '乙', '丙', '丁'].includes(dayStem)) {
    auspicious.push('文昌星')
  }
  
  // 桃花（子午卯酉）
  const branches = [chart.year.branch.name, chart.month.branch.name, chart.day.branch.name, chart.hour.branch.name]
  if (branches.some(b => ['子', '午', '卯', '酉'].includes(b))) {
    auspicious.push('桃花')
  }
  
  // 华盖（辰戌丑未）
  if (branches.some(b => ['辰', '戌', '丑', '未'].includes(b))) {
    auspicious.push('华盖')
  }
  
  const interpretation = auspicious.length > 0
    ? `命局中有${auspicious.join('、')}等吉神，为命主带来助力。`
    : `命局平和，需要自身努力开创运势。`
  
  return {
    auspicious,
    inauspicious,
    interpretation
  }
}

/**
 * 大运分析
 * 大运是八字命理中的重要概念，每10年一个大运周期
 */
function analyzeDayun(chart: BaziChart, birthDate: Date, gender: 'male' | 'female'): DayunAnalysis {
  const currentYear = new Date().getFullYear()
  const birthYear = birthDate.getFullYear()
  const currentAge = currentYear - birthYear
  
  // 计算大运周期（每10年一个大运）
  const dayunPeriod = Math.floor(currentAge / 10)
  const ageInPeriod = currentAge % 10
  
  // 获取月柱天干地支的索引
  const monthStem = chart.month.stem.name
  const monthBranch = chart.month.branch.name
  
  // 天干地支列表
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  const monthStemIndex = stems.indexOf(monthStem)
  const monthBranchIndex = branches.indexOf(monthBranch)
  
  // 判断大运顺逆
  // 阳男阴女顺行，阴男阳女逆行
  const yearStem = chart.year.stem.name
  const yearStemIndex = stems.indexOf(yearStem)
  const isYangYear = yearStemIndex % 2 === 0
  const forward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear)
  
  // 计算当前大运的天干地支
  let currentStemIndex: number
  let currentBranchIndex: number
  
  if (forward) {
    currentStemIndex = (monthStemIndex + dayunPeriod) % 10
    currentBranchIndex = (monthBranchIndex + dayunPeriod) % 12
  } else {
    currentStemIndex = (monthStemIndex - dayunPeriod + 10) % 10
    currentBranchIndex = (monthBranchIndex - dayunPeriod + 12) % 12
  }
  
  const currentGan = stems[currentStemIndex]
  const currentZhi = branches[currentBranchIndex]
  const ageRange = `${dayunPeriod * 10}-${(dayunPeriod + 1) * 10 - 1}岁`
  
  // 计算大运十神
  const dayMaster = chart.day.stem
  const dayunStem = {
    name: currentGan,
    element: getElementFromStem(currentGan),
    yinYang: currentStemIndex % 2 === 0 ? '阳' : '阴'
  }
  const tenGod = calculateTenGod(dayMaster, dayunStem)
  
  // 判断大运吉凶
  const dayunElement = getElementFromStem(currentGan)
  
  // 简化判断：根据用神来判断大运吉凶
  const distribution: Record<string, number> = {
    '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
  }
  
  const pillars = [chart.year, chart.month, chart.day, chart.hour]
  pillars.forEach((pillar: any) => {
    distribution[pillar.stem.element]++
    distribution[pillar.branch.element]++
  })
  
  let maxElement = '木'
  let maxCount = 0
  Object.entries(distribution).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxElement = element
    }
  })
  
  const useGodElement = elementRelations.controls[maxElement as keyof typeof elementRelations.controls]
  const favorable = dayunElement === useGodElement || 
                    elementRelations.generates[dayunElement as keyof typeof elementRelations.generates] === useGodElement
  
  // 生成大运影响描述
  let influence = `当前大运${currentGan}${currentZhi}（${ageRange}），`
  
  if (favorable) {
    influence += `大运有利，${tenGod}当值。这是发展事业、提升地位的好时机。`
    influence += `大运天干${currentGan}${dayunElement}，与命局相生相助，`
    influence += `适合在这个阶段积极进取，开拓新的领域。`
  } else {
    influence += `大运需谨慎，${tenGod}当值。宜守不宜攻，稳中求进。`
    influence += `大运天干${currentGan}${dayunElement}，需要注意调整策略，`
    influence += `保持稳定，积累实力，等待更好的时机。`
  }
  
  // 生成详细解读
  let interpretation = `【大运详解】\n`
  interpretation += `您目前正处于${currentGan}${currentZhi}大运（${ageRange}），已行运${ageInPeriod}年。\n`
  interpretation += `大运${tenGod}，${getTenGodMeaning(tenGod)}\n`
  
  if (favorable) {
    interpretation += `此大运对您有利，是人生的上升期。建议：\n`
    interpretation += `1. 把握机遇，积极进取\n`
    interpretation += `2. 扩展人脉，寻求合作\n`
    interpretation += `3. 投资发展，提升自我\n`
  } else {
    interpretation += `此大运需要谨慎应对，是人生的调整期。建议：\n`
    interpretation += `1. 稳扎稳打，避免冒进\n`
    interpretation += `2. 修炼内功，提升能力\n`
    interpretation += `3. 保守理财，积累资源\n`
  }
  
  return {
    current: {
      gan: currentGan,
      zhi: currentZhi,
      age: ageRange
    },
    influence,
    favorable,
    tenGod,
    interpretation
  }
}

/**
 * 流年分析
 * 流年是指当前年份对命运的影响
 */
function analyzeLiunian(chart: BaziChart): LiunianAnalysis {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  
  // 天干地支列表
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  // 计算流年干支（以甲子年为基准：1984年）
  const baseYear = 1984
  const yearOffset = currentYear - baseYear
  const liunianStemIndex = (yearOffset % 10 + 10) % 10
  const liunianBranchIndex = (yearOffset % 12 + 12) % 12
  
  const currentGan = stems[liunianStemIndex]
  const currentZhi = branches[liunianBranchIndex]
  
  // 计算流年十神
  const dayMaster = chart.day.stem
  const liunianStem = {
    name: currentGan,
    element: getElementFromStem(currentGan),
    yinYang: liunianStemIndex % 2 === 0 ? '阳' : '阴'
  }
  const tenGod = calculateTenGod(dayMaster, liunianStem)
  
  // 根据十神分析流年影响
  let influence = `${currentYear}年流年${currentGan}${currentZhi}，${tenGod}当值。`
  let keyEvents: string[] = []
  
  switch (tenGod) {
    case '正官':
      influence += `正官主贵，利于升职加薪，但需注意工作压力。`
      keyEvents = ['职位提升机会', '权威认可', '责任加重', '考试运佳']
      break
    case '七杀':
      influence += `七杀主权，有挑战和压力，但也是突破的机会。`
      keyEvents = ['面临挑战', '竞争激烈', '需要魄力', '克服困难']
      break
    case '正财':
      influence += `正财主富，财运稳定，适合稳健投资。`
      keyEvents = ['收入稳定', '投资机会', '理财得当', '财富增长']
      break
    case '偏财':
      influence += `偏财当值，有意外之财，投资运佳。`
      keyEvents = ['意外收入', '投资机会', '商业合作', '财运亨通']
      break
    case '正印':
      influence += `正印当值，利于学习进修，贵人相助。`
      keyEvents = ['学习机会', '贵人相助', '名声提升', '智慧增长']
      break
    case '偏印':
      influence += `偏印当值，思维活跃，适合研究创新。`
      keyEvents = ['创新思维', '独特见解', '学习新知', '技能提升']
      break
    case '食神':
      influence += `食神当值，心情愉悦，适合享受生活。`
      keyEvents = ['生活愉快', '艺术创作', '美食享受', '身心舒畅']
      break
    case '伤官':
      influence += `伤官当值，才华展现，但需注意言行。`
      keyEvents = ['才华展现', '创意爆发', '表达欲强', '注意言行']
      break
    case '比肩':
      influence += `比肩当值，竞争增加，需要独立自主。`
      keyEvents = ['竞争加剧', '独立发展', '自我提升', '朋友助力']
      break
    case '劫财':
      influence += `劫财当值，合作机会多，但需注意财务。`
      keyEvents = ['合作机会', '团队协作', '注意财务', '分享资源']
      break
    default:
      influence += `需要根据具体情况调整策略。`
      keyEvents = ['保持稳定', '谨慎决策', '积累经验', '顺势而为']
  }
  
  // 生成详细解读
  let interpretation = `【流年详解】\n`
  interpretation += `${currentYear}年为${currentGan}${currentZhi}年，流年${tenGod}。\n`
  interpretation += `${getTenGodMeaning(tenGod)}\n\n`
  interpretation += `【流年重点】\n`
  keyEvents.forEach((event, index) => {
    interpretation += `${index + 1}. ${event}\n`
  })
  interpretation += `\n【流年建议】\n`
  interpretation += `根据流年${tenGod}的特点，建议您在今年：\n`
  
  if (['正官', '七杀'].includes(tenGod)) {
    interpretation += `- 把握事业机会，勇于承担责任\n`
    interpretation += `- 注意身体健康，避免过度劳累\n`
    interpretation += `- 处理好上下级关系，获得认可\n`
  } else if (['正财', '偏财'].includes(tenGod)) {
    interpretation += `- 理性投资理财，把握财运机会\n`
    interpretation += `- 开源节流，积累财富\n`
    interpretation += `- 注意合同细节，避免财务纠纷\n`
  } else if (['正印', '偏印'].includes(tenGod)) {
    interpretation += `- 多学习充电，提升专业能力\n`
    interpretation += `- 寻求贵人帮助，虚心请教\n`
    interpretation += `- 注重精神修养，提升智慧\n`
  } else if (['食神', '伤官'].includes(tenGod)) {
    interpretation += `- 发挥创意才华，展现个人特色\n`
    interpretation += `- 注意言行举止，避免口舌是非\n`
    interpretation += `- 享受生活乐趣，保持身心愉悦\n`
  } else {
    interpretation += `- 加强自我修炼，提升竞争力\n`
    interpretation += `- 注意团队合作，互利共赢\n`
    interpretation += `- 保持稳定心态，顺势而为\n`
  }
  
  return {
    current: {
      gan: currentGan,
      zhi: currentZhi,
      year: currentYear
    },
    influence,
    tenGod,
    keyEvents,
    interpretation
  }
}

/**
 * 辅助函数：根据天干获取五行
 */
function getElementFromStem(stem: string): string {
  const stemElements: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  }
  return stemElements[stem] || '木'
}

/**
 * 用神分析
 */
function analyzeUseGod(chart: BaziChart): UseGodAnalysis {
  const distribution: Record<string, number> = {
    '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
  }
  
  const pillars = [chart.year, chart.month, chart.day, chart.hour]
  pillars.forEach((pillar: any) => {
    distribution[pillar.stem.element]++
    distribution[pillar.branch.element]++
  })
  
  // 找出最旺的五行
  let maxElement = '木'
  let maxCount = 0
  
  Object.entries(distribution).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxElement = element
    }
  })
  
  // 简化的用神选择：克制最旺的五行
  const useGod = elementRelations.controls[maxElement as keyof typeof elementRelations.controls]
  const avoidGod = maxElement
  
  const recommendation = `命局${maxElement}过旺，宜用${useGod}来平衡。`
    + `建议多接触${useGod}相关的事物，如颜色、方位、职业等。`
    + `避免过多接触${avoidGod}，以免加重失衡。`
  
  return {
    useGod,
    avoidGod,
    recommendation
  }
}

/**
 * 增强版五行分析
 */
function analyzeElementsEnhanced(chart: BaziChart) {
  const distribution: Record<string, number> = {
    '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
  }
  
  const pillars = [chart.year, chart.month, chart.day, chart.hour]
  pillars.forEach((pillar: any) => {
    distribution[pillar.stem.element]++
    distribution[pillar.branch.element]++
  })
  
  let maxCount = 0
  let dominant = '木'
  const lacking: string[] = []
  
  Object.entries(distribution).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominant = element
    }
    if (count === 0) {
      lacking.push(element)
    }
  })
  
  // 判断平衡状态
  const counts = Object.values(distribution)
  const avg = counts.reduce((a, b) => a + b, 0) / 5
  const variance = counts.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / 5
  
  let balance = ''
  if (variance < 1) {
    balance = '五行分布均衡，命局平和稳定。'
  } else if (variance < 2) {
    balance = '五行分布较为均衡，略有偏重。'
  } else {
    balance = '五行分布不均，有明显的强弱之分。'
  }
  
  return { distribution, dominant, lacking, balance }
}

/**
 * 生成增强版性格分析
 */
function generateEnhancedPersonality(
  _chart: BaziChart,
  elements: any,
  tenGods: TenGodsAnalysis
): string {
  let personality = `【日主分析】\n`
  personality += `${tenGods.interpretation}\n\n`
  
  personality += `【五行特质】\n`
  personality += `命局${elements.dominant}最旺，`
  personality += elementCharacteristics[elements.dominant as keyof typeof elementCharacteristics].description
  personality += `\n\n`
  
  personality += `【十神性格】\n`
  personality += `${tenGods.dominant}为主导十神，${getTenGodMeaning(tenGods.dominant)}`
  
  if (elements.lacking.length > 0) {
    personality += `\n\n【五行调和】\n`
    personality += `命局缺${elements.lacking.join('、')}，建议通过后天调理来平衡五行。`
  }
  
  return personality
}

/**
 * 生成增强版运势
 */
function generateEnhancedFortune(
  chart: BaziChart,
  analysis: QuestionAnalysis | undefined,
  tenGods: TenGodsAnalysis,
  useGod: UseGodAnalysis,
  dayun: DayunAnalysis,
  liunian: LiunianAnalysis
): EnhancedBaziReading['fortune'] {
  const dominant = tenGods.dominant
  
  let career = ''
  if (analysis?.category === 'career') {
    career = `关于您的事业问题，${dominant}主导的命局`
    if (['正官', '七杀', '正印'].includes(dominant)) {
      career += `适合从事管理、公职或专业技术工作。您有责任心和领导能力，能够承担重要职责。`
    } else if (['食神', '伤官'].includes(dominant)) {
      career += `适合从事创意、艺术或自由职业。您有才华和创新能力，适合发挥个人特长。`
    } else {
      career += `适合从事商业、贸易或合作性工作。您善于把握机会，能够创造财富。`
    }
    // 加入大运流年影响
    career += `\n\n【时运分析】\n`
    career += `${dayun.influence}\n`
    career += `${liunian.influence}\n`
    if (dayun.favorable && ['正官', '七杀', '正财', '偏财'].includes(liunian.tenGod)) {
      career += `当前大运和流年都对事业发展有利，是升职加薪的好时机！`
    }
  } else {
    career = `事业方面，${dominant}的特质让您在工作中有独特优势。${useGod.recommendation.split('。')[0]}。`
    career += `\n当前${dayun.favorable ? '大运有利' : '大运需谨慎'}，${liunian.tenGod}流年，${liunian.influence.split('。')[1] || ''}`
  }
  
  let wealth = ''
  if (analysis?.category === 'wealth') {
    wealth = `关于您的财运问题，`
    if (['正财', '偏财'].includes(dominant)) {
      wealth += `命局财星得力，财运基础良好。正财主稳定收入，偏财主意外之财。建议把握机会，稳健投资。`
    } else {
      wealth += `需要通过发挥自身优势来创造财富。${useGod.useGod}为用神，从事相关行业会有利于财运。`
    }
    // 加入流年财运分析
    wealth += `\n\n【流年财运】\n`
    if (['正财', '偏财'].includes(liunian.tenGod)) {
      wealth += `今年流年${liunian.tenGod}，财运亨通，是投资理财的好时机。`
    } else {
      wealth += `今年流年${liunian.tenGod}，财运平稳，建议稳健理财，避免冒险投资。`
    }
  } else {
    wealth = `财运方面，建议顺应命局特点，通过正当途径积累财富。`
    if (['正财', '偏财'].includes(liunian.tenGod)) {
      wealth += `今年流年${liunian.tenGod}，财运较好，可适当投资。`
    }
  }
  
  let health = `健康方面，注意${chart.day.stem.element}对应的器官保养。保持五行平衡，规律作息，适度运动。`
  if (!dayun.favorable) {
    health += `当前大运需要特别注意身体健康，避免过度劳累。`
  }
  
  let relationships = `感情方面，生肖${chart.year.branch.zodiac}的您，`
  if (['正官', '正财', '正印'].includes(dominant)) {
    relationships += `重视感情的稳定和长久。建议真诚相待，用心经营感情。`
  } else {
    relationships += `感情丰富多彩。建议保持理性，珍惜缘分。`
  }
  // 加入桃花运分析
  if (liunian.current.zhi === '子' || liunian.current.zhi === '午' || 
      liunian.current.zhi === '卯' || liunian.current.zhi === '酉') {
    relationships += `\n今年流年桃花，异性缘旺，单身者有望遇到良缘。`
  }
  
  return { career, wealth, health, relationships }
}

/**
 * 生成增强版建议
 */
function generateEnhancedAdvice(
  _chart: BaziChart,
  analysis: QuestionAnalysis | undefined,
  tenGods: TenGodsAnalysis,
  useGod: UseGodAnalysis,
  elements: any,
  dayun: DayunAnalysis,
  liunian: LiunianAnalysis
): string[] {
  const advice: string[] = []
  
  // 大运建议
  if (dayun.favorable) {
    advice.push(`当前大运有利（${dayun.current.age}），把握机遇，积极进取`)
  } else {
    advice.push(`当前大运需谨慎（${dayun.current.age}），稳扎稳打，修炼内功`)
  }
  
  // 流年建议
  advice.push(`今年流年${liunian.tenGod}，${liunian.keyEvents[0]}`)
  
  // 用神建议
  advice.push(`用神为${useGod.useGod}，建议多接触相关元素以增强运势`)
  
  // 十神建议
  advice.push(`发挥${tenGods.dominant}的优势，${getTenGodMeaning(tenGods.dominant).split('。')[0]}`)
  
  // 五行建议
  if (elements.lacking.length > 0) {
    advice.push(`补充${elements.lacking[0]}元素，可通过颜色、方位、饮食等方式调理`)
  }
  
  // 问题针对性建议
  if (analysis) {
    if (analysis.category === 'career') {
      advice.push('事业发展要顺应命局特点，选择适合的行业和方向')
    } else if (analysis.category === 'wealth') {
      advice.push('财富积累需要时间，保持耐心和理性投资')
    }
  }
  
  // 通用建议
  advice.push('保持五行平衡，顺应自然规律')
  advice.push('修身养性，提升自我，命运掌握在自己手中')
  
  return advice
}

/**
 * 生成详细解读
 */
function generateDetailedBaziInterpretation(
  chart: BaziChart,
  analysis: QuestionAnalysis | undefined,
  tenGods: TenGodsAnalysis,
  spirits: SpiritsAnalysis,
  useGod: UseGodAnalysis,
  dayun: DayunAnalysis,
  liunian: LiunianAnalysis,
  elements: any,
  question?: string
): string {
  let interpretation = ''
  
  if (question && analysis) {
    interpretation += generateContextualOpening(analysis, question)
  } else {
    interpretation += `为您进行八字命理分析。\n\n`
  }
  
  interpretation += `【八字命盘】\n`
  interpretation += `年柱：${chart.year.name}（${chart.year.stem.name}${chart.year.stem.element} ${chart.year.branch.name}${chart.year.branch.element}）\n`
  interpretation += `月柱：${chart.month.name}（${chart.month.stem.name}${chart.month.stem.element} ${chart.month.branch.name}${chart.month.branch.element}）\n`
  interpretation += `日柱：${chart.day.name}（${chart.day.stem.name}${chart.day.stem.element} ${chart.day.branch.name}${chart.day.branch.element}）\n`
  interpretation += `时柱：${chart.hour.name}（${chart.hour.stem.name}${chart.hour.stem.element} ${chart.hour.branch.name}${chart.hour.branch.element}）\n\n`
  
  interpretation += `【十神分析】\n`
  interpretation += `${tenGods.interpretation}\n`
  tenGods.gods.forEach(god => {
    interpretation += `${god.name}：${god.meaning}\n`
  })
  interpretation += `\n`
  
  interpretation += `【神煞吉凶】\n`
  interpretation += `${spirits.interpretation}\n`
  if (spirits.auspicious.length > 0) {
    interpretation += `吉神：${spirits.auspicious.join('、')}\n`
  }
  interpretation += `\n`
  
  interpretation += `【用神喜忌】\n`
  interpretation += `${useGod.recommendation}\n\n`
  
  interpretation += `【大运分析】\n`
  interpretation += `${dayun.interpretation}\n`
  
  interpretation += `【流年分析】\n`
  interpretation += `${liunian.interpretation}\n`
  
  interpretation += `【五行分布】\n`
  Object.entries(elements.distribution).forEach(([element, count]) => {
    interpretation += `${element}：${count}个 `
  })
  interpretation += `\n${elements.balance}\n\n`
  
  return interpretation
}

export { EnhancedBaziReading, TenGodsAnalysis, SpiritsAnalysis, UseGodAnalysis, DayunAnalysis, LiunianAnalysis }
