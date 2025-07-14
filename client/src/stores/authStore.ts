import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthTokensDto } from '@/types/api'
import { isTokenExpired, getTokenInfo, isValidTokenStructure } from '@/lib/token-utils'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  tokens: AuthTokensDto | null
  setUser: (user: User) => void
  setAuthenticated: (authenticated: boolean) => void
  setTokens: (tokens: AuthTokensDto) => void
  logout: () => void
  // Token validation methods
  isTokenValid: () => boolean
  checkTokenExpiration: () => boolean
  getTokenInfo: () => any
  // Legacy methods for backward compatibility
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      tokens: null,

      setUser: (user: User) => {
        set({ user })
      },

      setAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated })
      },

      setTokens: (tokens: AuthTokensDto) => {
        // Validate tokens before setting
        if (tokens.accessToken && !isValidTokenStructure(tokens.accessToken)) {
          console.warn('Invalid access token structure, not setting tokens');
          return;
        }

        if (tokens.refreshToken && !isValidTokenStructure(tokens.refreshToken)) {
          console.warn('Invalid refresh token structure, not setting tokens');
          return;
        }

        // Check if access token is expired
        if (tokens.accessToken && isTokenExpired(tokens.accessToken)) {
          console.warn('Access token is expired, not setting tokens');
          return;
        }

        set({ tokens });

        // Update authentication status based on token validity
        const isValid = tokens.accessToken && !isTokenExpired(tokens.accessToken);
        if (isValid !== get().isAuthenticated) {
          set({ isAuthenticated: isValid });
        }
      },

      logout: () => {
        console.log('Auth store: Logging out user');
        set({ user: null, isAuthenticated: false, tokens: null });

        // Clear localStorage to ensure clean state
        try {
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.warn('Failed to clear auth storage:', error);
        }
      },

      // Token validation methods
      isTokenValid: () => {
        const { tokens } = get();
        if (!tokens?.accessToken) {
          return false;
        }

        return isValidTokenStructure(tokens.accessToken) && !isTokenExpired(tokens.accessToken);
      },

      checkTokenExpiration: () => {
        const { tokens, logout } = get();

        if (!tokens?.accessToken) {
          return false;
        }

        // Check if token is expired
        if (isTokenExpired(tokens.accessToken)) {
          console.log('Auth store: Access token expired, logging out');
          logout();
          return false;
        }

        return true;
      },

      getTokenInfo: () => {
        const { tokens } = get();
        if (!tokens?.accessToken) {
          return null;
        }

        return getTokenInfo(tokens.accessToken);
      },

      // Legacy methods for backward compatibility - these will be deprecated
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock authentication - in real app, this would call your API
        if (email === 'demo@example.com' && password === 'password') {
          const user = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: '/api/placeholder/120/120'
          }

          set({ user, isAuthenticated: true })
          return true
        }

        return false
      },

      register: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock registration - in real app, this would call your API
        const user = {
          id: Date.now().toString(),
          name,
          email,
          avatar: '/api/placeholder/120/120'
        }

        set({ user, isAuthenticated: true })
        return true
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokens: state.tokens
      }),
    }
  )
)
