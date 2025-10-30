import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export function TarotPage() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [spread, setSpread] = useState('three-card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!question.trim()) {
      setError('请输入你的问题')
      return
    }

    setLoading(true)
    try {
      // 转换 spread 格式：three-card -> threeCard
      const spreadType = spread.split('-').map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('')
      const response = await api.tarotReading({ question, spreadType })
      
      if (response.success && response.data) {
        // 传递完整的数据，包括 cards 和 result
        const resultData = {
          ...response.data.result,
          cards: response.data.cards
        }
        navigate('/result', { state: { result: resultData } })
      } else {
        setError(response.error?.message || '占卜失败，请重试')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🃏</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              塔罗牌占卜
            </h1>
            <p className="text-mystic-200 text-sm sm:text-base px-2">
              通过神秘的塔罗牌，探索你的过去、现在和未来
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                选择牌阵
              </label>
              <select
                value={spread}
                onChange={(e) => setSpread(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="three-card" className="bg-gray-800 text-white">三张牌阵（过去-现在-未来）</option>
                <option value="celtic-cross" className="bg-gray-800 text-white">凯尔特十字牌阵</option>
                <option value="single-card" className="bg-gray-800 text-white">单张牌</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                你的问题
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请输入你想要占卜的问题..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-mystic-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none touch-manipulation"
              />
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm sm:text-base">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
            >
              {loading ? '占卜中...' : '开始占卜'}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-medium mb-2 text-sm sm:text-base">💡 占卜提示</h3>
            <ul className="text-mystic-300 text-xs sm:text-sm space-y-1">
              <li>• 保持内心平静，专注于你的问题</li>
              <li>• 问题应该具体明确</li>
              <li>• 塔罗牌提供的是指引，而非绝对答案</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TarotPage
