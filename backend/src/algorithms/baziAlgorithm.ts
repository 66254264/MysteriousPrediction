import { heavenlyStems, earthlyBranches, elementRelations, elementCharacteristics } from '../data/baziData';

export interface BaziInput {
  birthDate: Date;
  birthTime?: { hour: number; minute: number };
  name?: string;
  gender?: 'male' | 'female';
}

export interface Pillar {
  stem: typeof heavenlyStems[0];
  branch: typeof earthlyBranches[0];
  name: string;
}

export interface BaziChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface BaziReading {
  chart: BaziChart;
  elements: {
    distribution: Record<string, number>;
    dominant: string;
    lacking: string[];
  };
  personality: string;
  fortune: {
    career: string;
    wealth: string;
    health: string;
    relationships: string;
  };
  advice: string[];
}

/**
 * 计算年柱
 */
function calculateYearPillar(year: number): Pillar {
  // 1984年是甲子年（天干0，地支0）
  const baseYear = 1984;
  const yearDiff = year - baseYear;
  
  const stemIndex = (yearDiff % 10 + 10) % 10;
  const branchIndex = (yearDiff % 12 + 12) % 12;
  
  return {
    stem: heavenlyStems[stemIndex],
    branch: earthlyBranches[branchIndex],
    name: `${heavenlyStems[stemIndex].name}${earthlyBranches[branchIndex].name}`
  };
}

/**
 * 计算月柱
 */
function calculateMonthPillar(year: number, month: number): Pillar {
  // 简化算法：基于年干和月份
  const yearStemIndex = ((year - 1984) % 10 + 10) % 10;
  
  // 月柱天干计算（五虎遁）
  const monthStemBase = (yearStemIndex % 5) * 2;
  const stemIndex = (monthStemBase + month - 1) % 10;
  
  // 月柱地支（固定对应）
  // 寅月(1月)开始
  const branchIndex = (month + 1) % 12;
  
  return {
    stem: heavenlyStems[stemIndex],
    branch: earthlyBranches[branchIndex],
    name: `${heavenlyStems[stemIndex].name}${earthlyBranches[branchIndex].name}`
  };
}

/**
 * 计算日柱
 */
function calculateDayPillar(date: Date): Pillar {
  // 使用简化的日柱计算方法
  // 2000年1月1日是丙辰日
  const baseDate = new Date(2000, 0, 1);
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const stemIndex = (daysDiff % 10 + 10 + 2) % 10; // 2是丙的索引
  const branchIndex = (daysDiff % 12 + 12 + 4) % 12; // 4是辰的索引
  
  return {
    stem: heavenlyStems[stemIndex],
    branch: earthlyBranches[branchIndex],
    name: `${heavenlyStems[stemIndex].name}${earthlyBranches[branchIndex].name}`
  };
}

/**
 * 计算时柱
 */
function calculateHourPillar(dayStemIndex: number, hour: number): Pillar {
  // 时辰对应地支
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  
  // 时柱天干计算（五鼠遁）
  const hourStemBase = (dayStemIndex % 5) * 2;
  const stemIndex = (hourStemBase + hourBranchIndex) % 10;
  
  return {
    stem: heavenlyStems[stemIndex],
    branch: earthlyBranches[hourBranchIndex],
    name: `${heavenlyStems[stemIndex].name}${earthlyBranches[hourBranchIndex].name}`
  };
}

/**
 * 计算八字命盘
 */
export function calculateBaziChart(input: BaziInput): BaziChart {
  const { birthDate, birthTime } = input;
  
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const hour = birthTime?.hour ?? 12; // 默认中午12点
  
  const yearPillar = calculateYearPillar(year);
  const monthPillar = calculateMonthPillar(year, month);
  const dayPillar = calculateDayPillar(birthDate);
  const hourPillar = calculateHourPillar(dayPillar.stem.id, hour);
  
  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };
}

/**
 * 分析五行分布
 */
function analyzeElements(chart: BaziChart): BaziReading['elements'] {
  const distribution: Record<string, number> = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };
  
  // 统计天干地支的五行
  [chart.year, chart.month, chart.day, chart.hour].forEach(pillar => {
    distribution[pillar.stem.element]++;
    distribution[pillar.branch.element]++;
  });
  
  // 找出最强和缺失的五行
  let maxCount = 0;
  let dominant = '木';
  const lacking: string[] = [];
  
  Object.entries(distribution).forEach(([element, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominant = element;
    }
    if (count === 0) {
      lacking.push(element);
    }
  });
  
  return { distribution, dominant, lacking };
}

/**
 * 生成性格分析
 */
