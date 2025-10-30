export interface ZodiacSign {
  id: number;
  name: string;
  nameEn: string;
  element: '火' | '土' | '风' | '水';
  quality: '基本' | '固定' | '变动';
  rulingPlanet: string;
  dateRange: { start: { month: number; day: number }; end: { month: number; day: number } };
  traits: {
    positive: string[];
    negative: string[];
  };
  description: string;
  compatibility: {
    best: string[];
    challenging: string[];
  };
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: 1,
    name: '白羊座',
    nameEn: 'Aries',
    element: '火',
    quality: '基本',
    rulingPlanet: '火星',
    dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    traits: {
      positive: ['勇敢', '热情', '自信', '积极', '直率', '领导力强'],
      negative: ['冲动', '急躁', '自我中心', '缺乏耐心', '好斗']
    },
    description: '白羊座是黄道十二宫的第一个星座，象征着新的开始和无限的活力。白羊座的人充满激情和冒险精神，总是勇往直前。',
    compatibility: {
      best: ['狮子座', '射手座', '双子座', '水瓶座'],
      challenging: ['巨蟹座', '摩羯座']
    }
  },
  {
    id: 2,
    name: '金牛座',
    nameEn: 'Taurus',
    element: '土',
    quality: '固定',
    rulingPlanet: '金星',
    dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    traits: {
      positive: ['稳定', '可靠', '耐心', '务实', '忠诚', '感官享受'],
      negative: ['固执', '占有欲强', '懒惰', '物质主义', '抗拒变化']
    },
    description: '金牛座以其稳定性和可靠性而闻名。他们欣赏生活中的美好事物，追求安全感和舒适。',
    compatibility: {
      best: ['处女座', '摩羯座', '巨蟹座', '双鱼座'],
      challenging: ['狮子座', '水瓶座']
    }
  },
  {
    id: 3,
    name: '双子座',
    nameEn: 'Gemini',
    element: '风',
    quality: '变动',
    rulingPlanet: '水星',
    dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    traits: {
      positive: ['聪明', '适应力强', '沟通能力好', '好奇', '机智', '多才多艺'],
      negative: ['善变', '肤浅', '不专注', '紧张', '优柔寡断']
    },
    description: '双子座是沟通和智慧的象征。他们好奇心强，喜欢学习新事物，善于表达和社交。',
    compatibility: {
      best: ['天秤座', '水瓶座', '白羊座', '狮子座'],
      challenging: ['处女座', '双鱼座']
    }
  },
  {
    id: 4,
    name: '巨蟹座',
    nameEn: 'Cancer',
    element: '水',
    quality: '基本',
    rulingPlanet: '月亮',
    dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    traits: {
      positive: ['情感丰富', '直觉强', '关怀', '忠诚', '保护欲', '家庭观念强'],
      negative: ['情绪化', '敏感', '依赖', '防御心强', '怀旧']
    },
    description: '巨蟹座是情感和家庭的守护者。他们敏感而富有同情心，重视情感联系和安全感。',
    compatibility: {
      best: ['天蝎座', '双鱼座', '金牛座', '处女座'],
      challenging: ['白羊座', '天秤座']
    }
  },
  {
    id: 5,
    name: '狮子座',
    nameEn: 'Leo',
    element: '火',
    quality: '固定',
    rulingPlanet: '太阳',
    dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    traits: {
      positive: ['自信', '慷慨', '热情', '创造力', '领导力', '忠诚'],
      negative: ['傲慢', '固执', '自我中心', '霸道', '爱面子']
    },
    description: '狮子座是王者的象征，充满自信和魅力。他们天生具有领导才能，喜欢成为关注的焦点。',
    compatibility: {
      best: ['白羊座', '射手座', '双子座', '天秤座'],
      challenging: ['金牛座', '天蝎座']
    }
  },
  {
    id: 6,
    name: '处女座',
    nameEn: 'Virgo',
    element: '土',
    quality: '变动',
    rulingPlanet: '水星',
    dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    traits: {
      positive: ['细心', '分析能力强', '勤奋', '实用', '谦虚', '服务精神'],
      negative: ['挑剔', '完美主义', '焦虑', '过度批判', '保守']
    },
    description: '处女座以其细致和完美主义而著称。他们注重细节，追求卓越，乐于帮助他人。',
    compatibility: {
      best: ['金牛座', '摩羯座', '巨蟹座', '天蝎座'],
      challenging: ['双子座', '射手座']
    }
  },
  {
    id: 7,
    name: '天秤座',
    nameEn: 'Libra',
    element: '风',
    quality: '基本',
    rulingPlanet: '金星',
    dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    traits: {
      positive: ['公平', '外交', '优雅', '社交', '和平', '审美'],
      negative: ['优柔寡断', '避免冲突', '肤浅', '依赖', '犹豫不决']
    },
    description: '天秤座追求平衡与和谐。他们具有出色的社交能力和审美眼光，重视公平和正义。',
    compatibility: {
      best: ['双子座', '水瓶座', '狮子座', '射手座'],
      challenging: ['巨蟹座', '摩羯座']
    }
  },
  {
    id: 8,
    name: '天蝎座',
    nameEn: 'Scorpio',
    element: '水',
    quality: '固定',
    rulingPlanet: '冥王星',
    dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    traits: {
      positive: ['深刻', '热情', '勇敢', '忠诚', '直觉', '决心'],
      negative: ['嫉妒', '占有欲', '报复心', '神秘', '控制欲']
    },
    description: '天蝎座是最深刻和神秘的星座。他们情感强烈，洞察力敏锐，具有强大的意志力。',
    compatibility: {
      best: ['巨蟹座', '双鱼座', '处女座', '摩羯座'],
      challenging: ['狮子座', '水瓶座']
    }
  },
  {
    id: 9,
    name: '射手座',
    nameEn: 'Sagittarius',
    element: '火',
    quality: '变动',
    rulingPlanet: '木星',
    dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    traits: {
      positive: ['乐观', '自由', '冒险', '诚实', '哲学', '幽默'],
      negative: ['不负责任', '夸张', '不切实际', '直率过度', '缺乏耐心']
    },
    description: '射手座是冒险家和哲学家。他们热爱自由，追求真理，对生活充满乐观和热情。',
    compatibility: {
      best: ['白羊座', '狮子座', '天秤座', '水瓶座'],
      challenging: ['处女座', '双鱼座']
    }
  },
  {
    id: 10,
    name: '摩羯座',
    nameEn: 'Capricorn',
    element: '土',
    quality: '基本',
    rulingPlanet: '土星',
    dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    traits: {
      positive: ['负责', '纪律', '雄心', '耐心', '实际', '传统'],
      negative: ['悲观', '固执', '冷漠', '过度严肃', '工作狂']
    },
    description: '摩羯座是成就和责任的象征。他们勤奋务实，有强烈的目标感和责任心。',
    compatibility: {
      best: ['金牛座', '处女座', '天蝎座', '双鱼座'],
      challenging: ['白羊座', '天秤座']
    }
  },
  {
    id: 11,
    name: '水瓶座',
    nameEn: 'Aquarius',
    element: '风',
    quality: '固定',
    rulingPlanet: '天王星',
    dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    traits: {
      positive: ['创新', '独立', '人道主义', '智慧', '原创', '友善'],
      negative: ['疏离', '固执', '叛逆', '不可预测', '情感冷漠']
    },
    description: '水瓶座是创新和人道主义的代表。他们思想前卫，重视自由和平等，具有独特的视角。',
    compatibility: {
      best: ['双子座', '天秤座', '白羊座', '射手座'],
      challenging: ['金牛座', '天蝎座']
    }
  },
  {
    id: 12,
    name: '双鱼座',
    nameEn: 'Pisces',
    element: '水',
    quality: '变动',
    rulingPlanet: '海王星',
    dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    traits: {
      positive: ['同情心', '直觉', '艺术', '温柔', '适应力', '无私'],
      negative: ['逃避', '过度敏感', '不切实际', '易受影响', '优柔寡断']
    },
    description: '双鱼座是梦想家和艺术家。他们富有同情心和想象力，对精神世界有深刻的理解。',
    compatibility: {
      best: ['巨蟹座', '天蝎座', '金牛座', '摩羯座'],
      challenging: ['双子座', '射手座']
    }
  }
];
