// 天干
export const heavenlyStems = [
  { id: 0, name: '甲', element: '木', yinYang: '阳' },
  { id: 1, name: '乙', element: '木', yinYang: '阴' },
  { id: 2, name: '丙', element: '火', yinYang: '阳' },
  { id: 3, name: '丁', element: '火', yinYang: '阴' },
  { id: 4, name: '戊', element: '土', yinYang: '阳' },
  { id: 5, name: '己', element: '土', yinYang: '阴' },
  { id: 6, name: '庚', element: '金', yinYang: '阳' },
  { id: 7, name: '辛', element: '金', yinYang: '阴' },
  { id: 8, name: '壬', element: '水', yinYang: '阳' },
  { id: 9, name: '癸', element: '水', yinYang: '阴' }
];

// 地支
export const earthlyBranches = [
  { id: 0, name: '子', element: '水', zodiac: '鼠', yinYang: '阳' },
  { id: 1, name: '丑', element: '土', zodiac: '牛', yinYang: '阴' },
  { id: 2, name: '寅', element: '木', zodiac: '虎', yinYang: '阳' },
  { id: 3, name: '卯', element: '木', zodiac: '兔', yinYang: '阴' },
  { id: 4, name: '辰', element: '土', zodiac: '龙', yinYang: '阳' },
  { id: 5, name: '巳', element: '火', zodiac: '蛇', yinYang: '阴' },
  { id: 6, name: '午', element: '火', zodiac: '马', yinYang: '阳' },
  { id: 7, name: '未', element: '土', zodiac: '羊', yinYang: '阴' },
  { id: 8, name: '申', element: '金', zodiac: '猴', yinYang: '阳' },
  { id: 9, name: '酉', element: '金', zodiac: '鸡', yinYang: '阴' },
  { id: 10, name: '戌', element: '土', zodiac: '狗', yinYang: '阳' },
  { id: 11, name: '亥', element: '水', zodiac: '猪', yinYang: '阴' }
];

// 五行相生相克
export const elementRelations = {
  generates: {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  },
  controls: {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  }
};

// 五行特征描述
export const elementCharacteristics = {
  '木': {
    positive: ['仁慈', '生长', '创造力', '灵活', '进取'],
    negative: ['固执', '理想主义', '缺乏耐心'],
    description: '木代表生长和发展，象征着春天的生机和创造力。'
  },
  '火': {
    positive: ['热情', '活力', '领导力', '光明', '积极'],
    negative: ['急躁', '冲动', '缺乏耐心'],
    description: '火代表热情和光明，象征着夏天的活力和激情。'
  },
  '土': {
    positive: ['稳定', '可靠', '务实', '包容', '中和'],
    negative: ['固执', '保守', '缺乏变通'],
    description: '土代表稳定和包容，象征着大地的承载和孕育。'
  },
  '金': {
    positive: ['坚强', '果断', '正义', '清晰', '收敛'],
    negative: ['刚硬', '冷漠', '过于理性'],
    description: '金代表坚强和收敛，象征着秋天的肃杀和收获。'
  },
  '水': {
    positive: ['智慧', '灵活', '适应', '深邃', '流动'],
    negative: ['多变', '犹豫', '过于感性'],
    description: '水代表智慧和流动，象征着冬天的储藏和智慧。'
  }
};
