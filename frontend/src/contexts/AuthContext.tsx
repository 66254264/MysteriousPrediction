import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, User } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
        await loadUserProfile()
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await api.getProfile()
      if (response.success && response.data) {
        setUser(response.data.user)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(newUser)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.error?.message || '登录失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: '网络错误，请稍后重试'
      }
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.register(username, email, password)
      
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(newUser)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.error?.message || '注册失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: '网络错误，请稍后重试'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    api.logout().catch(console.error)
  }

  const refreshProfile = async () => {
    await loadUserProfile()
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
