import { zodiacSigns, ZodiacSign } from '../data/zodiacSigns';

export interface AstrologyInput {
  birthDate: Date;
  name?: string;
}

export interface AstrologyReading {
  sign: ZodiacSign;
  fortune: {
    overall: string;
    love: string;
    career: string;
    health: string;
    finance: string;
  };
  luckyElements: {
    color: string;
    number: number;
    direction: string;
  };
  advice: string[];
}

/**
 * 根据出生日期计算星座
 */
export function calculateZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1; // JavaScript月份从0开始
  const day = birthDate.getDate();
  
  for (const sign of zodiacSigns) {
    const { start, end } = sign.dateRange;
    
    // 处理跨年的情况（如摩羯座）
    if (start.month > end.month) {
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month || month < end.month)
      ) {
        return sign;
      }
    } else {
      // 正常情况
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month && month < end.month)
      ) {
        return sign;
      }
    }
  }
  
  // 默认返回白羊座（理论上不应该到达这里）
  return zodiacSigns[0];
}

/**
 * 生成伪随机数（基于日期）
 */
function getDateBasedRandom(date: Date, seed: number = 0): number {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const value = (dayOfYear * 9301 + seed * 49297) % 233280;
  return value / 233280;
}

/**
 * 生成运势描述
 */
function generateFortune(sign: ZodiacSign, date: Date): AstrologyReading['fortune'] {
  const random1 = getDateBasedRandom(date, 1);
  const random2 = getDateBasedRandom(date, 2);
  const random3 = getDateBasedRandom(date, 3);
  const random4 = getDateBasedRandom(date, 4);
  const random5 = getDateBasedRandom(date, 5);
  
  // 综合运势
  const overallTemplates = [
    `今天对${sign.name}来说是充满${sign.traits.positive[0]}的一天。${sign.element}象星座的特质将帮助你把握机会，展现出色的${sign.traits.positive[1]}。保持积极的态度，你会发现许多意想不到的惊喜。`,
    `${sign.name}的朋友们，今天的能量特别适合发挥你们的${sign.traits.positive[2]}。作为${sign.element}象星座，你们天生具有的${sign.traits.positive[0]}将成为今天的优势。记得保持平衡，避免过度${sign.traits.negative[0]}。`,
    `今天${sign.rulingPlanet}的影响为${sign.name}带来积极的能量。你的${sign.traits.positive[1]}和${sign.traits.positive[3]}将帮助你应对各种挑战。这是展现你真实自我的好时机。`
  ];
  
  // 爱情运势
  const loveTemplates = [
    `在感情方面，${sign.name}今天的魅力指数爆表。单身者可能会遇到有趣的人，不妨主动一些。有伴侣的人，今天是增进感情的好日子，可以尝试一些浪漫的活动。`,
    `爱情运势平稳上升。${sign.name}的${sign.traits.positive[0]}会吸引他人的注意。建议多表达你的感受，真诚的沟通会让关系更加稳固。避免因${sign.traits.negative[1]}而产生误会。`,
    `今天的爱情能量对${sign.name}非常有利。你的${sign.traits.positive[2]}会让你在感情中更加自信。对于正在寻找爱情的人，保持开放的心态，缘分可能就在不经意间出现。`
  ];
  
  // 事业运势
  const careerTemplates = [
    `事业方面，${sign.name}今天适合展现领导才能。你的${sign.traits.positive[4]}会得到认可，可能会有新的机会出现。保持专注，避免被琐事分散注意力。`,
    `工作运势良好。${sign.element}象星座的特质让你在团队中表现出色。今天适合处理重要项目或进行创新尝试。记得与同事保持良好沟通，合作会带来更好的结果。`,
    `${sign.name}今天在职场上充满活力。你的${sign.traits.positive[1]}和${sign.traits.positive[3]}会帮助你解决难题。这是提出新想法或寻求晋升的好时机。`
  ];
  
  // 健康运势
  const healthTemplates = [
    `健康方面需要注意平衡。${sign.name}今天可能会感到精力充沛，但也要注意休息。建议进行适度的运动，保持良好的作息习惯。`,
    `身体状况整体良好。作为${sign.element}象星座，你需要特别关注相关的健康问题。今天适合尝试新的健康习惯，如冥想或瑜伽。`,
    `${sign.name}今天的健康运势稳定。保持积极的心态对身体有益。建议多喝水，保持均衡饮食，避免过度劳累。`
  ];
  
  // 财运
  const financeTemplates = [
    `财运方面，${sign.name}今天有不错的机会。可能会有意外的收入或投资机会。但要谨慎决策，避免冲动消费。`,
    `金钱运势平稳。今天适合进行财务规划或整理账目。${sign.name}的${sign.traits.positive[3]}会帮助你做出明智的财务决定。`,
    `财运呈上升趋势。${sign.name}今天可能会发现新的赚钱机会。保持理性，结合你的${sign.traits.positive[1]}来评估风险。`
  ];
  
  return {
    overall: overallTemplates[Math.floor(random1 * overallTemplates.length)],
    love: loveTemplates[Math.floor(random2 * loveTemplates.length)],
    career: careerTemplates[Math.floor(random3 * careerTemplates.length)],
    health: healthTemplates[Math.floor(random4 * healthTemplates.length)],
    finance: financeTemplates[Math.floor(random5 * financeTemplates.length)]
  };
}

/**
 * 生成幸运元素
 */
function generateLuckyElements(_sign: ZodiacSign, date: Date): AstrologyReading['luckyElements'] {
  const colors = ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色', '粉色', '白色'];
  const directions = ['东方', '南方', '西方', '北方', '东南', '西南', '东北', '西北'];
  
  const colorIndex = Math.floor(getDateBasedRandom(date, 10) * colors.length);
  const number = Math.floor(getDateBasedRandom(date, 11) * 9) + 1;
  const directionIndex = Math.floor(getDateBasedRandom(date, 12) * directions.length);
  
  return {
    color: colors[colorIndex],
    number: number,
    direction: directions[directionIndex]
  };
}

/**
 * 生成建议
 */
function generateAdvice(sign: ZodiacSign): string[] {
  return [
    `发挥你的${sign.traits.positive[0]}，这是${sign.name}的天赋`,
    `注意避免过度${sign.traits.negative[0]}，保持平衡很重要`,
    `与${sign.compatibility.best[0]}或${sign.compatibility.best[1]}的人互动会带来好运`,
    `今天适合进行与${sign.element}元素相关的活动`,
    `相信你的直觉，${sign.rulingPlanet}会为你指引方向`
  ];
}

/**
 * 生成完整的星座运势
 */
export function generateAstrologyReading(input: AstrologyInput): AstrologyReading {
  const sign = calculateZodiacSign(input.birthDate);
  const today = new Date();
  
  return {
    sign,
    fortune: generateFortune(sign, today),
    luckyElements: generateLuckyElements(sign, today),
    advice: generateAdvice(sign)
  };
}

/**
 * 获取所有星座信息
 */
export function getAllZodiacSigns(): ZodiacSign[] {
  return zodiacSigns;
}

/**
 * 根据名称获取星座
 */
export function getZodiacSignByName(name: string): ZodiacSign | undefined {
  return zodiacSigns.find(sign => sign.name === name || sign.nameEn === name);
}
