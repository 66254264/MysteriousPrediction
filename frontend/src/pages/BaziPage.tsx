import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export function BaziPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    gender: 'male'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.birthDate || !formData.birthTime) {
      setError('请输入完整的出生日期和时间')
      return
    }

    setLoading(true)
    try {
      // 转换 birthTime 格式：从 "14:30" 转换为 { hour: 14, minute: 30 }
      const [hour, minute] = formData.birthTime.split(':').map(Number)
      const requestData = {
        birthDate: formData.birthDate,
        birthTime: { hour, minute },
        name: formData.name || undefined,
        gender: formData.gender
      }
      
      const response = await api.baziReading(requestData)
      
      if (response.success && response.data) {
        // 传递完整的数据，包括 chart, elements 和 result
        const chart = response.data.chart
        const resultData = {
          ...response.data.result,
          bazi: {
            year: chart?.year?.name || '-',
            month: chart?.month?.name || '-',
            day: chart?.day?.name || '-',
            hour: chart?.hour?.name || '-'
          }
        }
        navigate('/result', { state: { result: resultData } })
      } else {
        setError(response.error?.message || '算命失败，请重试')
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
          className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">☯️</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              生辰八字
            </h1>
            <p className="text-mystic-200 text-sm sm:text-base px-2">
              基于中国传统命理学，通过生辰八字分析你的命运和运势
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                姓名（可选）
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入你的姓名"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-mystic-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                出生日期 *
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                出生时间 *
              </label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                性别 *
              </label>
              <div className="flex gap-4 sm:gap-6">
                <label className="flex items-center space-x-2 cursor-pointer touch-manipulation">
                  <input
                    type="radio"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="text-white text-sm sm:text-base">男</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer touch-manipulation">
                  <input
                    type="radio"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="text-white text-sm sm:text-base">女</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm sm:text-base">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:from-amber-800 active:to-orange-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
            >
              {loading ? '计算中...' : '开始算命'}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-medium mb-2 text-sm sm:text-base">🔮 八字说明</h3>
            <ul className="text-mystic-300 text-xs sm:text-sm space-y-1">
              <li>• 八字由年、月、日、时的天干地支组成</li>
              <li>• 出生时间需要精确到时辰（2小时为一个时辰）</li>
              <li>• 八字分析包括五行、十神、大运等</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BaziPage
