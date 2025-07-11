import { UUID } from '@shared/types/common.types';

// Request DTOs
export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

// Response DTOs
export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfileDto {
  id: UUID;
  username: string;
  email: string;
  avatarUrl: string;
  isActive: boolean;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponseDto {
  user: UserProfileDto;
  tokens: AuthTokensDto;
}

export interface RegisterResponseDto {
  user: UserProfileDto;
  tokens: AuthTokensDto;
}

export interface RefreshTokenResponseDto {
  tokens: AuthTokensDto;
}

export interface ForgotPasswordResponseDto {
  message: string;
  otpExpiresIn: number;
}
