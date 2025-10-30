const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Request timeout configuration (Requirement 3.3: <5 seconds)
const REQUEST_TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 2 // Retry failed requests up to 2 times
const RETRY_DELAY = 1000 // 1 second delay between retries

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  message?: string
}

export interface User {
  id: string
  username: string
  email: string
  profile: {
    birthDate?: string
    birthTime?: string
    birthPlace?: string
    gender?: 'male' | 'female' | 'other'
  }
  createdAt: string
  lastLoginAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

class ApiService {
  private abortControllers: Map<string, AbortController> = new Map()

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (includeAuth) {
      const token = localStorage.getItem('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Create a fetch request with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController()
    const id = Math.random().toString(36)
    
    this.abortControllers.set(id, controller)

    const timeoutId = setTimeout(() => {
      controller.abort()
      this.abortControllers.delete(id)
    }, timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      this.abortControllers.delete(id)
      
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      this.abortControllers.delete(id)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接后重试')
      }
      throw error
    }
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest(
    requestFn: () => Promise<Response>,
    retries: number = MAX_RETRIES
  ): Promise<Response> {
    let lastError: Error | null = null

    for (let i = 0; i <= retries; i++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        // Don't retry on timeout or abort
        if (lastError.message.includes('超时') || lastError.name === 'AbortError') {
          throw lastError
        }

        // Don't retry if this is the last attempt
        if (i === retries) {
          throw lastError
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)))
        
        console.log(`Retrying request (attempt ${i + 2}/${retries + 1})...`)
      }
    }

    throw lastError || new Error('Request failed')
  }

  private async handleResponse(response: Response): Promise<ApiResponse> {
    try {
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: 'UNKNOWN_ERROR',
            message: 'An error occurred'
          }
        }
      }

      return data
    } catch (error) {
      // Handle JSON parse errors or network errors
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to communicate with server. Please check your connection.'
        }
      }
    }
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    includeAuth: boolean = false,
    enableRetry: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders(includeAuth)
      
      const requestFn = () => this.fetchWithTimeout(url, {
        ...options,
        headers: { ...headers, ...options.headers }
      })

      const response = enableRetry 
        ? await this.retryRequest(requestFn)
        : await requestFn()
      
      return this.handleResponse(response)
    } catch (error) {
      // Handle network errors
      console.error('API request failed:', error)
      
      const errorMessage = error instanceof Error ? error.message : '网络请求失败'
      
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: errorMessage
        }
      }
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort())
    this.abortControllers.clear()
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      },
      false,
      false // Don't retry registration
    )
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      },
      false,
      false // Don't retry login
    )
  }

  async logout(): Promise<ApiResponse> {
    return this.makeRequest(
      `${API_BASE_URL}/auth/logout`,
      {
        method: 'POST'
      },
      true,
      false // Don't retry logout
    )
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>(
      `${API_BASE_URL}/auth/profile`,
      {
        method: 'GET'
      },
      true,
      true // Retry profile fetch
    )
  }

  // Divination services
  async tarotReading(data: { question: string; spreadType: string; name?: string; birthDate?: string }): Promise<ApiResponse> {
    return this.makeRequest(
      `${API_BASE_URL}/divination/tarot`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      true,
      true // Retry on failure
    )
  }

  async astrologyReading(data: { 
    birthDate: string
    name?: string
  }): Promise<ApiResponse> {
    return this.makeRequest(
      `${API_BASE_URL}/divination/astrology`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      true,
      true // Retry on failure
    )
  }

  async baziReading(data: {
    birthDate: string
    birthTime?: { hour: number; minute: number }
    gender?: string
    name?: string
  }): Promise<ApiResponse> {
    return this.makeRequest(
      `${API_BASE_URL}/divination/bazi`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      true,
      true // Retry on failure
    )
  }

  async yijingReading(data: {
    question: string
    method: string
    timestamp?: string
    numbers?: number[]
  }): Promise<ApiResponse> {
    return this.makeRequest(
      `${API_BASE_URL}/divination/yijing`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      true,
      true // Retry on failure
    )
  }

  async getPredictionHistory(): Promise<ApiResponse> {
    return this.makeRequest(
      `${API_BASE_URL}/divination/history`,
      {
        method: 'GET'
      },
      true,
      true // Retry on failure
    )
  }
}

export const api = new ApiService()
