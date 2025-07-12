import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ITokenService } from '@application/interfaces/ITokenService';
import { RegisterRequestDto } from '@application/dtos/auth.dto';
import { ConflictException, ValidationException } from '@shared/exceptions';
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

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    registerUseCase = new RegisterUseCase(
      mockUserRepository,
      mockPasswordService,
      mockTokenService
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  const validRegisterRequest: RegisterRequestDto = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const mockUser = User.create({
        username: validRegisterRequest.username,
        email: validRegisterRequest.email,
        password: hashedPassword,
        avatarUrl: validRegisterRequest.avatarUrl!,
      });
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockTokenService.generateTokenPair.mockResolvedValue(mockTokens);

      // Act
      const result = await registerUseCase.execute(validRegisterRequest);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validRegisterRequest.email);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(validRegisterRequest.username);
      expect(mockPasswordService.hash).toHaveBeenCalledWith(validRegisterRequest.password);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockTokenService.generateTokenPair).toHaveBeenCalled();

      expect(result).toEqual({
        user: mockUser.toPublicJSON(),
        tokens: mockTokens,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      const existingUser = User.create({
        username: validRegisterRequest.username,
        email: validRegisterRequest.email,
        password: 'hashedpassword',
        avatarUrl: validRegisterRequest.avatarUrl!,
      });
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUseCase.execute(validRegisterRequest))
        .rejects.toThrow(ConflictException);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validRegisterRequest.email);
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      // Arrange
      const existingUser = User.create({
        username: validRegisterRequest.username,
        email: validRegisterRequest.email,
        password: 'hashedpassword',
        avatarUrl: validRegisterRequest.avatarUrl!,
      });
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUseCase.execute(validRegisterRequest))
        .rejects.toThrow(ConflictException);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(validRegisterRequest.username);
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for invalid email', async () => {
      // Arrange
      const invalidRequest = {
        ...validRegisterRequest,
        email: 'invalid-email',
      };

      // Act & Assert
      await expect(registerUseCase.execute(invalidRequest))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for short password', async () => {
      // Arrange
      const invalidRequest = {
        ...validRegisterRequest,
        password: '123',
      };

      // Act & Assert
      await expect(registerUseCase.execute(invalidRequest))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for short username', async () => {
      // Arrange
      const invalidRequest = {
        ...validRegisterRequest,
        username: 'a',
      };

      // Act & Assert
      await expect(registerUseCase.execute(invalidRequest))
        .rejects.toThrow(ValidationException);
    });
  });
});
