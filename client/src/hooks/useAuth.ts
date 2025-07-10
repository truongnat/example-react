import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { httpClient } from '@/lib/http-client'
import { useAuthStore } from '@/stores/authStore'
import type {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto,
} from '@/types/api'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// Get current user query
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) return false
      return failureCount < 3
    },
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()
  const { setUser, setAuthenticated, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginRequestDto) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login mutation onSuccess, received data:', {
        hasUser: !!data.user,
        hasTokens: !!data.tokens,
        accessTokenLength: data.tokens?.accessToken?.length
      })

      // Update auth store
      setUser({
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        avatar: data.user.avatarUrl,
      })
      setAuthenticated(true)
      setTokens(data.tokens)

      // Ensure HTTP client has the tokens (redundant but safe)
      httpClient.setTokens(data.tokens.accessToken, data.tokens.refreshToken)

      // Set user data in query cache
      queryClient.setQueryData(authKeys.me(), data.user)

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient()
  const { setUser, setAuthenticated, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (userData: RegisterRequestDto) => authService.register(userData),
    onSuccess: (data) => {
      // Update auth store
      setUser({
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        avatar: data.user.avatarUrl,
      })
      setAuthenticated(true)
      setTokens(data.tokens)

      // Set user data in query cache
      queryClient.setQueryData(authKeys.me(), data.user)

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout: logoutStore } = useAuthStore()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth store
      logoutStore()
      
      // Clear all queries
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local state
      logoutStore()
      queryClient.clear()
    },
  })
}

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequestDto) => authService.forgotPassword(data),
  })
}

// Verify OTP mutation
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequestDto) => authService.verifyOtp(data),
  })
}

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequestDto) => authService.resetPassword(data),
  })
}

// Change password mutation
export const useChangePassword = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: ChangePasswordRequestDto) => authService.changePassword(data),
    onSuccess: () => {
      // Invalidate user data
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
