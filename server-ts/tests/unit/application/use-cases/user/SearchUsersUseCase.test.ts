import { SearchUsersUseCase } from '@application/use-cases/user/SearchUsersUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserFactory } from '../../../../utils/factories';
import { createMockUserRepository } from '../../../../utils/mocks';
import { createPaginatedResult, createPaginationOptions } from '../../../../utils/helpers';

describe('SearchUsersUseCase', () => {
  let searchUsersUseCase: SearchUsersUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    searchUsersUseCase = new SearchUsersUseCase(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should search users with query', async () => {
      // Arrange
      const users = UserFactory.createMany(3);
      const paginatedResult = createPaginatedResult(users, 1, 10, 3);
      const request = {
        query: 'test',
        page: 1,
        limit: 10,
      };

      mockUserRepository.searchUsers.mockResolvedValue(paginatedResult);

      // Act
      const result = await searchUsersUseCase.execute(request);

      // Assert
      expect(mockUserRepository.searchUsers).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({
          page: 1,
          limit: 10,
          sortBy: 'username',
          sortOrder: 'asc',
        }),
        []
      );
      expect(result.users).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should return active users when no query provided', async () => {
      // Arrange
      const users = UserFactory.createMany(5);
      const paginatedResult = createPaginatedResult(users, 1, 10, 5);
      const request = {
        page: 1,
        limit: 10,
      };

      mockUserRepository.findActiveUsers.mockResolvedValue(paginatedResult);

      // Act
      const result = await searchUsersUseCase.execute(request);

      // Assert
      expect(mockUserRepository.findActiveUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sortBy: 'username',
          sortOrder: 'asc',
        }),
        []
      );
      expect(result.users).toHaveLength(5);
    });

    it('should use default pagination values', async () => {
      // Arrange
      const users = UserFactory.createMany(2);
      const paginatedResult = createPaginatedResult(users, 1, 10, 2);

      mockUserRepository.findActiveUsers.mockResolvedValue(paginatedResult);

      // Act
      const result = await searchUsersUseCase.execute({});

      // Assert
      expect(mockUserRepository.findActiveUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sortBy: 'username',
          sortOrder: 'asc',
        }),
        []
      );
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should exclude specified user IDs', async () => {
      // Arrange
      const users = UserFactory.createMany(3);
      const paginatedResult = createPaginatedResult(users, 1, 10, 3);
      const excludeUserIds = ['user1', 'user2'];
      const request = {
        query: 'test',
        excludeUserIds,
      };

      mockUserRepository.searchUsers.mockResolvedValue(paginatedResult);

      // Act
      await searchUsersUseCase.execute(request);

      // Assert
      expect(mockUserRepository.searchUsers).toHaveBeenCalledWith(
        'test',
        expect.any(Object),
        excludeUserIds
      );
    });

    it('should limit results to maximum of 50', async () => {
      // Arrange
      const users = UserFactory.createMany(50);
      const paginatedResult = createPaginatedResult(users, 1, 50, 50);
      const request = {
        limit: 100, // Request more than max
      };

      mockUserRepository.findActiveUsers.mockResolvedValue(paginatedResult);

      // Act
      await searchUsersUseCase.execute(request);

      // Assert
      expect(mockUserRepository.findActiveUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50, // Should be capped at 50
        }),
        []
      );
    });

    it('should trim whitespace from query', async () => {
      // Arrange
      const users = UserFactory.createMany(1);
      const paginatedResult = createPaginatedResult(users, 1, 10, 1);
      const request = {
        query: '  test query  ',
      };

      mockUserRepository.searchUsers.mockResolvedValue(paginatedResult);

      // Act
      await searchUsersUseCase.execute(request);

      // Assert
      expect(mockUserRepository.searchUsers).toHaveBeenCalledWith(
        'test query', // Trimmed
        expect.any(Object),
        []
      );
    });

    it('should return empty query as active users', async () => {
      // Arrange
      const users = UserFactory.createMany(2);
      const paginatedResult = createPaginatedResult(users, 1, 10, 2);
      const request = {
        query: '   ', // Only whitespace
      };

      mockUserRepository.findActiveUsers.mockResolvedValue(paginatedResult);

      // Act
      await searchUsersUseCase.execute(request);

      // Assert
      expect(mockUserRepository.findActiveUsers).toHaveBeenCalled();
      expect(mockUserRepository.searchUsers).not.toHaveBeenCalled();
    });

    it('should map user data correctly', async () => {
      // Arrange
      const user = UserFactory.create({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      const paginatedResult = createPaginatedResult([user], 1, 10, 1);

      mockUserRepository.findActiveUsers.mockResolvedValue(paginatedResult);

      // Act
      const result = await searchUsersUseCase.execute({});

      // Assert
      expect(result.users[0]).toEqual({
        id: user.id,
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
    });
  });

  describe('error handling', () => {
    it('should handle search repository errors', async () => {
      // Arrange
      mockUserRepository.searchUsers.mockRejectedValue(new Error('Search error'));

      // Act & Assert
      await expect(searchUsersUseCase.execute({ query: 'test' }))
        .rejects.toThrow('Search error');
    });

    it('should handle findActiveUsers repository errors', async () => {
      // Arrange
      mockUserRepository.findActiveUsers.mockRejectedValue(new Error('Find error'));

      // Act & Assert
      await expect(searchUsersUseCase.execute({}))
        .rejects.toThrow('Find error');
    });
  });
});
