import { JoinRoomUseCase } from '@application/use-cases/chat/JoinRoomUseCase';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { NotFoundException } from '@shared/exceptions';
import { RoomFactory } from '../../../../utils/factories';
import { createMockRoomRepository } from '../../../../utils/mocks';

describe('JoinRoomUseCase', () => {
  let joinRoomUseCase: JoinRoomUseCase;
  let mockRoomRepository: jest.Mocked<IRoomRepository>;
  const userId = 'test-user-id';
  const roomId = 'test-room-id';

  beforeEach(() => {
    mockRoomRepository = createMockRoomRepository();
    joinRoomUseCase = new JoinRoomUseCase(mockRoomRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully join a room', async () => {
      // Arrange
      const room = RoomFactory.create({ id: roomId });

      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomRepository.update.mockResolvedValue(room);

      // Act
      const result = await joinRoomUseCase.execute(roomId, userId);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.update).toHaveBeenCalledWith(room);
      expect(result.room).toBeDefined();
    });

    it('should throw NotFoundException when room does not exist', async () => {
      // Arrange
      mockRoomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(joinRoomUseCase.execute(roomId, userId))
        .rejects.toThrow(NotFoundException);

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockRoomRepository.update).not.toHaveBeenCalled();
    });


  });

  describe('error handling', () => {
    it('should handle room repository errors', async () => {
      // Arrange
      mockRoomRepository.findById.mockRejectedValue(new Error('Room database error'));

      // Act & Assert
      await expect(joinRoomUseCase.execute(roomId, userId))
        .rejects.toThrow('Room database error');
    });

    it('should handle update repository errors', async () => {
      // Arrange
      const room = RoomFactory.create({ id: roomId });

      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomRepository.update.mockRejectedValue(new Error('Update error'));

      // Act & Assert
      await expect(joinRoomUseCase.execute(roomId, userId))
        .rejects.toThrow('Update error');
    });
  });
});
