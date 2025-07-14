import { ChangePasswordUseCase } from '@application/use-cases/auth/ChangePasswordUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ChangePasswordRequestDto } from '@application/dtos/auth.dto';
import { UnauthorizedException, ValidationException, NotFoundException } from '@shared/exceptions';
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

describe('ChangePasswordUseCase', () => {
  let changePasswordUseCase: ChangePasswordUseCase;
  let mockUser: User;

  beforeEach(() => {
    changePasswordUseCase = new ChangePasswordUseCase(mockUserRepository, mockPasswordService);
    
    // Create a mock user
    mockUser = User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedCurrentPassword',
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRequest: ChangePasswordRequestDto = {
      currentPassword: 'currentPassword123',
      newPassword: 'NewPassword123',
    };

    it('should change password successfully', async () => {
      // Arrange
      const userId = mockUser.id;
      const initialTokenVersion = mockUser.tokenVersion;
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPasswordService.compare
        .mockResolvedValueOnce(true) // current password is correct
        .mockResolvedValueOnce(false); // new password is different
      mockPasswordService.hash.mockResolvedValue('hashedNewPassword');
      mockUserRepository.update.mockResolvedValue(mockUser);

      // Act
      const result = await changePasswordUseCase.execute(userId, validRequest);

      // Assert
      expect(result.message).toBe('Password changed successfully');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockPasswordService.compare).toHaveBeenCalledWith('currentPassword123', mockUser.password);
      expect(mockPasswordService.compare).toHaveBeenCalledWith('NewPassword123', mockUser.password);
      expect(mockPasswordService.hash).toHaveBeenCalledWith('NewPassword123');
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      
      // Verify token version was incremented
      expect(mockUser.tokenVersion).toBe(initialTokenVersion + 1);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(changePasswordUseCase.execute(userId, validRequest))
        .rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      // Arrange
      const userId = mockUser.id;
      mockUser.deactivate(); // Make user inactive
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(changePasswordUseCase.execute(userId, validRequest))
        .rejects.toThrow(UnauthorizedException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw UnauthorizedException when current password is incorrect', async () => {
      // Arrange
      const userId = mockUser.id;
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValue(false); // current password is incorrect

      // Act & Assert
      await expect(changePasswordUseCase.execute(userId, validRequest))
        .rejects.toThrow(UnauthorizedException);
      expect(mockPasswordService.compare).toHaveBeenCalledWith('currentPassword123', mockUser.password);
    });

    it('should throw ValidationException when new password is same as current', async () => {
      // Arrange
      const userId = mockUser.id;
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPasswordService.compare
        .mockResolvedValueOnce(true) // current password is correct
        .mockResolvedValueOnce(true); // new password is same as current

      // Act & Assert
      await expect(changePasswordUseCase.execute(userId, validRequest))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException when current password is empty', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, currentPassword: '' };

      // Act & Assert
      await expect(changePasswordUseCase.execute(mockUser.id, invalidRequest))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException when new password is too short', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, newPassword: '123' };

      // Act & Assert
      await expect(changePasswordUseCase.execute(mockUser.id, invalidRequest))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException when new password lacks required characters', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, newPassword: 'onlylowercase' };

      // Act & Assert
      await expect(changePasswordUseCase.execute(mockUser.id, invalidRequest))
        .rejects.toThrow(ValidationException);
    });
  });
});
