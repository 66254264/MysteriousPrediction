export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  upright: {
    keywords: string[];
    meaning: string;
  };
  reversed: {
    keywords: string[];
    meaning: string;
  };
}

export const tarotCards: TarotCard[] = [
  // Major Arcana (0-21)
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    suit: 'major',
    upright: {
      keywords: ['新开始', '冒险', '自由', '天真'],
      meaning: '愚者代表新的开始和无限的可能性。这是一个充满冒险精神的时刻，鼓励你勇敢地踏出第一步，拥抱未知的旅程。'
    },
    reversed: {
      keywords: ['鲁莽', '冲动', '缺乏计划', '风险'],
      meaning: '逆位的愚者提醒你在行动前需要更多的思考和计划。避免过于冲动的决定，注意潜在的风险。'
    }
  },
  {
    id: 1,
    name: '魔术师',
    nameEn: 'The Magician',
    suit: 'major',
    upright: {
      keywords: ['创造力', '技能', '意志力', '资源'],
      meaning: '魔术师象征着你拥有实现目标所需的所有工具和能力。现在是运用你的技能和创造力来实现愿望的时候。'
    },
    reversed: {
      keywords: ['操纵', '欺骗', '浪费才能', '缺乏方向'],
      meaning: '逆位的魔术师警告可能存在欺骗或滥用权力的情况。注意不要浪费你的才能，找到正确的方向。'
    }
  },
  {
    id: 2,
    name: '女祭司',
    nameEn: 'The High Priestess',
    suit: 'major',
    upright: {
      keywords: ['直觉', '神秘', '潜意识', '智慧'],
      meaning: '女祭司代表内在的智慧和直觉。倾听你的内心声音，相信你的直觉，答案就在你的内心深处。'
    },
    reversed: {
      keywords: ['忽视直觉', '秘密', '缺乏洞察力', '表面'],
      meaning: '逆位的女祭司表明你可能忽视了自己的直觉。需要更深入地探索内心，不要只看表面。'
    }
  },
  {
    id: 3,
    name: '皇后',
    nameEn: 'The Empress',
    suit: 'major',
    upright: {
      keywords: ['丰饶', '母性', '自然', '创造'],
      meaning: '皇后象征着丰饶和创造力。这是一个充满生机和成长的时期，关注你的创造性项目和人际关系的培养。'
    },
    reversed: {
      keywords: ['依赖', '窒息', '创造力受阻', '忽视自我'],
      meaning: '逆位的皇后可能表示过度依赖他人或创造力受阻。需要找回自己的独立性和创造力。'
    }
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    suit: 'major',
    upright: {
      keywords: ['权威', '结构', '控制', '稳定'],
      meaning: '皇帝代表秩序、结构和权威。现在是建立稳固基础和运用领导力的时候。'
    },
    reversed: {
      keywords: ['专制', '僵化', '缺乏纪律', '控制欲'],
      meaning: '逆位的皇帝警告过度控制或缺乏灵活性。需要在权威和灵活性之间找到平衡。'
    }
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    suit: 'major',
    upright: {
      keywords: ['传统', '教育', '信仰', '指导'],
      meaning: '教皇象征传统智慧和精神指导。寻求导师的建议，遵循已被证明有效的方法。'
    },
    reversed: {
      keywords: ['反叛', '非传统', '质疑', '自由思考'],
      meaning: '逆位的教皇鼓励你质疑传统，找到自己的道路。不要盲目遵循规则。'
    }
  },
  {
    id: 6,
    name: '恋人',
    nameEn: 'The Lovers',
    suit: 'major',
    upright: {
      keywords: ['爱情', '和谐', '选择', '价值观'],
      meaning: '恋人牌代表重要的关系和选择。这是关于价值观一致和做出符合内心的决定。'
    },
    reversed: {
      keywords: ['不和谐', '错误选择', '价值观冲突', '失衡'],
      meaning: '逆位的恋人表明关系中的不和谐或价值观冲突。需要重新评估你的选择和优先事项。'
    }
  },
  {
    id: 7,
    name: '战车',
    nameEn: 'The Chariot',
    suit: 'major',
    upright: {
      keywords: ['胜利', '决心', '控制', '前进'],
      meaning: '战车象征着通过意志力和决心获得胜利。保持专注，克服障碍，向目标前进。'
    },
    reversed: {
      keywords: ['失控', '缺乏方向', '侵略性', '失败'],
      meaning: '逆位的战车表明失去控制或方向。需要重新找回焦点和平衡。'
    }
  },
  {
    id: 8,
    name: '力量',
    nameEn: 'Strength',
    suit: 'major',
    upright: {
      keywords: ['勇气', '耐心', '同情', '内在力量'],
      meaning: '力量牌代表内在的勇气和温柔的力量。通过耐心和同情心来克服挑战。'
    },
    reversed: {
      keywords: ['自我怀疑', '软弱', '缺乏信心', '滥用权力'],
      meaning: '逆位的力量表明自我怀疑或缺乏信心。需要找回内在的力量和勇气。'
    }
  },
  {
    id: 9,
    name: '隐士',
    nameEn: 'The Hermit',
    suit: 'major',
    upright: {
      keywords: ['内省', '寻找', '孤独', '智慧'],
      meaning: '隐士代表内在的探索和寻找真理。这是一个需要独处和反思的时期。'
    },
    reversed: {
      keywords: ['孤立', '孤独', '拒绝帮助', '迷失'],
      meaning: '逆位的隐士警告过度孤立或拒绝他人的帮助。需要在独处和社交之间找到平衡。'
    }
  },
  {
    id: 10,
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    suit: 'major',
    upright: {
      keywords: ['变化', '命运', '机遇', '循环'],
      meaning: '命运之轮象征生命的循环和变化。接受变化，把握机遇，相信命运的安排。'
    },
    reversed: {
      keywords: ['厄运', '抗拒变化', '失控', '坏运气'],
      meaning: '逆位的命运之轮表明抗拒变化或经历困难时期。需要接受生命的起伏。'
    }
  },
  {
    id: 11,
    name: '正义',
    nameEn: 'Justice',
    suit: 'major',
    upright: {
      keywords: ['公平', '真相', '法律', '因果'],
      meaning: '正义牌代表公平和真相。做出公正的决定，为自己的行为负责。'
    },
    reversed: {
      keywords: ['不公', '偏见', '逃避责任', '不诚实'],
      meaning: '逆位的正义表明不公平或逃避责任。需要面对真相，承担后果。'
    }
  },
  {
    id: 12,
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    suit: 'major',
    upright: {
      keywords: ['牺牲', '放手', '新视角', '暂停'],
      meaning: '倒吊人象征通过放手和改变视角获得新的理解。这是一个暂停和反思的时期。'
    },
    reversed: {
      keywords: ['拖延', '抗拒', '无谓牺牲', '停滞'],
      meaning: '逆位的倒吊人表明无谓的牺牲或拖延。需要采取行动，停止等待。'
    }
  },
  {
    id: 13,
    name: '死神',
    nameEn: 'Death',
    suit: 'major',
    upright: {
      keywords: ['转变', '结束', '新生', '释放'],
      meaning: '死神代表重大的转变和结束。放下过去，迎接新的开始和成长。'
    },
    reversed: {
      keywords: ['抗拒改变', '停滞', '无法放手', '恐惧'],
      meaning: '逆位的死神表明抗拒必要的改变。需要接受转变，放下不再服务你的事物。'
    }
  },
  {
    id: 14,
    name: '节制',
    nameEn: 'Temperance',
    suit: 'major',
    upright: {
      keywords: ['平衡', '和谐', '耐心', '中庸'],
      meaning: '节制象征平衡和和谐。寻找中间道路，保持耐心，融合不同的元素。'
    },
    reversed: {
      keywords: ['失衡', '过度', '缺乏和谐', '不耐烦'],
      meaning: '逆位的节制表明生活失衡或过度。需要重新找回平衡和节制。'
    }
  },
  {
    id: 15,
    name: '恶魔',
    nameEn: 'The Devil',
    suit: 'major',
    upright: {
      keywords: ['束缚', '诱惑', '物质主义', '依赖'],
      meaning: '恶魔代表束缚和限制。意识到你的依赖和执着，寻找解放的方法。'
    },
    reversed: {
      keywords: ['解放', '觉醒', '打破束缚', '自由'],
      meaning: '逆位的恶魔表明从束缚中解放。你正在打破限制，获得自由。'
    }
  },
  {
    id: 16,
    name: '塔',
    nameEn: 'The Tower',
    suit: 'major',
    upright: {
      keywords: ['突变', '破坏', '启示', '解放'],
      meaning: '塔象征突然的变化和破坏。虽然痛苦，但这是必要的清理，为新的开始铺路。'
    },
    reversed: {
      keywords: ['避免灾难', '恐惧改变', '延迟崩溃', '内在动荡'],
      meaning: '逆位的塔表明延迟的变化或内在的动荡。变化是不可避免的，最好主动面对。'
    }
  },
  {
    id: 17,
    name: '星星',
    nameEn: 'The Star',
    suit: 'major',
    upright: {
      keywords: ['希望', '灵感', '宁静', '更新'],
      meaning: '星星代表希望和灵感。这是一个充满可能性的时期，保持信念，追随你的梦想。'
    },
    reversed: {
      keywords: ['绝望', '缺乏信念', '失望', '失去方向'],
      meaning: '逆位的星星表明失去希望或信念。需要重新连接你的内在光芒和目标。'
    }
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    suit: 'major',
    upright: {
      keywords: ['幻觉', '恐惧', '潜意识', '直觉'],
      meaning: '月亮象征幻觉和潜意识。注意你的梦境和直觉，但要小心欺骗和恐惧。'
    },
    reversed: {
      keywords: ['释放恐惧', '清晰', '真相揭示', '克服焦虑'],
      meaning: '逆位的月亮表明恐惧正在消散，真相开始显现。你正在克服内心的焦虑。'
    }
  },
  {
    id: 19,
    name: '太阳',
    nameEn: 'The Sun',
    suit: 'major',
    upright: {
      keywords: ['成功', '喜悦', '活力', '积极'],
      meaning: '太阳代表成功和喜悦。这是一个充满活力和积极能量的时期，享受生命的美好。'
    },
    reversed: {
      keywords: ['暂时阴云', '过度乐观', '延迟成功', '缺乏热情'],
      meaning: '逆位的太阳表明暂时的困难或延迟。保持积极，阳光很快就会回来。'
    }
  },
  {
    id: 20,
    name: '审判',
    nameEn: 'Judgement',
    suit: 'major',
    upright: {
      keywords: ['觉醒', '更新', '决定', '宽恕'],
      meaning: '审判象征重生和觉醒。这是一个评估过去、做出重要决定的时刻。'
    },
    reversed: {
      keywords: ['自我怀疑', '逃避责任', '内疚', '无法原谅'],
      meaning: '逆位的审判表明自我批判或无法原谅。需要释放内疚，接受自己。'
    }
  },
  {
    id: 21,
    name: '世界',
    nameEn: 'The World',
    suit: 'major',
    upright: {
      keywords: ['完成', '成就', '旅程结束', '整合'],
      meaning: '世界代表完成和成就。你已经完成了一个重要的循环，准备迎接新的开始。'
    },
    reversed: {
      keywords: ['未完成', '缺乏闭合', '寻求完美', '延迟'],
      meaning: '逆位的世界表明未完成的事务或缺乏闭合感。需要完成当前的循环。'
    }
  },
  // Wands (权杖) - 22-35
  {
    id: 22,
    name: '权杖王牌',
    nameEn: 'Ace of Wands',
    suit: 'wands',
    upright: {
      keywords: ['灵感', '新机会', '成长', '潜力'],
      meaning: '权杖王牌代表新的创意和机会。这是一个充满激情和潜力的开始。'
    },
    reversed: {
      keywords: ['缺乏方向', '延迟', '创意受阻', '错失机会'],
      meaning: '逆位的权杖王牌表明创意受阻或错失机会。需要重新点燃你的激情。'
    }
  },
  {
    id: 23,
    name: '权杖二',
    nameEn: 'Two of Wands',
    suit: 'wands',
    upright: {
      keywords: ['计划', '决策', '发现', '个人力量'],
      meaning: '权杖二象征规划未来和做出选择。你拥有力量和资源来实现你的愿景。'
    },
    reversed: {
      keywords: ['犹豫不决', '恐惧未知', '缺乏计划', '意外'],
      meaning: '逆位的权杖二表明犹豫不决或害怕冒险。需要克服恐惧，制定计划。'
    }
  },
  {
    id: 24,
    name: '权杖三',
    nameEn: 'Three of Wands',
    suit: 'wands',
    upright: {
      keywords: ['扩展', '远见', '进步', '机会'],
      meaning: '权杖三代表扩展和远见。你的努力开始结出果实，新的机会正在出现。'
    },
    reversed: {
      keywords: ['障碍', '缺乏远见', '延迟', '挫折'],
      meaning: '逆位的权杖三表明遇到障碍或延迟。需要重新评估你的计划和策略。'
    }
  },
  {
    id: 25,
    name: '权杖四',
    nameEn: 'Four of Wands',
    suit: 'wands',
    upright: {
      keywords: ['庆祝', '和谐', '家庭', '里程碑'],
      meaning: '权杖四象征庆祝和和谐。这是一个值得庆祝的里程碑，享受你的成就。'
    },
    reversed: {
      keywords: ['不稳定', '缺乏支持', '家庭问题', '延迟庆祝'],
      meaning: '逆位的权杖四表明不稳定或家庭问题。需要建立更稳固的基础。'
    }
  },
  // Cups (圣杯) - 36-49
  {
    id: 36,
    name: '圣杯王牌',
    nameEn: 'Ace of Cups',
    suit: 'cups',
    upright: {
      keywords: ['爱', '新感情', '直觉', '创造力'],
      meaning: '圣杯王牌代表新的情感开始。这是一个充满爱和创造力的时期。'
    },
    reversed: {
      keywords: ['情感封闭', '压抑感情', '创意受阻', '失望'],
      meaning: '逆位的圣杯王牌表明情感封闭或失望。需要打开心扉，接受爱。'
    }
  },
  {
    id: 37,
    name: '圣杯二',
    nameEn: 'Two of Cups',
    suit: 'cups',
    upright: {
      keywords: ['伙伴关系', '和谐', '吸引', '统一'],
      meaning: '圣杯二象征和谐的伙伴关系。这是关于相互尊重和平衡的关系。'
    },
    reversed: {
      keywords: ['不平衡', '破裂关系', '缺乏和谐', '自爱'],
      meaning: '逆位的圣杯二表明关系不平衡或破裂。需要重新建立和谐或关注自爱。'
    }
  },
  // Swords (宝剑) - 50-63
  {
    id: 50,
    name: '宝剑王牌',
    nameEn: 'Ace of Swords',
    suit: 'swords',
    upright: {
      keywords: ['突破', '清晰', '真相', '新想法'],
      meaning: '宝剑王牌代表心智的突破和清晰。这是一个充满新想法和真相的时刻。'
    },
    reversed: {
      keywords: ['混乱', '误解', '暴力沟通', '缺乏清晰'],
      meaning: '逆位的宝剑王牌表明思维混乱或误解。需要寻求清晰和真相。'
    }
  },
  {
    id: 51,
    name: '宝剑二',
    nameEn: 'Two of Swords',
    suit: 'swords',
    upright: {
      keywords: ['僵局', '困难决定', '回避', '平衡'],
      meaning: '宝剑二象征困难的选择和僵局。需要面对决定，不要逃避。'
    },
    reversed: {
      keywords: ['犹豫不决', '信息过载', '混乱', '做出选择'],
      meaning: '逆位的宝剑二表明是时候做出决定了。不要再拖延，选择一条道路。'
    }
  },
  // Pentacles (星币) - 64-77
  {
    id: 64,
    name: '星币王牌',
    nameEn: 'Ace of Pentacles',
    suit: 'pentacles',
    upright: {
      keywords: ['新机会', '繁荣', '物质', '显化'],
      meaning: '星币王牌代表新的物质机会。这是一个繁荣和显化的开始。'
    },
    reversed: {
      keywords: ['错失机会', '缺乏计划', '财务问题', '贪婪'],
      meaning: '逆位的星币王牌表明错失机会或财务问题。需要更好的计划和管理。'
    }
  },
  {
    id: 65,
    name: '星币二',
    nameEn: 'Two of Pentacles',
    suit: 'pentacles',
    upright: {
      keywords: ['平衡', '适应', '时间管理', '灵活'],
      meaning: '星币二象征平衡多个优先事项。保持灵活，适应变化。'
    },
    reversed: {
      keywords: ['失衡', '过度承诺', '混乱', '缺乏优先级'],
      meaning: '逆位的星币二表明生活失衡或过度承诺。需要重新设定优先级。'
    }
  }
];
