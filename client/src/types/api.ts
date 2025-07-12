// Common types
export type UUID = string

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message: string
  errors?: string[]
}

// Auth types
export interface RegisterRequestDto {
  username: string
  email: string
  password: string
  avatarUrl?: string
}

export interface LoginRequestDto {
  email: string
  password: string
}

export interface RefreshTokenRequestDto {
  refreshToken: string
}

export interface ForgotPasswordRequestDto {
  email: string
}

export interface VerifyOtpRequestDto {
  email: string
  otp: string
}

export interface ResetPasswordRequestDto {
  email: string
  otp: string
  newPassword: string
}

export interface ChangePasswordRequestDto {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfileRequestDto {
  username?: string
  avatarUrl?: string
}

export interface UpdateProfileResponseDto {
  user: UserProfileDto
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface UserProfileDto {
  id: UUID
  username: string
  email: string
  avatarUrl: string
  isActive: boolean
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginResponseDto {
  user: UserProfileDto
  tokens: AuthTokensDto
}

export interface RegisterResponseDto {
  user: UserProfileDto
  tokens: AuthTokensDto
}

export interface RefreshTokenResponseDto {
  tokens: AuthTokensDto
}

export interface ForgotPasswordResponseDto {
  message: string
  otpExpiresIn: number
}

// Todo types
export enum TodoStatus {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress', 
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface CreateTodoRequestDto {
  title: string
  content: string
}

export interface UpdateTodoRequestDto {
  title?: string
  content?: string
}

export interface UpdateTodoStatusRequestDto {
  status: TodoStatus
}

export interface GetTodosRequestDto {
  page?: number
  limit?: number
  status?: TodoStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TodoDto {
  id: UUID
  title: string
  content: string
  status: TodoStatus
  userId: UUID
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoResponseDto {
  todo: TodoDto
}

export interface UpdateTodoResponseDto {
  todo: TodoDto
}

export interface GetTodosResponseDto {
  todos: TodoDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Error types
export interface ApiError {
  message: string
  status: number
  errors?: string[]
}
