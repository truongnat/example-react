import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '../auth.service'
import { httpClient } from '@/lib/http-client'
import { mockApiResponse, mockApiError, mockUser, mockAuthTokens } from '@/test/test-utils'
import type {
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileRequestDto,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto,
} from '@/types/api'

// Mock the http client
vi.mock('@/lib/http-client', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    setTokens: vi.fn(),
    clearAuth: vi.fn(),
  },
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    const loginData: LoginRequestDto = {
      email: 'test@example.com',
      password: 'password123',
    }

    it('should login successfully and store tokens', async () => {
      const mockResponse = mockApiResponse({
        user: mockUser,
        tokens: mockAuthTokens,
      })

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await authService.login(loginData)

      expect(httpClient.post).toHaveBeenCalledWith('/auth/login', loginData)
      expect(httpClient.setTokens).toHaveBeenCalledWith(
        mockAuthTokens.accessToken,
        mockAuthTokens.refreshToken
      )
      expect(result).toEqual({
        user: mockUser,
        tokens: mockAuthTokens,
      })
    })

    it('should throw error when login fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Invalid credentials'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials')
      expect(httpClient.setTokens).not.toHaveBeenCalled()
    })

    it('should throw default error when no message provided', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = undefined

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.login(loginData)).rejects.toThrow('Login failed')
    })
  })

  describe('register', () => {
    const registerData: RegisterRequestDto = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    }

    it('should register successfully and store tokens', async () => {
      const mockResponse = mockApiResponse({
        user: mockUser,
        tokens: mockAuthTokens,
      })

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await authService.register(registerData)

      expect(httpClient.post).toHaveBeenCalledWith('/auth/register', registerData)
      expect(httpClient.setTokens).toHaveBeenCalledWith(
        mockAuthTokens.accessToken,
        mockAuthTokens.refreshToken
      )
      expect(result).toEqual({
        user: mockUser,
        tokens: mockAuthTokens,
      })
    })

    it('should throw error when registration fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Email already exists'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.register(registerData)).rejects.toThrow('Email already exists')
      expect(httpClient.setTokens).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('should logout successfully and clear auth', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.logout()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/logout')
      expect(httpClient.clearAuth).toHaveBeenCalled()
    })

    it('should clear auth even when logout request fails', async () => {
      vi.mocked(httpClient.post).mockRejectedValue(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await authService.logout()

      expect(httpClient.clearAuth).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith('Logout request failed:', expect.any(Error))
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockResponse = mockApiResponse(mockUser)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await authService.getCurrentUser()

      expect(httpClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('should throw error when get user fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Unauthorized'

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized')
    })
  })

  describe('forgotPassword', () => {
    const forgotPasswordData: ForgotPasswordRequestDto = {
      email: 'test@example.com',
    }

    it('should send forgot password email successfully', async () => {
      const mockResponse = mockApiResponse({
        message: 'Reset email sent',
      })

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await authService.forgotPassword(forgotPasswordData)

      expect(httpClient.post).toHaveBeenCalledWith('/auth/forgot-password', forgotPasswordData)
      expect(result).toEqual({ message: 'Reset email sent' })
    })

    it('should throw error when forgot password fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Email not found'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.forgotPassword(forgotPasswordData)).rejects.toThrow('Email not found')
    })
  })

  describe('verifyOtp', () => {
    const verifyOtpData: VerifyOtpRequestDto = {
      email: 'test@example.com',
      otp: '123456',
    }

    it('should verify OTP successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.verifyOtp(verifyOtpData)).resolves.not.toThrow()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/verify-otp', verifyOtpData)
    })

    it('should throw error when OTP verification fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Invalid OTP'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.verifyOtp(verifyOtpData)).rejects.toThrow('Invalid OTP')
    })
  })

  describe('resetPassword', () => {
    const resetPasswordData: ResetPasswordRequestDto = {
      email: 'test@example.com',
      otp: '123456',
      newPassword: 'newpassword123',
    }

    it('should reset password successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.resetPassword(resetPasswordData)).resolves.not.toThrow()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/reset-password', resetPasswordData)
    })

    it('should throw error when reset password fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Invalid or expired OTP'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.resetPassword(resetPasswordData)).rejects.toThrow('Invalid or expired OTP')
    })
  })

  describe('changePassword', () => {
    const changePasswordData: ChangePasswordRequestDto = {
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    }

    it('should change password successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.changePassword(changePasswordData)).resolves.not.toThrow()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/change-password', changePasswordData)
    })

    it('should throw error when change password fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Current password is incorrect'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(authService.changePassword(changePasswordData)).rejects.toThrow('Current password is incorrect')
    })
  })

  describe('updateProfile', () => {
    const updateProfileData: UpdateProfileRequestDto = {
      username: 'newusername',
      avatarUrl: 'https://example.com/new-avatar.jpg',
    }

    it('should update profile successfully', async () => {
      const updatedUser = { ...mockUser, name: 'newusername' }
      const mockResponse = mockApiResponse({
        user: updatedUser,
      })

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await authService.updateProfile(updateProfileData)

      expect(httpClient.put).toHaveBeenCalledWith('/auth/profile', updateProfileData)
      expect(result).toEqual(updatedUser)
    })

    it('should throw error when update profile fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Username already taken'

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      await expect(authService.updateProfile(updateProfileData)).rejects.toThrow('Username already taken')
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      const authData = {
        state: {
          isAuthenticated: true,
          tokens: { accessToken: 'valid-token' },
        },
      }
      // Mock localStorage.getItem to return the auth data
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(authData))

      const result = authService.isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when user is not authenticated', () => {
      const authData = {
        state: {
          isAuthenticated: false,
          tokens: null,
        },
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(authData))

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('should return false when no auth data exists', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
    })

    it('should return false when localStorage data is corrupted', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'warn')

      const result = authService.isAuthenticated()

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to check authentication status:', expect.any(Error))
    })
  })
})
