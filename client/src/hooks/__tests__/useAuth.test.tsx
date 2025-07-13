import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCurrentUser, useLogin, useRegister, useLogout, useUpdateProfile } from '../useAuth'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/authStore'
import { httpClient } from '@/lib/http-client'
import { mockUser, mockAuthTokens } from '@/test/test-utils'

// Mock dependencies
vi.mock('@/services/auth.service', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  },
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/lib/http-client', () => ({
  httpClient: {
    forceSetTokens: vi.fn(),
    setTokens: vi.fn(),
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

describe('useAuth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCurrentUser', () => {
    it('should fetch current user when authenticated', async () => {
      vi.mocked(useAuthStore).mockReturnValue({
        isAuthenticated: true,
      } as any)

      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.getCurrentUser).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockUser)
    })

    it('should not fetch when not authenticated', () => {
      vi.mocked(useAuthStore).mockReturnValue({
        isAuthenticated: false,
      } as any)

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(authService.getCurrentUser).not.toHaveBeenCalled()
    })

    it('should not retry on 401 errors', async () => {
      vi.mocked(useAuthStore).mockReturnValue({
        isAuthenticated: true,
      } as any)

      const error = { status: 401 }
      vi.mocked(authService.getCurrentUser).mockRejectedValue(error)

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // Should not retry on 401
      expect(authService.getCurrentUser).toHaveBeenCalledTimes(1)
    })
  })

  describe('useLogin', () => {
    it('should login successfully and update store', async () => {
      const mockSetUser = vi.fn()
      const mockSetAuthenticated = vi.fn()
      const mockSetTokens = vi.fn()

      vi.mocked(useAuthStore).mockReturnValue({
        setUser: mockSetUser,
        setAuthenticated: mockSetAuthenticated,
        setTokens: mockSetTokens,
      } as any)

      const loginResponse = {
        user: {
          id: mockUser.id,
          username: mockUser.name,
          email: mockUser.email,
          avatarUrl: mockUser.avatar,
        },
        tokens: mockAuthTokens,
      }

      vi.mocked(authService.login).mockResolvedValue(loginResponse)

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      })

      const loginData = { email: 'test@example.com', password: 'password' }
      result.current.mutate(loginData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.login).toHaveBeenCalledWith(loginData)
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true)
      expect(mockSetTokens).toHaveBeenCalledWith(mockAuthTokens)
      expect(httpClient.forceSetTokens).toHaveBeenCalledWith(
        mockAuthTokens.accessToken,
        mockAuthTokens.refreshToken
      )
      expect(httpClient.setTokens).toHaveBeenCalledWith(
        mockAuthTokens.accessToken,
        mockAuthTokens.refreshToken
      )
    })

    it('should handle login error', async () => {
      vi.mocked(useAuthStore).mockReturnValue({
        setUser: vi.fn(),
        setAuthenticated: vi.fn(),
        setTokens: vi.fn(),
      } as any)

      const error = new Error('Invalid credentials')
      vi.mocked(authService.login).mockRejectedValue(error)

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      })

      const loginData = { email: 'test@example.com', password: 'wrong' }
      result.current.mutate(loginData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })

  describe('useRegister', () => {
    it('should register successfully and update store', async () => {
      const mockSetUser = vi.fn()
      const mockSetAuthenticated = vi.fn()
      const mockSetTokens = vi.fn()

      vi.mocked(useAuthStore).mockReturnValue({
        setUser: mockSetUser,
        setAuthenticated: mockSetAuthenticated,
        setTokens: mockSetTokens,
      } as any)

      const registerResponse = {
        user: {
          id: mockUser.id,
          username: mockUser.name,
          email: mockUser.email,
          avatarUrl: mockUser.avatar,
        },
        tokens: mockAuthTokens,
      }

      vi.mocked(authService.register).mockResolvedValue(registerResponse)

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      })

      const registerData = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'password',
      }
      result.current.mutate(registerData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.register).toHaveBeenCalledWith(registerData)
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true)
      expect(mockSetTokens).toHaveBeenCalledWith(mockAuthTokens)
    })

    it('should handle register error', async () => {
      vi.mocked(useAuthStore).mockReturnValue({
        setUser: vi.fn(),
        setAuthenticated: vi.fn(),
        setTokens: vi.fn(),
      } as any)

      const error = new Error('Email already exists')
      vi.mocked(authService.register).mockRejectedValue(error)

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      })

      const registerData = {
        name: 'testuser',
        email: 'existing@example.com',
        password: 'password',
      }
      result.current.mutate(registerData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })

  describe('useLogout', () => {
    it('should logout successfully and clear store', async () => {
      const mockLogout = vi.fn()

      vi.mocked(useAuthStore).mockReturnValue({
        logout: mockLogout,
      } as any)

      vi.mocked(authService.logout).mockResolvedValue()

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.logout).toHaveBeenCalled()
      expect(mockLogout).toHaveBeenCalled()
    })

    it('should handle logout error', async () => {
      const mockLogout = vi.fn()

      vi.mocked(useAuthStore).mockReturnValue({
        logout: mockLogout,
      } as any)

      const error = new Error('Logout failed')
      vi.mocked(authService.logout).mockRejectedValue(error)

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
      // Should still clear store even on error
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  describe('useUpdateProfile', () => {
    it('should update profile successfully', async () => {
      const mockSetUser = vi.fn()
      vi.mocked(useAuthStore).mockReturnValue({
        setUser: mockSetUser,
      } as any)

      const updatedUser = {
        id: mockUser.id,
        username: 'updateduser',
        email: mockUser.email,
        avatarUrl: mockUser.avatar,
        isActive: true,
        isOnline: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      vi.mocked(authService.updateProfile).mockResolvedValue(updatedUser)

      const { result } = renderHook(() => useUpdateProfile(), {
        wrapper: createWrapper(),
      })

      const updateData = { username: 'updateduser' }
      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(authService.updateProfile).toHaveBeenCalledWith(updateData)
      expect(result.current.data).toEqual(updatedUser)
      expect(mockSetUser).toHaveBeenCalledWith({
        id: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatarUrl,
      })
    })

    it('should handle update profile error', async () => {
      const error = new Error('Update failed')
      vi.mocked(authService.updateProfile).mockRejectedValue(error)

      const { result } = renderHook(() => useUpdateProfile(), {
        wrapper: createWrapper(),
      })

      const updateData = { username: 'invalid' }
      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })
})
