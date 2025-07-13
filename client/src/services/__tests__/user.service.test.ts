import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '../user.service'
import { httpClient } from '@/lib/http-client'
import { mockApiResponse, mockUser } from '@/test/test-utils'

// Mock the http client
vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}))

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchUsers', () => {
    const mockSearchResponse = {
      users: [
        {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        {
          id: 'user-456',
          username: 'anotheruser',
          email: 'another@example.com',
          avatarUrl: 'https://example.com/avatar2.jpg',
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    }

    it('should search users with default parameters', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers()

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should search users with query parameter', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('test')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10&q=test')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should search users with all parameters', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('test', 2, 5, 'room-123')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=2&limit=5&q=test&roomId=room-123')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should search users with custom page and limit', async () => {
      const customResponse = {
        ...mockSearchResponse,
        page: 3,
        limit: 20,
      }
      const mockResponse = mockApiResponse(customResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers(undefined, 3, 20)

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=3&limit=20')
      expect(result).toEqual(customResponse)
    })

    it('should search users with roomId filter', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers(undefined, 1, 10, 'room-456')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10&roomId=room-456')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should trim query parameter', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('  test query  ')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10&q=test+query')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should not include empty query parameter', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('   ')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should return default response when no data', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers()

      expect(result).toEqual({
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      })
    })

    it('should handle empty search results', async () => {
      const emptyResponse = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }
      const mockResponse = mockApiResponse(emptyResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('nonexistentuser')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10&q=nonexistentuser')
      expect(result).toEqual(emptyResponse)
    })

    it('should handle large page numbers', async () => {
      const largePageResponse = {
        ...mockSearchResponse,
        page: 999,
        users: [],
        total: 0,
        totalPages: 0,
      }
      const mockResponse = mockApiResponse(largePageResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('test', 999, 10)

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=999&limit=10&q=test')
      expect(result).toEqual(largePageResponse)
    })

    it('should handle special characters in query', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('test@example.com')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10&q=test%40example.com')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should handle unicode characters in query', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers('测试用户')

      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=10&q=%E6%B5%8B%E8%AF%95%E7%94%A8%E6%88%B7')
      expect(result).toEqual(mockSearchResponse)
    })

    it('should handle very long query strings', async () => {
      const longQuery = 'a'.repeat(1000)
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await userService.searchUsers(longQuery)

      expect(httpClient.get).toHaveBeenCalledWith(`/users/search?page=1&limit=10&q=${encodeURIComponent(longQuery)}`)
      expect(result).toEqual(mockSearchResponse)
    })

    it('should handle minimum and maximum limit values', async () => {
      const mockResponse = mockApiResponse(mockSearchResponse)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      // Test minimum limit
      await userService.searchUsers('test', 1, 1)
      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=1&q=test')

      // Test maximum reasonable limit
      await userService.searchUsers('test', 1, 100)
      expect(httpClient.get).toHaveBeenCalledWith('/users/search?page=1&limit=100&q=test')
    })
  })
})
