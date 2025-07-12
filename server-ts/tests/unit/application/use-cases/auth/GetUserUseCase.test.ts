import { GetUserUseCase } from '@application/use-cases/auth/GetUserUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { NotFoundException } from '@shared/exceptions';
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

describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCase;

  beforeEach(() => {
    getUserUseCase = new GetUserUseCase(mockUserRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  const userId = 'user-123';

  describe('successful user retrieval', () => {
    it('should return user profile for active user', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(result).toEqual(mockUser.toPublicJSON());
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return user profile with default avatar', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(result).toEqual(mockUser.toPublicJSON());
      expect(result.avatarUrl).toBeDefined();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return user profile for online user', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();
      mockUser.setOnlineStatus(true);

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(result).toEqual(mockUser.toPublicJSON());
      expect(result.isOnline).toBe(true);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return user profile for offline user', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();
      mockUser.setOnlineStatus(false);

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(result).toEqual(mockUser.toPublicJSON());
      expect(result.isOnline).toBe(false);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('error cases', () => {
    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(getUserUseCase.execute(userId))
        .rejects.toThrow(NotFoundException);
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user is inactive', async () => {
      // Arrange
      const inactiveUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      inactiveUser.deactivate(); // Explicitly deactivate the user

      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(getUserUseCase.execute(userId))
        .rejects.toThrow(NotFoundException);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException with correct message for missing user', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      try {
        await getUserUseCase.execute(userId);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).message).toBe('User not found');
      }
    });

    it('should throw NotFoundException with correct message for inactive user', async () => {
      // Arrange
      const inactiveUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      inactiveUser.deactivate(); // Explicitly deactivate the user

      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      try {
        await getUserUseCase.execute(userId);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).message).toBe('User account is deactivated');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getUserUseCase.execute(userId))
        .rejects.toThrow('Database error');
    });

    it('should handle different user ID formats', async () => {
      // Arrange
      const uuidUserId = '550e8400-e29b-41d4-a716-446655440000';
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(uuidUserId);

      // Assert
      expect(result).toEqual(mockUser.toPublicJSON());
      expect(mockUserRepository.findById).toHaveBeenCalledWith(uuidUserId);
    });

    it('should not expose sensitive user data', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('avatarUrl');
      expect(result).toHaveProperty('isActive');
      expect(result).toHaveProperty('isOnline');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should handle user with special characters in username', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'test_user-123',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await getUserUseCase.execute(userId);

      // Assert
      expect(result.username).toBe('test_user-123');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
