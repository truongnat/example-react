import { config } from './config'
import type { ApiResponse, ApiError } from '@/types/api'

export class HttpClient {
  private baseURL: string
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor(baseURL: string = config.apiBaseUrl) {
    this.baseURL = baseURL
    this.loadTokensFromStorage()
  }

  private loadTokensFromStorage() {
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const parsed = JSON.parse(authData)
        this.accessToken = parsed.state?.tokens?.accessToken || null
        this.refreshToken = parsed.state?.tokens?.refreshToken || null
      }
    } catch (error) {
      console.warn('Failed to load tokens from storage:', error)
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const parsed = JSON.parse(authData)
        parsed.state.tokens = { accessToken, refreshToken }
        localStorage.setItem('auth-storage', JSON.stringify(parsed))
      }
    } catch (error) {
      console.warn('Failed to save tokens to storage:', error)
    }
  }

  private clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const parsed = JSON.parse(authData)
        delete parsed.state.tokens
        localStorage.setItem('auth-storage', JSON.stringify(parsed))
      }
    } catch (error) {
      console.warn('Failed to clear tokens from storage:', error)
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add authorization header if token exists
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
          try {
            await this.refreshAccessToken()
            // Retry the original request with new token
            return this.request<T>(endpoint, options)
          } catch (refreshError) {
            this.clearTokens()
            throw new ApiError('Session expired. Please login again.', 401)
          }
        }

        throw new ApiError(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.errors
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      )
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.data?.tokens) {
        throw new Error('Invalid refresh token response')
      }

      const { accessToken, refreshToken } = data.data.tokens
      this.saveTokensToStorage(accessToken, refreshToken)
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens()
      throw error
    }
  }

  // Public methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.saveTokensToStorage(accessToken, refreshToken)
  }

  clearAuth() {
    this.clearTokens()
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: string[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Export singleton instance
export const httpClient = new HttpClient()
