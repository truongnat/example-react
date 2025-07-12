import { LogoutUseCase } from '@application/use-cases/auth/LogoutUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { SocketService } from '@infrastructure/external-services/SocketService';
import { NotFoundException } from '@shared/exceptions';
import { User } from '@domain/entities/User';
import { Room } from '@domain/entities/Room';

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

const mockRoomRepository: jest.Mocked<IRoomRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByAuthorId: jest.fn(),
  findByParticipant: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  addParticipant: jest.fn(),
  removeParticipant: jest.fn(),
  updateLastMessage: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
  existsByName: jest.fn(),
  isParticipant: jest.fn(),
  count: jest.fn(),
  countByAuthorId: jest.fn(),
};

const mockSocketService = {
  broadcastUserOfflineToRoom: jest.fn(),
  disconnectUser: jest.fn(),
} as any;

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    logoutUseCase = new LogoutUseCase(
      mockUserRepository,
      mockRoomRepository,
      mockSocketService
    );

    // Reset mocks
    jest.clearAllMocks();
  });

  const userId = 'user-123';

  describe('successful logout', () => {
    it('should logout user successfully and broadcast to rooms', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();
      mockUser.setOnlineStatus(true);

      const mockRoom1 = Room.create({
        name: 'Room 1',
        authorId: 'other-user',
      });
      mockRoom1.addParticipant(userId);

      const mockRoom2 = Room.create({
        name: 'Room 2',
        authorId: userId,
      });

      const mockRoomsResult = {
        data: [mockRoom1, mockRoom2],
        total: 2,
        page: 1,
        limit: 1000,
        totalPages: 1,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockRoomRepository.findByParticipant.mockResolvedValue(mockRoomsResult);

      // Act
      await logoutUseCase.execute(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.isOnline).toBe(false);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      
      expect(mockRoomRepository.findByParticipant).toHaveBeenCalledWith(userId, { page: 1, limit: 1000 });
      
      expect(mockSocketService.broadcastUserOfflineToRoom).toHaveBeenCalledTimes(2);
      expect(mockSocketService.broadcastUserOfflineToRoom).toHaveBeenCalledWith({
        userId: mockUser.id,
        username: mockUser.username,
        roomId: mockRoom1.id,
      });
      expect(mockSocketService.broadcastUserOfflineToRoom).toHaveBeenCalledWith({
        userId: mockUser.id,
        username: mockUser.username,
        roomId: mockRoom2.id,
      });
      
      expect(mockSocketService.disconnectUser).toHaveBeenCalledWith(userId);
    });

    it('should logout user successfully with no rooms', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();
      mockUser.setOnlineStatus(true);

      const mockRoomsResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 1000,
        totalPages: 0,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockRoomRepository.findByParticipant.mockResolvedValue(mockRoomsResult);

      // Act
      await logoutUseCase.execute(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.isOnline).toBe(false);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      
      expect(mockRoomRepository.findByParticipant).toHaveBeenCalledWith(userId, { page: 1, limit: 1000 });
      
      expect(mockSocketService.broadcastUserOfflineToRoom).not.toHaveBeenCalled();
      expect(mockSocketService.disconnectUser).toHaveBeenCalledWith(userId);
    });

    it('should logout user who is already offline', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();
      // User is already offline

      const mockRoomsResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 1000,
        totalPages: 0,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockRoomRepository.findByParticipant.mockResolvedValue(mockRoomsResult);

      // Act
      await logoutUseCase.execute(userId);

      // Assert
      expect(mockUser.isOnline).toBe(false);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(mockSocketService.disconnectUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('error cases', () => {
    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(logoutUseCase.execute(userId))
        .rejects.toThrow(NotFoundException);
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockRoomRepository.findByParticipant).not.toHaveBeenCalled();
      expect(mockSocketService.disconnectUser).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(logoutUseCase.execute(userId))
        .rejects.toThrow('Database error');
    });

    it('should handle user update errors gracefully', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockRejectedValue(new Error('Update error'));

      // Act & Assert
      await expect(logoutUseCase.execute(userId))
        .rejects.toThrow('Update error');
    });

    it('should handle room repository errors gracefully', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockRoomRepository.findByParticipant.mockRejectedValue(new Error('Room repository error'));

      // Act & Assert
      await expect(logoutUseCase.execute(userId))
        .rejects.toThrow('Room repository error');
    });

    it('should continue with socket operations even if room broadcasting fails', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      const mockRoom = Room.create({
        name: 'Room 1',
        authorId: userId,
      });

      const mockRoomsResult = {
        data: [mockRoom],
        total: 1,
        page: 1,
        limit: 1000,
        totalPages: 1,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockRoomRepository.findByParticipant.mockResolvedValue(mockRoomsResult);
      mockSocketService.broadcastUserOfflineToRoom.mockImplementation(() => {
        throw new Error('Socket broadcast error');
      });

      // Act & Assert
      await expect(logoutUseCase.execute(userId))
        .rejects.toThrow('Socket broadcast error');
    });

    it('should handle socket disconnect errors gracefully', async () => {
      // Arrange
      const mockUser = User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      mockUser.activate();

      const mockRoomsResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 1000,
        totalPages: 0,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      mockRoomRepository.findByParticipant.mockResolvedValue(mockRoomsResult);
      mockSocketService.disconnectUser.mockImplementation(() => {
        throw new Error('Socket disconnect error');
      });

      // Act & Assert
      await expect(logoutUseCase.execute(userId))
        .rejects.toThrow('Socket disconnect error');
    });
  });
});
