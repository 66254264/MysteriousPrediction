import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useState } from 'react'

interface PredictionResult {
  title: string
  content: string
  summary?: string
  advice?: string[]
  imagery?: string
  cards?: any[]
  hexagram?: any
  bazi?: any
  zodiac?: any
}

export function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result as PredictionResult
  const [copied, setCopied] = useState(false)
  
  // Swipe gesture support
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Swipe right to go back
    if (info.offset.x > 100 && info.velocity.x > 0) {
      navigate(-1)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white text-xl mb-4">没有找到预测结果</p>
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    const text = `${result.title}\n\n${result.summary || result.content.substring(0, 100)}...`
    
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: text
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x, opacity }}
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl mb-3 sm:mb-4"
            >
              ✨
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 px-2"
            >
              {result.title}
            </motion.h1>
          </div>

          {/* Main Result Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10 mb-4 sm:mb-6"
          >
            {/* Cards Display (for Tarot) */}
            {result.cards && result.cards.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">抽到的牌</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {result.cards.map((card: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="bg-white/10 rounded-lg p-3 sm:p-4 text-center"
                    >
                      <div className="text-3xl sm:text-4xl mb-2">{card.isReversed ? '🔄' : '🃏'}</div>
                      <h3 className="text-white font-bold mb-1 text-sm sm:text-base">{card.name}</h3>
                      <p className="text-mystic-300 text-xs sm:text-sm">
                        {card.isReversed ? '逆位' : '正位'}
                      </p>
                      {card.position && (
                        <p className="text-mystic-400 text-xs mt-1">{card.position}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Hexagram Display (for Yijing) */}
            {result.hexagram && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">卦象</h2>
                <div className="bg-white/10 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{result.hexagram.symbol || '☰'}</div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                    {result.hexagram.name}
                  </h3>
                  <p className="text-mystic-300 text-sm sm:text-base">
                    {result.hexagram.description}
                  </p>
                </div>
              </div>
            )}

            {/* Bazi Display */}
            {result.bazi && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">八字信息</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {['year', 'month', 'day', 'hour'].map((pillar) => (
                    <div key={pillar} className="bg-white/10 rounded-lg p-3 sm:p-4 text-center">
                      <p className="text-mystic-300 text-xs sm:text-sm mb-1">
                        {pillar === 'year' ? '年柱' : pillar === 'month' ? '月柱' : pillar === 'day' ? '日柱' : '时柱'}
                      </p>
                      <p className="text-white font-bold text-sm sm:text-base">
                        {result.bazi[pillar] || '-'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zodiac Display */}
            {result.zodiac && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">星座信息</h2>
                <div className="bg-white/10 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{result.zodiac.symbol}</div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                    {result.zodiac.name}
                  </h3>
                  <p className="text-mystic-300 text-sm sm:text-base">
                    {result.zodiac.dateRange}
                  </p>
                </div>
              </div>
            )}

            {/* Summary */}
            {result.summary && (
              <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">概要</h2>
                <p className="text-mystic-200 leading-relaxed text-sm sm:text-base">
                  {result.summary}
                </p>
              </div>
            )}

            {/* Main Content */}
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">详细解读</h2>
              <div className="text-mystic-200 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {result.content}
              </div>
            </div>

            {/* Advice */}
            {result.advice && result.advice.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">建议</h2>
                <ul className="space-y-2">
                  {result.advice.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-2"
                    >
                      <span className="text-purple-400 mt-1 text-sm sm:text-base">•</span>
                      <span className="text-mystic-200 text-sm sm:text-base">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center"
          >
            <button
              onClick={handleShare}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg transition border border-white/20 flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
            >
              <span>{copied ? '✓ 已复制' : '📤 分享结果'}</span>
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition text-sm sm:text-base touch-manipulation"
            >
              再次占卜
            </button>
            
            <Link
              to="/"
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg transition text-center text-sm sm:text-base touch-manipulation"
            >
              返回首页
            </Link>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 sm:mt-8 text-center"
          >
            <p className="text-mystic-400 text-xs sm:text-sm px-4">
              * 占卜结果仅供娱乐参考，请理性对待
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultPage
