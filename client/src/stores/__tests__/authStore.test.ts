import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from '../authStore'
import { mockUser, mockAuthTokens } from '@/test/test-utils'

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      tokens: null,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()

      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.tokens).toBeNull()
    })
  })

  describe('setUser', () => {
    it('should set user correctly', () => {
      const { setUser } = useAuthStore.getState()

      setUser(mockUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
    })

    it('should update user data when called multiple times', () => {
      const { setUser } = useAuthStore.getState()

      setUser(mockUser)
      
      const updatedUser = { ...mockUser, name: 'updateduser' }
      setUser(updatedUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(updatedUser)
      expect(state.user?.name).toBe('updateduser')
    })
  })

  describe('setAuthenticated', () => {
    it('should set authentication status correctly', () => {
      const { setAuthenticated } = useAuthStore.getState()

      setAuthenticated(true)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
    })

    it('should toggle authentication status', () => {
      const { setAuthenticated } = useAuthStore.getState()

      setAuthenticated(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      setAuthenticated(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('setTokens', () => {
    it('should set tokens correctly', () => {
      const { setTokens } = useAuthStore.getState()

      setTokens(mockAuthTokens)

      const state = useAuthStore.getState()
      expect(state.tokens).toEqual(mockAuthTokens)
    })

    it('should update tokens when called multiple times', () => {
      const { setTokens } = useAuthStore.getState()

      setTokens(mockAuthTokens)

      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }
      setTokens(newTokens)

      const state = useAuthStore.getState()
      expect(state.tokens).toEqual(newTokens)
    })
  })

  describe('logout', () => {
    it('should clear all auth data', () => {
      const { setUser, setAuthenticated, setTokens, logout } = useAuthStore.getState()

      // Set some auth data first
      setUser(mockUser)
      setAuthenticated(true)
      setTokens(mockAuthTokens)

      // Verify data is set
      let state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
      expect(state.tokens).toEqual(mockAuthTokens)

      // Logout
      logout()

      // Verify data is cleared
      state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.tokens).toBeNull()
    })

    it('should work when called multiple times', () => {
      const { setUser, setAuthenticated, setTokens, logout } = useAuthStore.getState()

      // Set auth data
      setUser(mockUser)
      setAuthenticated(true)
      setTokens(mockAuthTokens)

      // Logout multiple times
      logout()
      logout()
      logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.tokens).toBeNull()
    })
  })

  describe('legacy methods', () => {
    describe('login', () => {
      it('should return false (legacy method)', async () => {
        const { login } = useAuthStore.getState()

        const result = await login('test@example.com', 'password')

        expect(result).toBe(false)
      })
    })

    describe('register', () => {
      it('should return true (legacy method)', async () => {
        const { register } = useAuthStore.getState()

        const result = await register('testuser', 'test@example.com', 'password')

        expect(result).toBe(true)

        // Should also set user and authentication status
        const state = useAuthStore.getState()
        expect(state.user).not.toBeNull()
        expect(state.user?.name).toBe('testuser')
        expect(state.user?.email).toBe('test@example.com')
        expect(state.isAuthenticated).toBe(true)
      })
    })
  })

  describe('persistence', () => {
    it('should persist state changes', () => {
      const { setUser, setAuthenticated, setTokens } = useAuthStore.getState()

      setUser(mockUser)
      setAuthenticated(true)
      setTokens(mockAuthTokens)

      // The store should persist to localStorage
      // Note: The actual persistence is handled by Zustand's persist middleware
      // We can verify the state is correctly set
      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
      expect(state.tokens).toEqual(mockAuthTokens)
    })
  })

  describe('store subscription', () => {
    it('should notify subscribers of state changes', () => {
      const subscriber = vi.fn()
      
      const unsubscribe = useAuthStore.subscribe(subscriber)

      const { setUser } = useAuthStore.getState()
      setUser(mockUser)

      expect(subscriber).toHaveBeenCalled()

      unsubscribe()
    })

    it('should not notify unsubscribed listeners', () => {
      const subscriber = vi.fn()
      
      const unsubscribe = useAuthStore.subscribe(subscriber)
      unsubscribe()

      const { setUser } = useAuthStore.getState()
      setUser(mockUser)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('complete authentication flow', () => {
    it('should handle complete login flow', () => {
      const { setUser, setAuthenticated, setTokens } = useAuthStore.getState()

      // Simulate login
      setUser(mockUser)
      setAuthenticated(true)
      setTokens(mockAuthTokens)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
      expect(state.tokens).toEqual(mockAuthTokens)
    })

    it('should handle complete logout flow', () => {
      const { setUser, setAuthenticated, setTokens, logout } = useAuthStore.getState()

      // Set up authenticated state
      setUser(mockUser)
      setAuthenticated(true)
      setTokens(mockAuthTokens)

      // Logout
      logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.tokens).toBeNull()
    })

    it('should handle profile update', () => {
      const { setUser } = useAuthStore.getState()

      // Set initial user
      setUser(mockUser)

      // Update user profile
      const updatedUser = { ...mockUser, name: 'newusername', email: 'new@example.com' }
      setUser(updatedUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(updatedUser)
      expect(state.user?.name).toBe('newusername')
      expect(state.user?.email).toBe('new@example.com')
    })

    it('should handle token refresh', () => {
      const { setTokens } = useAuthStore.getState()

      // Set initial tokens
      setTokens(mockAuthTokens)

      // Refresh tokens
      const newTokens = {
        accessToken: 'refreshed-access-token',
        refreshToken: 'refreshed-refresh-token',
      }
      setTokens(newTokens)

      const state = useAuthStore.getState()
      expect(state.tokens).toEqual(newTokens)
    })
  })

  describe('edge cases', () => {
    it('should handle setting null user', () => {
      const { setUser } = useAuthStore.getState()

      setUser(mockUser)
      setUser(null)

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
    })

    it('should handle setting null tokens', () => {
      const { setTokens } = useAuthStore.getState()

      setTokens(mockAuthTokens)
      setTokens(null)

      const state = useAuthStore.getState()
      expect(state.tokens).toBeNull()
    })
  })
})
