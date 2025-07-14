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
        set({ tokens })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, tokens: null })
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
