import { tarotCards, TarotCard } from '../data/tarotCards';

export interface TarotSpread {
  name: string;
  positions: string[];
  cardCount: number;
}

export interface DrawnCard {
  card: TarotCard;
  position: string;
  isReversed: boolean;
}

export interface TarotReading {
  spread: string;
  cards: DrawnCard[];
  interpretation: string;
}

// 定义不同的牌阵
export const tarotSpreads: Record<string, TarotSpread> = {
  threeCard: {
    name: '三张牌阵',
    positions: ['过去', '现在', '未来'],
    cardCount: 3
  },
  celticCross: {
    name: '凯尔特十字',
    positions: [
      '当前状况',
      '挑战',
      '潜意识',
      '过去',
      '可能性',
      '近期未来',
      '你的态度',
      '外部影响',
      '希望与恐惧',
      '最终结果'
    ],
    cardCount: 10
  },
  singleCard: {
    name: '单张牌',
    positions: ['指引'],
    cardCount: 1
  },
  relationship: {
    name: '关系牌阵',
    positions: ['你', '对方', '关系', '挑战', '建议'],
    cardCount: 5
  }
};

/**
 * 生成伪随机种子（基于用户信息和时间）
 */
function generateSeed(userInfo?: { name?: string; birthDate?: string }): number {
  const timestamp = Date.now();
  let seed = timestamp;
  
  if (userInfo?.name) {
    for (let i = 0; i < userInfo.name.length; i++) {
      seed += userInfo.name.charCodeAt(i) * (i + 1);
    }
  }
  
  if (userInfo?.birthDate) {
    const dateNum = new Date(userInfo.birthDate).getTime();
    seed += dateNum;
  }
  
  return seed;
}

/**
 * 简单的伪随机数生成器（基于种子）
 */
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

/**
 * 洗牌算法（Fisher-Yates）
 */
function shuffleDeck(cards: TarotCard[], random: SeededRandom): TarotCard[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = random.nextInt(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * 抽取塔罗牌
 */
export function drawCards(
  spreadType: keyof typeof tarotSpreads,
  userInfo?: { name?: string; birthDate?: string }
): DrawnCard[] {
  const spread = tarotSpreads[spreadType];
  if (!spread) {
    throw new Error('Invalid spread type');
  }
  
  const seed = generateSeed(userInfo);
  const random = new SeededRandom(seed);
  
  // 洗牌
  const shuffledDeck = shuffleDeck(tarotCards, random);
  
  // 抽取指定数量的牌
  const drawnCards: DrawnCard[] = [];
  for (let i = 0; i < spread.cardCount; i++) {
    const card = shuffledDeck[i];
    const isReversed = random.next() > 0.5; // 50%概率逆位
    
    drawnCards.push({
      card,
      position: spread.positions[i],
      isReversed
    });
  }
  
  return drawnCards;
}

/**
 * 生成塔罗牌解读
 */
export function generateTarotReading(
  spreadType: keyof typeof tarotSpreads,
  userInfo?: { name?: string; birthDate?: string; question?: string }
): TarotReading {
  const spread = tarotSpreads[spreadType];
  const drawnCards = drawCards(spreadType, userInfo);
  
  // 生成解读
  let interpretation = '';
  
  // 添加问题（如果有）
  if (userInfo?.question) {
    interpretation += `关于您的问题："${userInfo.question}"\n\n`;
  }
  
  interpretation += `使用${spread.name}为您进行占卜。\n\n`;
  
  // 为每张牌生成解读
  drawnCards.forEach((drawn, index) => {
    const { card, position, isReversed } = drawn;
    const orientation = isReversed ? '逆位' : '正位';
    const meaning = isReversed ? card.reversed : card.upright;
    
    interpretation += `【${position}】${card.name} (${card.nameEn}) - ${orientation}\n`;
    interpretation += `关键词：${meaning.keywords.join('、')}\n`;
    interpretation += `含义：${meaning.meaning}\n`;
    
    if (index < drawnCards.length - 1) {
      interpretation += '\n';
    }
  });
  
  // 添加综合解读
  interpretation += '\n\n【综合解读】\n';
  interpretation += generateOverallInterpretation(drawnCards, spread);
  
  // 添加建议
  interpretation += '\n\n【建议】\n';
  interpretation += generateAdvice(drawnCards);
  
  return {
    spread: spread.name,
    cards: drawnCards,
    interpretation
  };
}

/**
 * 生成综合解读
 */
function generateOverallInterpretation(cards: DrawnCard[], spread: TarotSpread): string {
  let overall = '';
  
  if (spread.name === '三张牌阵') {
    const past = cards[0];
    const present = cards[1];
    const future = cards[2];
    
    overall += `从过去的${past.card.name}来看，`;
    overall += past.isReversed 
      ? `您可能经历了${past.card.reversed.keywords[0]}的时期。` 
      : `您经历了${past.card.upright.keywords[0]}的阶段。`;
    
    overall += `目前，${present.card.name}显示您正处于`;
    overall += present.isReversed
      ? `${present.card.reversed.keywords[0]}的状态中。`
      : `${present.card.upright.keywords[0]}的状态。`;
    
    overall += `展望未来，${future.card.name}预示着`;
    overall += future.isReversed
      ? `您需要注意${future.card.reversed.keywords[0]}的挑战。`
      : `${future.card.upright.keywords[0]}的发展趋势。`;
  } else if (spread.name === '单张牌') {
    const card = cards[0];
    overall += `${card.card.name}为您带来的指引是：`;
    overall += card.isReversed
      ? `注意${card.card.reversed.keywords.join('、')}的方面，${card.card.reversed.meaning}`
      : `关注${card.card.upright.keywords.join('、')}，${card.card.upright.meaning}`;
  } else {
    // 通用解读
    overall += '从整体牌面来看，';
    const majorCards = cards.filter(c => c.card.suit === 'major');
    
    if (majorCards.length > cards.length / 2) {
      overall += '大阿卡纳牌的出现表明这是一个重要的人生阶段，涉及深层次的转变和成长。';
    } else {
      overall += '小阿卡纳牌占主导，表明这些是日常生活中可以掌控的事务。';
    }
    
    overall += '各个位置的牌相互呼应，为您描绘出一幅完整的画面。';
  }
  
  return overall;
}

/**
 * 生成建议
 */
function generateAdvice(cards: DrawnCard[]): string {
  const advicePoints: string[] = [];
  
  // 基于抽到的牌生成建议
  cards.forEach(drawn => {
    const { card, isReversed } = drawn;
    
    if (card.suit === 'major') {
      if (isReversed) {
        advicePoints.push(`关注${card.name}逆位所提示的${card.reversed.keywords[0]}问题`);
      } else {
        advicePoints.push(`把握${card.name}带来的${card.upright.keywords[0]}机会`);
      }
    }
  });
  
  // 通用建议
  advicePoints.push('保持开放的心态，接受生命的指引');
  advicePoints.push('相信自己的直觉，它会为您指明方向');
  advicePoints.push('记住，塔罗牌只是一面镜子，最终的选择权在您手中');
  
  return advicePoints.map((point, index) => `${index + 1}. ${point}`).join('\n');
}

/**
 * 获取可用的牌阵类型
 */
export function getAvailableSpreads(): TarotSpread[] {
  return Object.values(tarotSpreads);
}
