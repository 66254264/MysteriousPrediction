import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { api } from '../services/api'

interface PredictionRecord {
  _id: string
  serviceType: 'tarot' | 'astrology' | 'bazi' | 'yijing'
  result: {
    title: string
    summary?: string
    content: string
  }
  createdAt: string
}

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile')
  const [history, setHistory] = useState<PredictionRecord[]>([])
  const [filteredHistory, setFilteredHistory] = useState<PredictionRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory()
    }
  }, [activeTab])

  useEffect(() => {
    filterHistory()
  }, [history, searchQuery, filterType])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await api.getPredictionHistory()
      if (response.success && response.data) {
        setHistory(response.data.records || [])
      }
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterHistory = () => {
    let filtered = [...history]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.serviceType === filterType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(record =>
        record.result.title.toLowerCase().includes(query) ||
        record.result.content.toLowerCase().includes(query) ||
        (record.result.summary && record.result.summary.toLowerCase().includes(query))
      )
    }

    setFilteredHistory(filtered)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleViewResult = (record: PredictionRecord) => {
    navigate('/result', { state: { result: record.result } })
  }

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getServiceName = (type: string) => {
    const names: Record<string, string> = {
      tarot: '塔罗牌',
      astrology: '星座',
      bazi: '八字',
      yijing: '周易'
    }
    return names[type] || type
  }

  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      tarot: '🃏',
      astrology: '⭐',
      bazi: '☯️',
      yijing: '📿'
    }
    return icons[type] || '🔮'
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:py-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">个人中心</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-200 rounded-lg transition border border-red-500/50 text-sm sm:text-base touch-manipulation"
              >
                退出登录
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-white/20 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'profile'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-mystic-300 hover:text-white'
                }`}
              >
                个人档案
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'history'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-mystic-300 hover:text-white'
                }`}
              >
                历史记录
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                    用户名
                  </label>
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base break-all">
                    {user.username}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                    邮箱
                  </label>
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base break-all">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                    注册时间
                  </label>
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base">
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                      最后登录
                    </label>
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base">
                      {formatDate(user.lastLoginAt)}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/20 pt-5 sm:pt-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">个人信息</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {user.profile.birthDate && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                        出生日期
                      </label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base">
                        {formatDate(user.profile.birthDate)}
                      </div>
                    </div>
                  )}

                  {user.profile.birthTime && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                        出生时间
                      </label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base">
                        {user.profile.birthTime}
                      </div>
                    </div>
                  )}

                  {user.profile.birthPlace && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                        出生地点
                      </label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base break-all">
                        {user.profile.birthPlace}
                      </div>
                    </div>
                  )}

                  {user.profile.gender && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-mystic-300 mb-2">
                        性别
                      </label>
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base">
                        {user.profile.gender === 'male' ? '男' : user.profile.gender === 'female' ? '女' : '其他'}
                      </div>
                    </div>
                  )}
                </div>

                {!user.profile.birthDate && !user.profile.birthTime && !user.profile.birthPlace && !user.profile.gender && (
                  <p className="text-mystic-400 italic text-sm sm:text-base">暂无个人信息</p>
                )}
              </div>

                <div className="flex justify-center pt-3 sm:pt-4">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800 transition text-sm sm:text-base touch-manipulation"
                  >
                    返回首页
                  </button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-5 sm:space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索历史记录..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-mystic-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full sm:w-48 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation [&>option]:bg-gray-800 [&>option]:text-white"
                    >
                      <option value="all" className="bg-gray-800 text-white">全部类型</option>
                      <option value="tarot" className="bg-gray-800 text-white">塔罗牌</option>
                      <option value="astrology" className="bg-gray-800 text-white">星座</option>
                      <option value="bazi" className="bg-gray-800 text-white">八字</option>
                      <option value="yijing" className="bg-gray-800 text-white">周易</option>
                    </select>
                  </div>
                </div>

                {/* History List */}
                {loading ? (
                  <div className="text-center py-10 sm:py-12">
                    <div className="text-white text-base sm:text-lg">加载中...</div>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-10 sm:py-12">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔮</div>
                    <p className="text-mystic-300 text-base sm:text-lg px-4">
                      {searchQuery || filterType !== 'all' ? '没有找到匹配的记录' : '还没有占卜记录'}
                    </p>
                    {!searchQuery && filterType === 'all' && (
                      <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition text-sm sm:text-base touch-manipulation"
                      >
                        开始占卜
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredHistory.map((record, index) => (
                      <motion.div
                        key={record._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-lg p-4 sm:p-6 border border-white/10 transition cursor-pointer touch-manipulation"
                        onClick={() => handleViewResult(record)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                            <div className="text-3xl sm:text-4xl flex-shrink-0">
                              {getServiceIcon(record.serviceType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <span className="px-2.5 sm:px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs sm:text-sm inline-block w-fit">
                                  {getServiceName(record.serviceType)}
                                </span>
                                <span className="text-mystic-400 text-xs sm:text-sm">
                                  {formatDateTime(record.createdAt)}
                                </span>
                              </div>
                              <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2 break-words">
                                {record.result.title}
                              </h3>
                              {record.result.summary && (
                                <p className="text-mystic-300 text-xs sm:text-sm line-clamp-2">
                                  {record.result.summary}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-mystic-400 hover:text-white transition text-lg sm:text-xl flex-shrink-0">
                            →
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Stats */}
                {!loading && history.length > 0 && (
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/5 rounded-lg">
                    <h3 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">统计信息</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-400">
                          {history.length}
                        </div>
                        <div className="text-mystic-300 text-xs sm:text-sm">总记录</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-pink-400">
                          {history.filter(r => r.serviceType === 'tarot').length}
                        </div>
                        <div className="text-mystic-300 text-xs sm:text-sm">塔罗牌</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-400">
                          {history.filter(r => r.serviceType === 'astrology').length}
                        </div>
                        <div className="text-mystic-300 text-xs sm:text-sm">星座</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-amber-400">
                          {history.filter(r => r.serviceType === 'bazi').length + 
                           history.filter(r => r.serviceType === 'yijing').length}
                        </div>
                        <div className="text-mystic-300 text-xs sm:text-sm">八字/周易</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
