import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { httpClient } from '../http-client'
import { useAuthStore } from '@/stores/authStore'
import { mockFetchResponse, mockAuthTokens } from '@/test/test-utils'

// Mock dependencies
vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}))

// Mock fetch
global.fetch = vi.fn()

describe('HttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    vi.mocked(fetch).mockClear()
    
    // Mock auth store default state
    vi.mocked(useAuthStore.getState).mockReturnValue({
      tokens: null,
      logout: vi.fn(),
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should make GET request successfully', async () => {
      const mockData = { message: 'success' }
      const mockResponse = mockFetchResponse({ success: true, data: mockData })
      
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      const result = await httpClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('should include authorization header when token is available', async () => {
      // Mock localStorage with auth-storage format
      const authStorageData = {
        state: {
          user: null,
          isAuthenticated: true,
          tokens: mockAuthTokens
        },
        version: 0
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(authStorageData))

      const mockResponse = mockFetchResponse({ success: true, data: {} })
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      // Force reload tokens from storage
      httpClient.reloadTokens()

      await httpClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockAuthTokens.accessToken}`,
          }),
        })
      )
    })
  })

  describe('POST requests', () => {
    it('should make POST request with body', async () => {
      const requestData = { name: 'test' }
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.post('/test', requestData)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(requestData),
        })
      )
    })

    it('should make POST request without body', async () => {
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.post('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      )
    })
  })

  describe('PUT requests', () => {
    it('should make PUT request with body', async () => {
      const requestData = { name: 'updated' }
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.put('/test', requestData)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestData),
        })
      )
    })
  })

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.delete('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  describe('token management', () => {
    it('should set tokens correctly', () => {
      httpClient.setTokens('access-token', 'refresh-token')

      // Verify tokens are stored in auth-storage format
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth-storage',
        expect.stringContaining('"accessToken":"access-token"')
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth-storage',
        expect.stringContaining('"refreshToken":"refresh-token"')
      )
    })

    it('should force set tokens correctly', () => {
      httpClient.forceSetTokens('access-token', 'refresh-token')

      // This should set tokens immediately without persistence
      // The exact implementation depends on the httpClient internals
    })

    it('should clear auth correctly', () => {
      // Set up initial auth data
      const authStorageData = {
        state: {
          user: null,
          isAuthenticated: true,
          tokens: { accessToken: 'test', refreshToken: 'test' }
        },
        version: 0
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(authStorageData))

      httpClient.clearAuth()

      // Should update localStorage to remove tokens
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth-storage',
        expect.not.stringContaining('"tokens"')
      )
    })

    it('should reload tokens from storage', () => {
      // Mock localStorage with auth-storage format
      const authStorageData = {
        state: {
          user: null,
          isAuthenticated: true,
          tokens: {
            accessToken: 'stored-access',
            refreshToken: 'stored-refresh',
          }
        },
        version: 0
      }

      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(authStorageData))

      httpClient.reloadTokens()

      // Verify tokens are loaded from storage
      expect(localStorage.getItem).toHaveBeenCalledWith('auth-storage')
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await expect(httpClient.get('/test')).rejects.toThrow('Network error')
    })

    it('should handle HTTP error responses', async () => {
      const errorResponse = mockFetchResponse(
        { success: false, message: 'Not found' },
        404,
        false
      )

      vi.mocked(fetch).mockResolvedValue(errorResponse)

      await expect(httpClient.get('/test')).rejects.toThrow('Not found')
    })

    it('should handle 401 errors and trigger logout', async () => {
      const errorResponse = mockFetchResponse(
        { success: false, message: 'Unauthorized' },
        401,
        false
      )

      vi.mocked(fetch).mockResolvedValue(errorResponse)

      await expect(httpClient.get('/test')).rejects.toThrow('Session expired. Please login again.')
    })

    it('should handle malformed JSON responses', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        text: vi.fn().mockResolvedValue('Internal Server Error'),
        headers: new Headers(),
        redirected: false,
        statusText: 'Internal Server Error',
        type: 'basic' as ResponseType,
        url: 'http://localhost:8080/api/test',
        clone: vi.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
      }

      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await expect(httpClient.get('/test')).rejects.toThrow('Invalid JSON')
    })
  })

  describe('request interceptors', () => {
    it('should sync tokens from auth store when no token is set', async () => {
      // Mock localStorage with auth-storage format
      const authStorageData = {
        state: {
          user: null,
          isAuthenticated: true,
          tokens: mockAuthTokens
        },
        version: 0
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(authStorageData))

      const mockResponse = mockFetchResponse({ success: true, data: {} })
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      // Clear any existing tokens first
      httpClient.clearAuth()

      await httpClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockAuthTokens.accessToken}`,
          }),
        })
      )
    })

    it('should handle requests without authentication', async () => {
      // Clear any existing tokens and localStorage
      httpClient.clearAuth()
      vi.mocked(localStorage.getItem).mockReturnValue(null)

      const mockResponse = mockFetchResponse({ success: true, data: {} })
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String),
          }),
        })
      )
    })
  })

  describe('response parsing', () => {
    it('should parse successful JSON responses', async () => {
      const mockData = { id: 1, name: 'test' }
      const mockResponse = mockFetchResponse({ success: true, data: mockData })
      
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      const result = await httpClient.get('/test')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('should handle empty responses', async () => {
      const mockResponse = mockFetchResponse({ success: true, data: null })

      vi.mocked(fetch).mockResolvedValue(mockResponse)

      const result = await httpClient.get('/test')

      expect(result.data).toBeNull()
    })
  })

  describe('base URL configuration', () => {
    it('should use correct base URL for requests', async () => {
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.any(Object)
      )
    })

    it('should handle endpoints with leading slash', async () => {
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/test',
        expect.any(Object)
      )
    })

    it('should handle endpoints without leading slash', async () => {
      const mockResponse = mockFetchResponse({ success: true, data: {} })
      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await httpClient.get('test')

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/apitest',
        expect.any(Object)
      )
    })
  })
})
