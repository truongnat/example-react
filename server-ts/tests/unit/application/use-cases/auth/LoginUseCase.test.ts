import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ITokenService } from '@application/interfaces/ITokenService';
import { LoginRequestDto } from '@application/dtos/auth.dto';
import { UnauthorizedException, ValidationException } from '@shared/exceptions';
import { User } from '@domain/entities/User';

// Mock implementations
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

const mockPasswordService: jest.Mocked<IPasswordService> = {
  hash: jest.fn(),
  compare: jest.fn(),
  generate: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generateTokenPair: jest.fn(),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  refreshTokens: jest.fn(),
};

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase(
      mockUserRepository,
      mockPasswordService,
      mockTokenService
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  const validLoginRequest: LoginRequestDto = {
    email: 'test@example.com',
    password: 'Password123',
  };

  describe('successful login', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: validLoginRequest.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateTokenPair.mockResolvedValue(mockTokens);
      mockUserRepository.update.mockResolvedValue(mockUser);

      // Act
      const result = await loginUseCase.execute(validLoginRequest);

      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.tokens).toEqual(mockTokens);
      expect(result.user).toEqual(mockUser.toPublicJSON());

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginRequest.email);
      expect(mockPasswordService.compare).toHaveBeenCalledWith(validLoginRequest.password, mockUser.password);
      expect(mockTokenService.generateTokenPair).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(mockUser.isOnline).toBe(true);
    });
  });

  describe('validation errors', () => {
    it('should throw ValidationException for invalid email format', async () => {
      // Arrange
      const invalidRequest = {
        ...validLoginRequest,
        email: 'invalid-email',
      };

      // Act & Assert
      await expect(loginUseCase.execute(invalidRequest))
        .rejects.toThrow(ValidationException);
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for empty email', async () => {
      // Arrange
      const invalidRequest = {
        ...validLoginRequest,
        email: '',
      };

      // Act & Assert
      await expect(loginUseCase.execute(invalidRequest))
        .rejects.toThrow(ValidationException);
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for missing password', async () => {
      // Arrange
      const invalidRequest = {
        ...validLoginRequest,
        password: '',
      };

      // Act & Assert
      await expect(loginUseCase.execute(invalidRequest))
        .rejects.toThrow(ValidationException);
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw ValidationException with multiple errors', async () => {
      // Arrange
      const invalidRequest = {
        email: 'invalid-email',
        password: '',
      };

      // Act & Assert
      try {
        await loginUseCase.execute(invalidRequest);
        fail('Should have thrown ValidationException');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
        expect((error as ValidationException).errors).toHaveLength(2);
        expect((error as ValidationException).errors).toContain('Invalid email format');
        expect((error as ValidationException).errors).toContain('Password is required');
      }
    });
  });

  describe('authentication errors', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginRequest.email);
      expect(mockPasswordService.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      // Arrange
      const inactiveUser = User.create({
        username: 'testuser',
        email: validLoginRequest.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      inactiveUser.deactivate(); // Explicitly deactivate the user

      mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow(UnauthorizedException);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginRequest.email);
      expect(mockPasswordService.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: validLoginRequest.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validLoginRequest.email);
      expect(mockPasswordService.compare).toHaveBeenCalledWith(validLoginRequest.password, mockUser.password);
      expect(mockTokenService.generateTokenPair).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow('Database error');
    });

    it('should handle password service errors gracefully', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: validLoginRequest.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockRejectedValue(new Error('Password service error'));

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow('Password service error');
    });

    it('should handle token service errors gracefully', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: validLoginRequest.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateTokenPair.mockRejectedValue(new Error('Token service error'));

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow('Token service error');
    });

    it('should handle user update errors gracefully', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: validLoginRequest.email,
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateTokenPair.mockResolvedValue(mockTokens);
      mockUserRepository.update.mockRejectedValue(new Error('Update error'));

      // Act & Assert
      await expect(loginUseCase.execute(validLoginRequest))
        .rejects.toThrow('Update error');
    });
  });
});
