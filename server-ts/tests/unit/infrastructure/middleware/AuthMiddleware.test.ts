import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';
import { ITokenService } from '@application/interfaces/ITokenService';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UnauthorizedException } from '@shared/exceptions';
import { User } from '@domain/entities/User';
import { JWTPayload } from '@shared/types/common.types';

// Mock implementations
const mockTokenService: jest.Mocked<ITokenService> = {
  generateTokenPair: jest.fn(),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  refreshTokens: jest.fn(),
};

const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByIds: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  findAll: jest.fn(),
  findActiveUsers: jest.fn(),
  findOnlineUsers: jest.fn(),
  searchUsers: jest.fn(),
  update: jest.fn(),
  updateOnlineStatus: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  exists: jest.fn(),
  existsByEmail: jest.fn(),
  existsByUsername: jest.fn(),
  count: jest.fn(),
};

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockUser: User;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware(mockTokenService, mockUserRepository);
    
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();

    // Create a mock user
    mockUser = User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token and matching token version', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const payload: JWTPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        tokenVersion: mockUser.tokenVersion,
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockResolvedValue(payload);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockTokenService.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(payload.userId);
      expect(mockRequest.user).toEqual({
        id: payload.userId,
        email: payload.email,
        username: payload.username,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject token when token version does not match (token revoked)', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const payload: JWTPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        tokenVersion: 1, // Old token version
      };

      // Simulate password change which increments token version
      mockUser.changePassword('newHashedPassword'); // This increments tokenVersion to 2

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockResolvedValue(payload);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockTokenService.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(payload.userId);
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(mockRequest.user).toBeUndefined();
    });

    it('should reject when user is not found', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const payload: JWTPayload = {
        userId: 'non-existent-user',
        email: 'test@example.com',
        username: 'testuser',
        tokenVersion: 1,
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockResolvedValue(payload);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(mockRequest.user).toBeUndefined();
    });

    it('should reject when user is inactive', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const payload: JWTPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        tokenVersion: mockUser.tokenVersion,
      };

      mockUser.deactivate(); // Make user inactive

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockResolvedValue(payload);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(mockRequest.user).toBeUndefined();
    });

    it('should reject when no authorization header is provided', async () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(mockRequest.user).toBeUndefined();
    });

    it('should reject when authorization header does not start with Bearer', async () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Basic some-token',
      };

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(mockRequest.user).toBeUndefined();
    });

    it('should reject when token verification fails', async () => {
      // Arrange
      const token = 'invalid-jwt-token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockRejectedValue(new UnauthorizedException('Invalid token'));

      // Act
      await authMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockTokenService.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
      expect(mockRequest.user).toBeUndefined();
    });
  });

  describe('optionalAuth', () => {
    it('should set user when valid token with matching token version is provided', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const payload: JWTPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        tokenVersion: mockUser.tokenVersion,
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockResolvedValue(payload);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      await authMiddleware.optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockRequest.user).toEqual({
        id: payload.userId,
        email: payload.email,
        username: payload.username,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should not set user when token version does not match', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const payload: JWTPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        tokenVersion: 1, // Old token version
      };

      // Simulate password change which increments token version
      mockUser.changePassword('newHashedPassword');

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      mockTokenService.verifyAccessToken.mockResolvedValue(payload);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      await authMiddleware.optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user when no token is provided', async () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      await authMiddleware.optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
