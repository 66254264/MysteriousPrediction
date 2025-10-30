import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export function YijingPage() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [method, setMethod] = useState('time')
  const [numbers, setNumbers] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!question.trim()) {
      setError('请输入你的问题')
      return
    }

    // 修正 method 值：number -> numbers
    const actualMethod = method === 'number' ? 'numbers' : method
    const data: any = { question, method: actualMethod }
    
    if (method === 'number') {
      const nums = numbers.map(n => parseInt(n)).filter(n => !isNaN(n))
      if (nums.length !== 3) {
        setError('请输入三个数字')
        return
      }
      data.numbers = nums
    }

    setLoading(true)
    try {
      const response = await api.yijingReading(data)
      
      if (response.success && response.data) {
        // 传递完整的数据，包括 hexagram 和 result
        const resultData = {
          ...response.data.result,
          hexagram: {
            name: response.data.primaryHexagram?.chineseName,
            symbol: '☰',
            description: response.data.changingLines?.length > 0 
              ? `第${response.data.changingLines.join('、')}爻动` 
              : '无动爻'
          }
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
          className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📿</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              周易占卜
            </h1>
            <p className="text-mystic-200 text-sm sm:text-base px-2">
              运用古老的周易智慧，通过卦象为你解答人生疑惑
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                起卦方法
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="time" className="bg-gray-800 text-white">时间起卦</option>
                <option value="number" className="bg-gray-800 text-white">数字起卦</option>
              </select>
            </div>

            {method === 'number' && (
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                  请输入三个数字（1-999）
                </label>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="number"
                      min="1"
                      max="999"
                      value={numbers[i]}
                      onChange={(e) => {
                        const newNumbers = [...numbers]
                        newNumbers[i] = e.target.value
                        setNumbers(newNumbers)
                      }}
                      placeholder={`数字 ${i + 1}`}
                      className="w-full px-2 sm:px-3 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-mystic-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                你的问题
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请输入你想要占卜的问题..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-mystic-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none touch-manipulation"
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
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
            >
              {loading ? '起卦中...' : '开始占卜'}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-medium mb-2 text-sm sm:text-base">📖 周易说明</h3>
            <ul className="text-mystic-300 text-xs sm:text-sm space-y-1">
              <li>• 时间起卦：根据当前时间自动生成卦象</li>
              <li>• 数字起卦：通过你提供的数字组合生成卦象</li>
              <li>• 周易共有64卦，每卦都有其独特的含义</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default YijingPage
