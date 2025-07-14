import { RefreshTokenUseCase } from '@application/use-cases/auth/RefreshTokenUseCase';
import { ITokenService } from '@application/interfaces/ITokenService';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { RefreshTokenRequestDto } from '@application/dtos/auth.dto';
import { UnauthorizedException } from '@shared/exceptions';
import { User } from '@domain/entities/User';

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

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(() => {
    refreshTokenUseCase = new RefreshTokenUseCase(
      mockTokenService,
      mockUserRepository
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  const validRefreshRequest: RefreshTokenRequestDto = {
    refreshToken: 'valid-refresh-token',
  };

  const mockTokenPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    tokenVersion: 1,
  };

  const mockNewTokens = {
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
    expiresIn: 3600,
  };

  describe('successful token refresh', () => {
    it('should refresh tokens successfully with valid refresh token', async () => {
      // Arrange
      const mockUser = User.create({
        username: mockTokenPayload.username,
        email: mockTokenPayload.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTokenService.refreshTokens.mockResolvedValue(mockNewTokens);

      // Act
      const result = await refreshTokenUseCase.execute(validRefreshRequest);

      // Assert
      expect(result).toEqual({ tokens: mockNewTokens });
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockTokenPayload.userId);
      expect(mockTokenService.refreshTokens).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
    });

    it('should refresh tokens for online user', async () => {
      // Arrange
      const mockUser = User.create({
        username: mockTokenPayload.username,
        email: mockTokenPayload.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();
      mockUser.setOnlineStatus(true);

      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTokenService.refreshTokens.mockResolvedValue(mockNewTokens);

      // Act
      const result = await refreshTokenUseCase.execute(validRefreshRequest);

      // Assert
      expect(result).toEqual({ tokens: mockNewTokens });
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockTokenPayload.userId);
      expect(mockTokenService.refreshTokens).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
    });
  });

  describe('validation errors', () => {
    it('should throw error for missing refresh token', async () => {
      // Arrange
      const invalidRequest = { refreshToken: '' };

      // Act & Assert
      await expect(refreshTokenUseCase.execute(invalidRequest))
        .rejects.toThrow();
      
      expect(mockTokenService.verifyRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw error for undefined refresh token', async () => {
      // Arrange
      const invalidRequest = {} as RefreshTokenRequestDto;

      // Act & Assert
      await expect(refreshTokenUseCase.execute(invalidRequest))
        .rejects.toThrow();
      
      expect(mockTokenService.verifyRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('authentication errors', () => {
    it('should throw UnauthorizedException for invalid refresh token', async () => {
      // Arrange
      mockTokenService.verifyRefreshToken.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockTokenPayload.userId);
      expect(mockTokenService.refreshTokens).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      // Arrange
      const inactiveUser = User.create({
        username: mockTokenPayload.username,
        email: mockTokenPayload.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      inactiveUser.deactivate(); // Explicitly deactivate the user

      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow(UnauthorizedException);

      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockTokenPayload.userId);
      expect(mockTokenService.refreshTokens).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token refresh fails', async () => {
      // Arrange
      const mockUser = User.create({
        username: mockTokenPayload.username,
        email: mockTokenPayload.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTokenService.refreshTokens.mockRejectedValue(new Error('Token refresh failed'));

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockTokenPayload.userId);
      expect(mockTokenService.refreshTokens).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
    });

    it('should preserve UnauthorizedException from token service', async () => {
      // Arrange
      const unauthorizedError = new UnauthorizedException('Token expired');
      mockTokenService.verifyRefreshToken.mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow(unauthorizedError);
      
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshRequest.refreshToken);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should handle malformed token payload', async () => {
      // Arrange
      const malformedPayload = { userId: null } as any;
      mockTokenService.verifyRefreshToken.mockResolvedValue(malformedPayload);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(validRefreshRequest))
        .rejects.toThrow();
    });

    it('should handle token service returning null tokens', async () => {
      // Arrange
      const mockUser = User.create({
        username: mockTokenPayload.username,
        email: mockTokenPayload.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTokenService.refreshTokens.mockResolvedValue(null as any);

      // Act
      const result = await refreshTokenUseCase.execute(validRefreshRequest);

      // Assert
      expect(result).toEqual({ tokens: null });
    });

    it('should handle different token formats', async () => {
      // Arrange
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const requestWithJwt = { refreshToken: jwtToken };

      const mockUser = User.create({
        username: mockTokenPayload.username,
        email: mockTokenPayload.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockTokenService.verifyRefreshToken.mockResolvedValue(mockTokenPayload);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTokenService.refreshTokens.mockResolvedValue(mockNewTokens);

      // Act
      const result = await refreshTokenUseCase.execute(requestWithJwt);

      // Assert
      expect(result).toEqual({ tokens: mockNewTokens });
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(jwtToken);
    });
  });
});