function generatePersonality(chart: BaziChart, elements: BaziReading['elements']): string {
  const dayStem = chart.day.stem;
  const dominant = elements.dominant;
  
  let personality = `您的日主是${dayStem.name}${dayStem.element}，`;
  personality += `${dayStem.yinYang === '阳' ? '阳性' : '阴性'}特质明显。`;
  personality += `命局中${dominant}最旺，`;
  personality += elementCharacteristics[dominant as keyof typeof elementCharacteristics].description;
  personality += '\n\n';
  
  const chars = elementCharacteristics[dominant as keyof typeof elementCharacteristics];
  personality += `性格特点：您具有${chars.positive.slice(0, 3).join('、')}的特质。`;
  personality += `同时需要注意避免${chars.negative[0]}的倾向。`;
  
  if (elements.lacking.length > 0) {
    personality += `\n\n命局缺${elements.lacking.join('、')}，`;
    personality += `建议在生活中多接触相关元素以达到平衡。`;
  }
  
  return personality;
}

/**
 * 生成运势分析
 */
function generateFortune(chart: BaziChart, elements: BaziReading['elements']): BaziReading['fortune'] {
  const dominant = elements.dominant;
  const dayStem = chart.day.stem;
  
  // 事业运
  let career = '';
  if (dominant === '木' || dominant === '火') {
    career = `您的命局适合从事创造性和领导性的工作。${dayStem.element}日主的人在需要创新思维的领域会有出色表现。`;
    career += `建议从事文化、教育、艺术或管理类工作。`;
  } else if (dominant === '土' || dominant === '金') {
    career = `您的命局适合从事稳定和技术性的工作。${dayStem.element}日主的人在需要专业技能的领域会有优势。`;
    career += `建议从事金融、工程、医疗或技术类工作。`;
  } else {
    career = `您的命局适合从事灵活和智慧型的工作。${dayStem.element}日主的人在需要应变能力的领域会表现突出。`;
    career += `建议从事贸易、咨询、传媒或服务类工作。`;
  }
  
  // 财运
  let wealth = '';
  const hasWealth = elements.distribution['金'] > 0 || elements.distribution['土'] > 0;
  if (hasWealth) {
    wealth = `命局中财星有力，具有良好的财运基础。`;
    wealth += `通过努力工作和明智投资，可以积累可观的财富。`;
    wealth += `建议注重长期规划，避免投机冒险。`;
  } else {
    wealth = `命局中财星较弱，需要通过自身努力创造财富。`;
    wealth += `建议发展专业技能，通过提升能力来增加收入。`;
    wealth += `保持勤俭节约的习惯，稳步积累财富。`;
  }
  
  // 健康运
  let health = '';
  if (elements.lacking.length > 0) {
    health = `命局五行不够平衡，需要注意相关的健康问题。`;
    health += `缺${elements.lacking[0]}的人，应该注意对应器官的保养。`;
    health += `建议保持规律作息，适度运动，注意饮食平衡。`;
  } else {
    health = `命局五行较为平衡，整体健康状况良好。`;
    health += `保持积极的生活态度和良好的生活习惯，可以维持健康状态。`;
    health += `定期体检，预防为主。`;
  }
  
  // 感情运
  let relationships = '';
  const yearBranch = chart.year.branch.zodiac;
  relationships = `您的生肖是${yearBranch}，在感情方面`;
  if (dominant === '水' || dominant === '木') {
    relationships += `较为感性和浪漫。重视情感交流，容易与人建立深厚的感情。`;
    relationships += `建议在感情中保持理性，避免过度依赖。`;
  } else {
    relationships += `较为理性和稳重。重视感情的稳定性和长久性。`;
    relationships += `建议在感情中多表达情感，增加浪漫元素。`;
  }
  
  return { career, wealth, health, relationships };
}

/**
 * 生成建议
 */
function generateAdvice(chart: BaziChart, elements: BaziReading['elements']): string[] {
  const advice: string[] = [];
  const dominant = elements.dominant;
  
  // 基于主导五行的建议
  advice.push(`您的命局以${dominant}为主，建议多接触${elementRelations.generates[dominant as keyof typeof elementRelations.generates]}元素以增强运势`);
  
  // 基于缺失五行的建议
  if (elements.lacking.length > 0) {
    elements.lacking.forEach(element => {
      advice.push(`命局缺${element}，可以通过穿戴相关颜色、方位调整等方式补充`);
    });
  }
  
  // 基于日主的建议
  const dayStem = chart.day.stem;
  advice.push(`作为${dayStem.name}${dayStem.element}日主，保持${dayStem.yinYang === '阳' ? '积极进取' : '内敛沉稳'}的态度会更有利`);
  
  // 通用建议
  advice.push('保持五行平衡，在生活中注意调和各方面的关系');
  advice.push('顺应自然规律，在合适的时机做合适的事情');
  
  return advice;
}

/**
 * 生成完整的八字分析
 */
export function generateBaziReading(input: BaziInput): BaziReading {
  const chart = calculateBaziChart(input);
  const elements = analyzeElements(chart);
  
  return {
    chart,
    elements,
    personality: generatePersonality(chart, elements),
    fortune: generateFortune(chart, elements),
    advice: generateAdvice(chart, elements)
  };
}

/**
 * 获取生肖
 */
export function getZodiacAnimal(year: number): string {
  const yearPillar = calculateYearPillar(year);
  return yearPillar.branch.zodiac;
}
