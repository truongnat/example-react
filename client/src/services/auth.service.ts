import { httpClient } from '@/lib/http-client'
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UserProfileDto,
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  VerifyOtpRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto,
  ApiResponse
} from '@/types/api'

export class AuthService {
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await httpClient.post<LoginResponseDto>('/auth/login', credentials)

    // HttpClient already returns ApiResponse<LoginResponseDto>, so response.data is LoginResponseDto
    if (response.success && response.data) {
      // Store tokens in HTTP client
      console.log('Login successful, storing tokens:', {
        hasAccessToken: !!response.data.tokens.accessToken,
        hasRefreshToken: !!response.data.tokens.refreshToken,
        accessTokenLength: response.data.tokens.accessToken?.length
      })

      httpClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      )
      return response.data
    }

    throw new Error(response.message || 'Login failed')
  }

  async register(userData: RegisterRequestDto): Promise<RegisterResponseDto> {
    const response = await httpClient.post<RegisterResponseDto>('/auth/register', userData)

    // HttpClient already returns ApiResponse<RegisterResponseDto>, so response.data is RegisterResponseDto
    if (response.success && response.data) {
      // Store tokens in HTTP client
      httpClient.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      )
      return response.data
    }

    throw new Error(response.message || 'Registration failed')
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.warn('Logout request failed:', error)
    } finally {
      httpClient.clearAuth()
    }
  }

  async getCurrentUser(): Promise<UserProfileDto> {
    const response = await httpClient.get<UserProfileDto>('/auth/me')

    // HttpClient already returns ApiResponse<UserProfileDto>, so response.data is UserProfileDto
    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to get user profile')
  }

  async forgotPassword(email: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    const response = await httpClient.post<ForgotPasswordResponseDto>('/auth/forgot-password', email)

    // HttpClient already returns ApiResponse<ForgotPasswordResponseDto>, so response.data is ForgotPasswordResponseDto
    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to send reset email')
  }

  async verifyOtp(data: VerifyOtpRequestDto): Promise<void> {
    const response = await httpClient.post('/auth/verify-otp', data)

    // HttpClient already returns ApiResponse, so we check response.success directly
    if (!response.success) {
      throw new Error(response.message || 'OTP verification failed')
    }
  }

  async resetPassword(data: ResetPasswordRequestDto): Promise<void> {
    const response = await httpClient.post('/auth/reset-password', data)

    // HttpClient already returns ApiResponse, so we check response.success directly
    if (!response.success) {
      throw new Error(response.message || 'Password reset failed')
    }
  }

  async changePassword(data: ChangePasswordRequestDto): Promise<void> {
    const response = await httpClient.post('/auth/change-password', data)

    // HttpClient already returns ApiResponse, so we check response.success directly
    if (!response.success) {
      throw new Error(response.message || 'Password change failed')
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const parsed = JSON.parse(authData)
        return parsed.state?.isAuthenticated === true && !!parsed.state?.tokens?.accessToken
      }
    } catch (error) {
      console.warn('Failed to check authentication status:', error)
    }
    return false
  }

  async updateProfile(data: UpdateProfileRequestDto): Promise<UserProfileDto> {
    const response = await httpClient.put<UpdateProfileResponseDto>('/auth/profile', data)

    if (response.success && response.data) {
      return response.data.user
    }

    throw new Error(response.message || 'Failed to update profile')
  }
}

// Export singleton instance
export const authService = new AuthService()
