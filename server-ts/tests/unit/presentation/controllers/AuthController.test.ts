import { AuthController } from '@presentation/controllers/AuthController';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@application/use-cases/auth/LogoutUseCase';
import { GetUserUseCase } from '@application/use-cases/auth/GetUserUseCase';
import { UpdateUserUseCase } from '@application/use-cases/auth/UpdateUserUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/auth/RefreshTokenUseCase';
import { createMockRequest, createMockResponse, createMockNext } from '../../../utils/helpers';
import { HTTP_STATUS } from '@shared/constants';

describe('AuthController', () => {
  let authController: AuthController;
  let mockRegisterUseCase: jest.Mocked<RegisterUseCase>;
  let mockLoginUseCase: jest.Mocked<LoginUseCase>;
  let mockLogoutUseCase: jest.Mocked<LogoutUseCase>;
  let mockGetUserUseCase: jest.Mocked<GetUserUseCase>;
  let mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let mockRefreshTokenUseCase: jest.Mocked<RefreshTokenUseCase>;
  let mockChangePasswordUseCase: any;

  beforeEach(() => {
    mockRegisterUseCase = {
      execute: jest.fn(),
    } as any;

    mockLoginUseCase = {
      execute: jest.fn(),
    } as any;

    mockLogoutUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateUserUseCase = {
      execute: jest.fn(),
    } as any;

    mockRefreshTokenUseCase = {
      execute: jest.fn(),
    } as any;

    mockChangePasswordUseCase = {
      execute: jest.fn(),
    } as any;

    authController = new AuthController(
      mockRegisterUseCase,
      mockLoginUseCase,
      mockLogoutUseCase,
      mockGetUserUseCase,
      mockUpdateUserUseCase,
      mockRefreshTokenUseCase,
      mockChangePasswordUseCase
    );

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      // Arrange
      const req = createMockRequest({
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          avatarUrl: 'https://example.com/avatar.jpg',
          isActive: true,
          isOnline: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          expiresIn: 3600
        },
      };

      mockRegisterUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await authController.register(req as any, res as any, next);

      // Assert
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'User registered successfully',
      });
    });

    it('should handle registration errors', async () => {
      // Arrange
      const req = createMockRequest({
        body: { username: 'testuser', email: 'test@example.com', password: 'password123' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Registration failed');
      mockRegisterUseCase.execute.mockRejectedValue(error);

      // Act
      await authController.register(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          avatarUrl: 'https://example.com/avatar.jpg',
          isActive: true,
          isOnline: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          expiresIn: 3600
        },
      };

      mockLoginUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await authController.login(req as any, res as any, next);

      // Assert
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Login successful',
      });
    });

    it('should handle login errors', async () => {
      // Arrange
      const req = createMockRequest({
        body: { email: 'test@example.com', password: 'wrongpassword' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Invalid credentials');
      mockLoginUseCase.execute.mockRejectedValue(error);

      // Act
      await authController.login(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
        body: { refreshToken: 'refresh-token' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockLogoutUseCase.execute.mockResolvedValue(undefined);

      // Act
      await authController.logout(req as any, res as any, next);

      // Assert
      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith('user-123');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful',
      });
    });

    it('should handle logout errors', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
        body: { refreshToken: 'refresh-token' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Logout failed');
      mockLogoutUseCase.execute.mockRejectedValue(error);

      // Act
      await authController.logout(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMe', () => {
    it('should get current user successfully', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        isActive: true,
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockGetUserUseCase.execute.mockResolvedValue(mockUser);

      // Act
      await authController.me(req as any, res as any, next);

      // Assert
      expect(mockGetUserUseCase.execute).toHaveBeenCalledWith('user-123');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
        message: 'User profile retrieved successfully',
      });
    });

    it('should handle getMe errors', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('User not found');
      mockGetUserUseCase.execute.mockRejectedValue(error);

      // Act
      await authController.me(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
        body: {
          username: 'newusername',
          avatarUrl: 'https://example.com/new-avatar.jpg',
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        user: {
          id: 'user-123',
          username: 'newusername',
          email: 'test@example.com',
          avatarUrl: 'https://example.com/new-avatar.jpg',
          isActive: true,
          isOnline: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      };

      mockUpdateUserUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await authController.updateProfile(req as any, res as any, next);

      // Assert
      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('user-123', req.body);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'User profile updated successfully',
      });
    });

    it('should handle update profile errors', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
        body: { username: 'newusername' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Update failed');
      mockUpdateUserUseCase.execute.mockRejectedValue(error);

      // Act
      await authController.updateProfile(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      const req = createMockRequest({
        body: { refreshToken: 'refresh-token' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        tokens: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 3600
        },
      };

      mockRefreshTokenUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await authController.refresh(req as any, res as any, next);

      // Assert
      expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Token refreshed successfully',
      });
    });

    it('should handle refresh token errors', async () => {
      // Arrange
      const req = createMockRequest({
        body: { refreshToken: 'invalid-token' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Invalid refresh token');
      mockRefreshTokenUseCase.execute.mockRejectedValue(error);

      // Act
      await authController.refresh(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
