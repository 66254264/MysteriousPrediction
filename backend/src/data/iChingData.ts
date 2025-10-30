export interface Hexagram {
  id: number;
  number: number;
  name: string;
  chineseName: string;
  trigrams: {
    upper: string;
    lower: string;
  };
  judgment: string;
  image: string;
  interpretation: {
    general: string;
    career: string;
    relationship: string;
    advice: string;
  };
}

export const hexagrams: Hexagram[] = [
  {
    id: 1,
    number: 1,
    name: 'Qian',
    chineseName: '乾',
    trigrams: { upper: '乾', lower: '乾' },
    judgment: '元亨利贞',
    image: '天行健，君子以自强不息',
    interpretation: {
      general: '乾卦象征天，代表刚健、积极、创造。这是一个充满阳刚之气的卦象，预示着强大的创造力和领导能力。现在是展现你的才能和抱负的时候。',
      career: '事业运势极佳，适合开创新事业或担任领导职位。你的努力会得到认可，但要注意不要过于刚强，学会适时的柔和。',
      relationship: '在感情中要注意平衡，过于强势可能会给对方压力。展现你的温柔一面，关系会更加和谐。',
      advice: '保持积极进取的态度，但也要注意刚柔并济。天道运行不息，你也应该持续努力，自强不息。'
    }
  },
  {
    id: 2,
    number: 2,
    name: 'Kun',
    chineseName: '坤',
    trigrams: { upper: '坤', lower: '坤' },
    judgment: '元亨，利牝马之贞',
    image: '地势坤，君子以厚德载物',
    interpretation: {
      general: '坤卦象征地，代表柔顺、包容、承载。这是一个充满阴柔之气的卦象，强调顺应和包容的智慧。现在是培养耐心和包容心的时候。',
      career: '事业上适合辅助和支持的角色。通过团队合作和服务他人，你会获得成功。不要急于求成，稳扎稳打更为重要。',
      relationship: '感情运势良好，你的包容和理解会让关系更加稳固。保持温柔和耐心，爱情会自然发展。',
      advice: '学习大地的品质，以厚德载物。保持谦逊和包容，顺应自然规律，不要强求。'
    }
  },
  {
    id: 3,
    number: 3,
    name: 'Zhun',
    chineseName: '屯',
    trigrams: { upper: '坎', lower: '震' },
    judgment: '元亨利贞，勿用有攸往',
    image: '云雷屯，君子以经纶',
    interpretation: {
      general: '屯卦象征初生的困难，如同草木破土而出。虽然面临挑战，但蕴含着巨大的生机。这是一个需要耐心和准备的时期。',
      career: '事业处于起步阶段，会遇到一些困难和阻碍。不要急于求成，做好充分准备，等待时机成熟。',
      relationship: '感情可能会经历一些波折，但这是关系成长的必经之路。保持耐心和信心，困难终会过去。',
      advice: '面对困难不要退缩，但也不要盲目前进。做好准备工作，积蓄力量，等待合适的时机。'
    }
  },
  {
    id: 4,
    number: 4,
    name: 'Meng',
    chineseName: '蒙',
    trigrams: { upper: '艮', lower: '坎' },
    judgment: '亨，匪我求童蒙，童蒙求我',
    image: '山下出泉，蒙，君子以果行育德',
    interpretation: {
      general: '蒙卦象征启蒙和学习。就像山下的泉水，虽然初出时混沌，但蕴含着清澈的潜力。这是一个学习和成长的时期。',
      career: '现在是学习新技能和积累经验的好时机。虚心求教，不耻下问，会让你快速成长。',
      relationship: '在感情中保持真诚和纯真。如果有疑惑，不要害怕寻求指导和建议。',
      advice: '保持谦虚的学习态度，主动寻求知识和智慧。通过学习和实践来培养自己的德行。'
    }
  },
  {
    id: 5,
    number: 5,
    name: 'Xu',
    chineseName: '需',
    trigrams: { upper: '坎', lower: '乾' },
    judgment: '有孚，光亨，贞吉',
    image: '云上于天，需，君子以饮食宴乐',
    interpretation: {
      general: '需卦象征等待和准备。就像云聚于天，雨水即将降临。这是一个需要耐心等待的时期，但前景是光明的。',
      career: '事业发展需要等待合适的时机。不要急躁，做好准备工作，机会来临时你就能把握住。',
      relationship: '感情需要时间培养。保持耐心，让关系自然发展，不要强求。',
      advice: '学会等待的智慧。在等待中保持积极的心态，做好准备，时机成熟时自然会有好的结果。'
    }
  },
  {
    id: 6,
    number: 11,
    name: 'Tai',
    chineseName: '泰',
    trigrams: { upper: '坤', lower: '乾' },
    judgment: '小往大来，吉亨',
    image: '天地交泰，后以财成天地之道',
    interpretation: {
      general: '泰卦象征通泰和谐。天地交感，万物生长。这是一个吉祥顺利的卦象，预示着和谐与繁荣。',
      career: '事业运势极佳，一切顺利。你的努力会得到回报，人际关系和谐，合作顺畅。',
      relationship: '感情和谐美满，双方心意相通。这是发展关系或深化感情的好时机。',
      advice: '珍惜当前的顺境，保持谦虚和感恩的心态。在顺利时也要居安思危，为未来做好准备。'
    }
  },
  {
    id: 7,
    number: 12,
    name: 'Pi',
    chineseName: '否',
    trigrams: { upper: '乾', lower: '坤' },
    judgment: '否之匪人，不利君子贞',
    image: '天地不交，否',
    interpretation: {
      general: '否卦象征闭塞不通。天地不交，阴阳隔绝。这是一个需要谨慎的时期，暂时的困难需要耐心应对。',
      career: '事业可能遇到阻碍，计划难以推进。保持低调，积蓄力量，等待时机转变。',
      relationship: '感情可能出现沟通障碍。需要更多的耐心和理解，避免冲突。',
      advice: '在困难时期保持正直和坚守。不要勉强行事，等待时机转变。困难是暂时的，保持信心。'
    }
  },
  {
    id: 8,
    number: 15,
    name: 'Qian',
    chineseName: '谦',
    trigrams: { upper: '坤', lower: '艮' },
    judgment: '亨，君子有终',
    image: '地中有山，谦',
    interpretation: {
      general: '谦卦象征谦虚和低调。山藏于地下，高而不显。这是一个强调谦逊美德的卦象。',
      career: '保持谦虚的态度会让你赢得他人的尊重和支持。低调做事，高调做人，成功会随之而来。',
      relationship: '在感情中保持谦逊和尊重，关系会更加和谐。不要自大，多倾听对方的想法。',
      advice: '谦虚是一种美德，也是一种智慧。保持低调，不骄不躁，终会获得成功。'
    }
  },
  {
    id: 9,
    number: 24,
    name: 'Fu',
    chineseName: '复',
    trigrams: { upper: '坤', lower: '震' },
    judgment: '亨，出入无疾',
    image: '雷在地中，复',
    interpretation: {
      general: '复卦象征回归和复苏。就像冬去春来，生机再现。这是一个新的开始，充满希望的时期。',
      career: '事业开始回暖，之前的困难逐渐消散。这是重新出发的好时机，把握机会。',
      relationship: '感情有复苏的迹象。如果之前有误会，现在是化解的好时机。',
      advice: '把握复苏的机会，重新开始。从过去的经验中学习，以更好的状态迎接未来。'
    }
  },
  {
    id: 10,
    number: 63,
    name: 'Ji Ji',
    chineseName: '既济',
    trigrams: { upper: '坎', lower: '离' },
    judgment: '亨小，利贞',
    image: '水在火上，既济',
    interpretation: {
      general: '既济卦象征事情已经完成。水火相济，达到平衡。但也要警惕，完成之后容易松懈。',
      career: '事业达到一个阶段性的成功。享受成果的同时，也要思考下一步的发展。',
      relationship: '感情稳定和谐。但不要因此而忽视对方，继续用心经营关系。',
      advice: '成功之后要保持警惕，居安思危。继续努力，不要因为一时的成功而松懈。'
    }
  },
  {
    id: 11,
    number: 64,
    name: 'Wei Ji',
    chineseName: '未济',
    trigrams: { upper: '离', lower: '坎' },
    judgment: '亨，小狐汔济，濡其尾',
    image: '火在水上，未济',
    interpretation: {
      general: '未济卦象征事情尚未完成。火在水上，尚未达到平衡。这是一个充满可能性的时期，需要继续努力。',
      career: '事业还在发展中，需要继续努力。不要气馁，坚持下去就会看到成果。',
      relationship: '感情还在发展阶段。保持耐心和信心，继续用心经营。',
      advice: '虽然还未完成，但充满希望。保持努力和耐心，成功就在前方。'
    }
  }
];

// 八卦基本信息
export const trigrams = {
  '乾': { element: '天', nature: '刚健', direction: '西北' },
  '坤': { element: '地', nature: '柔顺', direction: '西南' },
  '震': { element: '雷', nature: '动', direction: '东' },
  '巽': { element: '风', nature: '入', direction: '东南' },
  '坎': { element: '水', nature: '险', direction: '北' },
  '离': { element: '火', nature: '丽', direction: '南' },
  '艮': { element: '山', nature: '止', direction: '东北' },
  '兑': { element: '泽', nature: '悦', direction: '西' }
};
