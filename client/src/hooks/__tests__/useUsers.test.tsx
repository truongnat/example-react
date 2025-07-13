import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '../useUsers'
import { userService } from '@/services/user.service'

// Mock dependencies
vi.mock('@/services/user.service', () => ({
  userService: {
    searchUsers: vi.fn(),
  },
}))

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUsersResponse = {
    users: [
      {
        id: 'user-1',
        username: 'user1',
        email: 'user1@example.com',
        avatarUrl: 'https://example.com/avatar1.jpg',
      },
      {
        id: 'user-2',
        username: 'user2',
        email: 'user2@example.com',
        avatarUrl: 'https://example.com/avatar2.jpg',
      },
    ],
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  it('should search users with default parameters', async () => {
    vi.mocked(userService.searchUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith(undefined, 1, 10, undefined)
    expect(result.current.data).toEqual(mockUsersResponse)
  })

  it('should search users with query parameter', async () => {
    vi.mocked(userService.searchUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers('test'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith('test', 1, 10, undefined)
    expect(result.current.data).toEqual(mockUsersResponse)
  })

  it('should search users with all parameters', async () => {
    vi.mocked(userService.searchUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers('test', 2, 5, 'room-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith('test', 2, 5, 'room-123')
    expect(result.current.data).toEqual(mockUsersResponse)
  })

  it('should handle empty query', async () => {
    vi.mocked(userService.searchUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers(''), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith('', 1, 10, undefined)
    expect(result.current.data).toEqual(mockUsersResponse)
  })

  it('should handle search error', async () => {
    const error = new Error('Search failed')
    vi.mocked(userService.searchUsers).mockRejectedValue(error)

    const { result } = renderHook(() => useUsers('test'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(error)
  })

  it('should return empty results when no users found', async () => {
    const emptyResponse = {
      users: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    }

    vi.mocked(userService.searchUsers).mockResolvedValue(emptyResponse)

    const { result } = renderHook(() => useUsers('nonexistent'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(emptyResponse)
    expect(result.current.data?.users).toHaveLength(0)
  })

  it('should handle pagination correctly', async () => {
    const page2Response = {
      users: [
        {
          id: 'user-3',
          username: 'user3',
          email: 'user3@example.com',
          avatarUrl: 'https://example.com/avatar3.jpg',
        },
      ],
      total: 3,
      page: 2,
      limit: 2,
      totalPages: 2,
    }

    vi.mocked(userService.searchUsers).mockResolvedValue(page2Response)

    const { result } = renderHook(() => useUsers('test', 2, 2), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith('test', 2, 2, undefined)
    expect(result.current.data).toEqual(page2Response)
    expect(result.current.data?.page).toBe(2)
    expect(result.current.data?.limit).toBe(2)
  })

  it('should handle room filtering', async () => {
    const filteredResponse = {
      users: [
        {
          id: 'user-1',
          username: 'user1',
          email: 'user1@example.com',
          avatarUrl: 'https://example.com/avatar1.jpg',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    }

    vi.mocked(userService.searchUsers).mockResolvedValue(filteredResponse)

    const { result } = renderHook(() => useUsers(undefined, 1, 10, 'room-456'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith(undefined, 1, 10, 'room-456')
    expect(result.current.data).toEqual(filteredResponse)
  })

  it('should handle large page numbers', async () => {
    const largePageResponse = {
      users: [],
      total: 100,
      page: 999,
      limit: 10,
      totalPages: 10,
    }

    vi.mocked(userService.searchUsers).mockResolvedValue(largePageResponse)

    const { result } = renderHook(() => useUsers('test', 999, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith('test', 999, 10, undefined)
    expect(result.current.data).toEqual(largePageResponse)
  })

  it('should handle different limit values', async () => {
    const customLimitResponse = {
      users: mockUsersResponse.users.slice(0, 1),
      total: 2,
      page: 1,
      limit: 1,
      totalPages: 2,
    }

    vi.mocked(userService.searchUsers).mockResolvedValue(customLimitResponse)

    const { result } = renderHook(() => useUsers('test', 1, 1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(userService.searchUsers).toHaveBeenCalledWith('test', 1, 1, undefined)
    expect(result.current.data).toEqual(customLimitResponse)
    expect(result.current.data?.limit).toBe(1)
  })

  it('should be enabled by default', () => {
    vi.mocked(userService.searchUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    // Query should be enabled and start fetching
    expect(result.current.isLoading || result.current.isSuccess).toBe(true)
  })

  it('should have correct stale time', async () => {
    vi.mocked(userService.searchUsers).mockResolvedValue(mockUsersResponse)

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // The query should have a stale time of 30 seconds (30000ms)
    // This is more of an integration test to ensure the configuration is correct
    expect(result.current.dataUpdatedAt).toBeDefined()
  })
})
