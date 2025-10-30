import { motion } from 'framer-motion'
import { ServiceCard } from '../components/ServiceCard'

const services = [
  {
    title: '塔罗牌占卜',
    description: '通过神秘的塔罗牌，探索你的过去、现在和未来，获得人生的指引。',
    icon: '🃏',
    path: '/divination/tarot',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    title: '星座运势',
    description: '根据你的星座和出生信息，了解你的性格特点和未来运势。',
    icon: '⭐',
    path: '/divination/astrology',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    title: '生辰八字',
    description: '基于中国传统命理学，通过生辰八字分析你的命运和运势。',
    icon: '☯️',
    path: '/divination/bazi',
    gradient: 'from-amber-600 to-orange-600'
  },
  {
    title: '周易占卜',
    description: '运用古老的周易智慧，通过卦象为你解答人生疑惑。',
    icon: '📿',
    path: '/divination/yijing',
    gradient: 'from-emerald-600 to-teal-600'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
}

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center relative z-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            探索神秘的占卜世界
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-mystic-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            通过古老的智慧和现代的技术，为你揭示命运的奥秘
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap px-2"
          >
            <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-mystic-200 text-xs sm:text-sm md:text-base">🌙 准确预测</span>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-mystic-200 text-xs sm:text-sm md:text-base">✨ 个性化分析</span>
            </div>
            <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-mystic-200 text-xs sm:text-sm md:text-base">🔮 多种占卜方式</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              选择你的占卜服务
            </h2>
            <p className="text-mystic-300 text-sm sm:text-base md:text-lg px-4">
              每一种占卜方式都有其独特的智慧和洞察力
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          >
            {services.map((service) => (
              <motion.div key={service.path} variants={itemVariants}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-10 md:mb-12 px-2">
              为什么选择我们
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎯</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">精准预测</h3>
                <p className="text-mystic-300 text-sm sm:text-base">
                  结合传统智慧与现代算法，为你提供准确的预测结果
                </p>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔒</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">隐私保护</h3>
                <p className="text-mystic-300 text-sm sm:text-base">
                  你的个人信息和占卜记录都会被严格保密
                </p>
              </div>
              
              <div className="p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📱</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">随时随地</h3>
                <p className="text-mystic-300 text-sm sm:text-base">
                  支持多种设备，让你随时随地获得占卜服务
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
