import { hexagrams, Hexagram, trigrams } from '../data/iChingData';

export interface IChingInput {
  method: 'time' | 'numbers';
  timestamp?: Date;
  numbers?: number[];
  question?: string;
}

export interface IChingReading {
  primaryHexagram: Hexagram;
  changingLines: number[];
  transformedHexagram?: Hexagram;
  interpretation: string;
  advice: string[];
}

/**
 * 时间起卦法
 */
function castByTime(timestamp: Date): { hexagramId: number; changingLines: number[] } {
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const day = timestamp.getDate();
  const hour = timestamp.getHours();
  const minute = timestamp.getMinutes();
  
  // 计算上卦（年+月+日）
  const upperValue = (year + month + day) % 8;
  const upperIndex = upperValue === 0 ? 8 : upperValue;
  
  // 计算下卦（年+月+日+时）
  const lowerValue = (year + month + day + hour) % 8;
  const lowerIndex = lowerValue === 0 ? 8 : lowerValue;
  
  // 计算动爻（年+月+日+时+分）
  const changingValue = (year + month + day + hour + minute) % 6;
  const changingLine = changingValue === 0 ? 6 : changingValue;
  
  // 简化的卦象映射（实际应该有64卦的完整映射）
  const hexagramId = ((upperIndex - 1) * 8 + (lowerIndex - 1)) % hexagrams.length;
  
  return {
    hexagramId,
    changingLines: [changingLine]
  };
}

/**
 * 数字起卦法
 */
function castByNumbers(numbers: number[]): { hexagramId: number; changingLines: number[] } {
  if (numbers.length < 3) {
    throw new Error('需要至少3个数字');
  }
  
  // 使用前两个数字确定卦象
  const upperValue = numbers[0] % 8;
  const upperIndex = upperValue === 0 ? 8 : upperValue;
  
  const lowerValue = numbers[1] % 8;
  const lowerIndex = lowerValue === 0 ? 8 : lowerValue;
  
  // 使用第三个数字确定动爻
  const changingValue = numbers[2] % 6;
  const changingLine = changingValue === 0 ? 6 : changingValue;
  
  const hexagramId = ((upperIndex - 1) * 8 + (lowerIndex - 1)) % hexagrams.length;
  
  return {
    hexagramId,
    changingLines: [changingLine]
  };
}

/**
 * 获取变卦
 */
function getTransformedHexagram(
  primaryId: number,
  changingLines: number[]
): Hexagram | undefined {
  if (changingLines.length === 0) {
    return undefined;
  }
  
  // 简化处理：根据动爻位置选择变卦
  // 实际应该根据爻变规则计算
  const transformedId = (primaryId + changingLines[0]) % hexagrams.length;
  return hexagrams[transformedId];
}

/**
 * 生成解读
 */
function generateInterpretation(
  primary: Hexagram,
  changingLines: number[],
  transformed?: Hexagram,
  question?: string
): string {
  let interpretation = '';
  
  if (question) {
    interpretation += `关于您的问题："${question}"\n\n`;
  }
  
  interpretation += `【本卦】${primary.chineseName}卦 (${primary.name})\n\n`;
  interpretation += `卦象：上${primary.trigrams.upper}下${primary.trigrams.lower}\n`;
  interpretation += `卦辞：${primary.judgment}\n`;
  interpretation += `象辞：${primary.image}\n\n`;
  
  interpretation += `【卦象解读】\n`;
  interpretation += `${primary.interpretation.general}\n\n`;
  
  interpretation += `【各方面指引】\n`;
  interpretation += `事业：${primary.interpretation.career}\n\n`;
  interpretation += `感情：${primary.interpretation.relationship}\n\n`;
  
  if (changingLines.length > 0) {
    interpretation += `【动爻】\n`;
    interpretation += `第${changingLines.join('、')}爻发动，表示事态正在变化之中。`;
    interpretation += `需要特别关注这些方面的发展。\n\n`;
    
    if (transformed) {
      interpretation += `【之卦】${transformed.chineseName}卦 (${transformed.name})\n\n`;
      interpretation += `事态发展的趋势指向${transformed.chineseName}卦。`;
      interpretation += `${transformed.interpretation.general}\n\n`;
    }
  }
  
  interpretation += `【总体建议】\n`;
  interpretation += `${primary.interpretation.advice}\n`;
  
  return interpretation;
}

/**
 * 生成建议
 */
function generateAdvice(
  primary: Hexagram,
  transformed?: Hexagram
): string[] {
  const advice: string[] = [];
  
  // 基于本卦的建议
  advice.push(primary.interpretation.advice);
  
  // 基于卦象特征的建议
  const upperTrigram = trigrams[primary.trigrams.upper as keyof typeof trigrams];
  const lowerTrigram = trigrams[primary.trigrams.lower as keyof typeof trigrams];
  
  advice.push(`上卦为${upperTrigram.element}，性质${upperTrigram.nature}，方位在${upperTrigram.direction}`);
  advice.push(`下卦为${lowerTrigram.element}，性质${lowerTrigram.nature}，方位在${lowerTrigram.direction}`);
  
  // 如果有变卦，添加相关建议
  if (transformed) {
    advice.push(`事态将向${transformed.chineseName}卦发展，需要提前做好准备`);
    advice.push(transformed.interpretation.advice);
  }
  
  // 通用建议
  advice.push('周易的智慧在于顺应天时，把握变化的规律');
  advice.push('保持中正之道，不偏不倚，方能趋吉避凶');
  
  return advice;
}

/**
 * 生成完整的周易占卜
 */
export function generateIChingReading(input: IChingInput): IChingReading {
  let hexagramId: number;
  let changingLines: number[];
  
  if (input.method === 'time') {
    const timestamp = input.timestamp || new Date();
    const result = castByTime(timestamp);
    hexagramId = result.hexagramId;
    changingLines = result.changingLines;
  } else {
    if (!input.numbers || input.numbers.length < 3) {
      throw new Error('数字起卦需要至少3个数字');
    }
    const result = castByNumbers(input.numbers);
    hexagramId = result.hexagramId;
    changingLines = result.changingLines;
  }
  
  const primaryHexagram = hexagrams[hexagramId];
  const transformedHexagram = getTransformedHexagram(hexagramId, changingLines);
  
  const interpretation = generateInterpretation(
    primaryHexagram,
    changingLines,
    transformedHexagram,
    input.question
  );
  
  const advice = generateAdvice(primaryHexagram, transformedHexagram);
  
  return {
    primaryHexagram,
    changingLines,
    transformedHexagram,
    interpretation,
    advice
  };
}

/**
 * 获取所有卦象
 */
export function getAllHexagrams(): Hexagram[] {
  return hexagrams;
}

/**
 * 根据编号获取卦象
 */
export function getHexagramByNumber(number: number): Hexagram | undefined {
  return hexagrams.find(h => h.number === number);
}
