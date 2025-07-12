import { SocketService } from '@infrastructure/external-services/SocketService';
import { Server as SocketIOServer } from 'socket.io';
import { Socket } from 'socket.io';

// Mock Socket.IO
jest.mock('socket.io');

describe('SocketService', () => {
  let socketService: SocketService;
  let mockIo: jest.Mocked<SocketIOServer>;
  let mockSocket: jest.Mocked<Socket>;

  beforeEach(() => {
    // Create mock socket
    mockSocket = {
      id: 'socket-123',
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      broadcast: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      data: {},
    } as any;

    // Create mock io
    mockIo = {
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      emit: jest.fn(),
      sockets: {
        sockets: new Map([['socket-123', mockSocket]]),
      },
    } as any;

    socketService = new SocketService(mockIo);
    jest.clearAllMocks();
  });

  describe('emitToRoom', () => {
    it('should emit event to specific room', () => {
      // Arrange
      const roomId = 'room-123';
      const event = 'test_event';
      const data = { message: 'Hello' };

      // Act
      socketService.emitToRoom(roomId, event, data);

      // Assert
      expect(mockIo.to).toHaveBeenCalledWith(roomId);
      expect(mockIo.to(roomId).emit).toHaveBeenCalledWith(event, data);
    });

    it('should handle empty data', () => {
      // Arrange
      const roomId = 'room-123';
      const event = 'test_event';

      // Act
      socketService.emitToRoom(roomId, event);

      // Assert
      expect(mockIo.to).toHaveBeenCalledWith(roomId);
      expect(mockIo.to(roomId).emit).toHaveBeenCalledWith(event, undefined);
    });
  });

  describe('emitToUser', () => {
    it('should emit event to specific user', () => {
      // Arrange
      const userId = 'user-123';
      const event = 'test_event';
      const data = { message: 'Hello User' };

      // Mock getUserSockets to return socket instances
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket]);

      // Act
      socketService.emitToUser(userId, event, data);

      // Assert
      expect(mockSocket.emit).toHaveBeenCalledWith(event, data);
    });

    it('should handle user with no active sockets', () => {
      // Arrange
      const userId = 'user-456';
      const event = 'test_event';
      const data = { message: 'Hello User' };
      
      // Mock getUserSocketIds to return empty array
      jest.spyOn(socketService, 'getUserSocketIds').mockReturnValue([]);

      // Act
      socketService.emitToUser(userId, event, data);

      // Assert
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should emit to multiple sockets for same user', () => {
      // Arrange
      const userId = 'user-123';
      const event = 'test_event';
      const data = { message: 'Hello User' };

      const mockSocket2 = { ...mockSocket, id: 'socket-456', emit: jest.fn() } as any;

      // Mock getUserSockets to return multiple socket instances
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket, mockSocket2]);

      // Act
      socketService.emitToUser(userId, event, data);

      // Assert
      expect(mockSocket.emit).toHaveBeenCalledWith(event, data);
      expect(mockSocket2.emit).toHaveBeenCalledWith(event, data);
    });
  });

  describe('joinRoom', () => {
    it('should join user sockets to room', () => {
      // Arrange
      const userId = 'user-123';
      const roomId = 'room-123';

      // Mock getUserSockets to return socket instances
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket]);

      // Act
      socketService.joinRoom(userId, roomId);

      // Assert
      expect(mockSocket.join).toHaveBeenCalledWith(roomId);
    });

    it('should handle user with no active sockets', () => {
      // Arrange
      const userId = 'user-456';
      const roomId = 'room-123';

      // Mock getUserSockets to return empty array
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([]);

      // Act
      socketService.joinRoom(userId, roomId);

      // Assert
      expect(mockSocket.join).not.toHaveBeenCalled();
    });
  });

  describe('leaveRoom', () => {
    it('should remove user sockets from room', () => {
      // Arrange
      const userId = 'user-123';
      const roomId = 'room-123';

      // Mock getUserSockets to return socket instances
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket]);

      // Act
      socketService.leaveRoom(userId, roomId);

      // Assert
      expect(mockSocket.leave).toHaveBeenCalledWith(roomId);
    });

    it('should handle user with no active sockets', () => {
      // Arrange
      const userId = 'user-456';
      const roomId = 'room-123';

      // Mock getUserSockets to return empty array
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([]);

      // Act
      socketService.leaveRoom(userId, roomId);

      // Assert
      expect(mockSocket.leave).not.toHaveBeenCalled();
    });
  });

  describe('broadcast', () => {
    it('should broadcast event to all connected clients', () => {
      // Arrange
      const event = 'global_event';
      const data = { announcement: 'Server maintenance' };

      // Act
      socketService.broadcast(event, data);

      // Assert
      expect(mockIo.emit).toHaveBeenCalledWith(event, data);
    });
  });

  describe('getConnectedUsers', () => {
    it('should return list of connected user IDs', () => {
      // Arrange - Simulate users being connected by adding them to the internal map
      (socketService as any).connectedUsers.set('user-123', 'socket-123');
      (socketService as any).connectedUsers.set('user-456', 'socket-456');

      // Act
      const connectedUsers = socketService.getConnectedUsers();

      // Assert
      expect(connectedUsers).toEqual(['user-123', 'user-456']);
    });

    it('should return empty array when no users connected', () => {
      // Arrange - Clear the internal map
      (socketService as any).connectedUsers.clear();

      // Act
      const connectedUsers = socketService.getConnectedUsers();

      // Assert
      expect(connectedUsers).toEqual([]);
    });

    it('should filter out sockets without userId', () => {
      // Arrange - Only add user with valid ID to the internal map
      (socketService as any).connectedUsers.set('user-123', 'socket-123');
      // Don't add user-456 since it has no userId

      // Act
      const connectedUsers = socketService.getConnectedUsers();

      // Assert
      expect(connectedUsers).toEqual(['user-123']);
    });
  });

  describe('getUserSocketIds', () => {
    it('should return socket IDs for specific user', () => {
      // Arrange
      const userId = 'user-123';
      const mockSocket2 = { id: 'socket-456' } as any;

      // Mock getUserSockets to return the sockets
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket, mockSocket2]);

      // Act
      const socketIds = socketService.getUserSocketIds(userId);

      // Assert
      expect(socketIds).toEqual(['socket-123', 'socket-456']);
    });

    it('should return empty array for user with no sockets', () => {
      // Arrange
      const userId = 'user-456';

      // Mock getUserSockets to return empty array
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([]);

      // Act
      const socketIds = socketService.getUserSocketIds(userId);

      // Assert
      expect(socketIds).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle socket.join errors gracefully', () => {
      // Arrange
      const userId = 'user-123';
      const roomId = 'room-123';

      mockSocket.join.mockImplementation(() => {
        throw new Error('Join error');
      });
      // Mock getUserSockets to return socket instances
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket]);

      // Act & Assert - Should not throw
      expect(() => socketService.joinRoom(userId, roomId)).not.toThrow();
    });

    it('should handle socket.emit errors gracefully', () => {
      // Arrange
      const userId = 'user-123';
      const event = 'test_event';
      const data = { message: 'Hello' };

      mockSocket.emit.mockImplementation(() => {
        throw new Error('Emit error');
      });
      // Mock getUserSockets to return socket instances
      jest.spyOn(socketService as any, 'getUserSockets').mockReturnValue([mockSocket]);

      // Act & Assert - Should not throw
      expect(() => socketService.emitToUser(userId, event, data)).not.toThrow();
    });
  });
});
