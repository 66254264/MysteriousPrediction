import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <span className="text-2xl sm:text-3xl">🔮</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              神秘预测
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              to="/"
              className="text-mystic-200 hover:text-white transition"
            >
              首页
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-mystic-200 hover:text-white transition"
                >
                  个人档案
                </Link>
                <div className="flex items-center gap-3 lg:gap-4">
                  <span className="text-mystic-300 text-sm hidden lg:inline">
                    {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 lg:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/20 text-sm"
                  >
                    登出
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/20 text-sm"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-3 lg:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm"
                >
                  注册
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-mystic-200 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  首页
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-mystic-200 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      个人档案
                    </Link>
                    <div className="px-4 py-2 text-mystic-300 text-sm">
                      {user?.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-mystic-200 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-mystic-200 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-center"
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
