import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export function AstrologyPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.birthDate) {
      setError('请输入出生日期')
      return
    }

    setLoading(true)
    try {
      const response = await api.astrologyReading(formData)
      
      if (response.success && response.data) {
        // 传递完整的数据，包括 sign, fortune 和 result
        const resultData = {
          ...response.data.result,
          zodiac: {
            name: response.data.sign?.name,
            symbol: response.data.sign?.nameEn,
            dateRange: `${response.data.sign?.element}象 | ${response.data.sign?.quality}`
          }
        }
        navigate('/result', { state: { result: resultData } })
      } else {
        setError(response.error?.message || '预测失败，请重试')
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
          className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">⭐</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              星座运势
            </h1>
            <p className="text-mystic-200 text-sm sm:text-base px-2">
              根据你的星座和出生信息，了解你的性格特点和未来运势
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                出生日期 *
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                出生时间（可选）
              </label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                出生地点（可选）
              </label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="例如：北京"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-mystic-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
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
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
            >
              {loading ? '分析中...' : '查看运势'}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-medium mb-2 text-sm sm:text-base">✨ 星座说明</h3>
            <ul className="text-mystic-300 text-xs sm:text-sm space-y-1">
              <li>• 出生日期用于确定你的太阳星座</li>
              <li>• 出生时间可以提供更精确的上升星座分析</li>
              <li>• 出生地点影响星盘的宫位计算</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AstrologyPage
