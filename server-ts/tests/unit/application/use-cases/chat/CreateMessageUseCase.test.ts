import { CreateMessageUseCase } from '@application/use-cases/chat/CreateMessageUseCase';
import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { NotFoundException, ForbiddenException, ValidationException } from '@shared/exceptions';
import { MessageFactory, RoomFactory } from '../../../../utils/factories';
import { createMockMessageRepository, createMockRoomRepository } from '../../../../utils/mocks';

describe('CreateMessageUseCase', () => {
  let createMessageUseCase: CreateMessageUseCase;
  let mockMessageRepository: jest.Mocked<IMessageRepository>;
  let mockRoomRepository: jest.Mocked<IRoomRepository>;
  const userId = 'test-user-id';
  const roomId = 'test-room-id';

  beforeEach(() => {
    mockMessageRepository = createMockMessageRepository();
    mockRoomRepository = createMockRoomRepository();
    createMessageUseCase = new CreateMessageUseCase(
      mockMessageRepository,
      mockRoomRepository
    );
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRequest = {
      content: 'Hello, this is a test message!',
      roomId,
    };

    it('should successfully create a message', async () => {
      // Arrange
      const room = RoomFactory.createWithParticipants([userId], { id: roomId });
      const message = MessageFactory.create({
        content: validRequest.content,
        authorId: userId,
        roomId
      });
      
      mockRoomRepository.findById.mockResolvedValue(room);
      mockMessageRepository.create.mockResolvedValue(message);

      // Act
      const result = await createMessageUseCase.execute(validRequest, userId);

      // Assert
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockMessageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: validRequest.content,
          authorId: userId,
          roomId,
        })
      );

      expect(result.message).toBeDefined();
      expect(result.message.content).toBe(validRequest.content);
    });

    it('should throw NotFoundException when room does not exist', async () => {
      // Arrange
      mockRoomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(createMessageUseCase.execute(validRequest, userId))
        .rejects.toThrow(NotFoundException);

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockMessageRepository.create).not.toHaveBeenCalled();

    });

    it('should throw ForbiddenException when user is not a participant', async () => {
      // Arrange
      const room = RoomFactory.createWithParticipants(['other-user-id'], { id: roomId });
      mockRoomRepository.findById.mockResolvedValue(room);

      // Act & Assert
      await expect(createMessageUseCase.execute(validRequest, userId))
        .rejects.toThrow(ForbiddenException);

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(roomId);
      expect(mockMessageRepository.create).not.toHaveBeenCalled();

    });

    it('should allow room owner to send messages', async () => {
      // Arrange
      const room = RoomFactory.create({ id: roomId, authorId: userId });
      const message = MessageFactory.create({
        content: validRequest.content,
        authorId: userId,
        roomId
      });
      
      mockRoomRepository.findById.mockResolvedValue(room);
      mockMessageRepository.create.mockResolvedValue(message);

      // Act
      const result = await createMessageUseCase.execute(validRequest, userId);

      // Assert
      expect(result.message).toBeDefined();
    });


  });

  describe('validation', () => {
    it('should throw ValidationException for empty content', async () => {
      // Arrange
      const invalidRequest = {
        content: '',
        roomId,
      };

      // Act & Assert
      await expect(createMessageUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);

      expect(mockRoomRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for content that is too long', async () => {
      // Arrange
      const invalidRequest = {
        content: 'a'.repeat(2001), // More than 2000 characters
        roomId,
      };

      // Act & Assert
      await expect(createMessageUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for missing roomId', async () => {
      // Arrange
      const invalidRequest = {
        content: 'Valid content',
        roomId: '',
      };

      // Act & Assert
      await expect(createMessageUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should accept valid message content', async () => {
      // Arrange
      const validContents = [
        'a', // Minimum length
        'a'.repeat(1000), // Maximum length
        'Hello, world! 🌍',
        'Message with special chars: @#$%^&*()',
      ];

      for (const content of validContents) {
        const room = RoomFactory.createWithParticipants([userId], { id: roomId });
        const message = MessageFactory.create({ content, authorId: userId, roomId });
        
        mockRoomRepository.findById.mockResolvedValue(room);
        mockMessageRepository.create.mockResolvedValue(message);

        // Act & Assert
        const result = await createMessageUseCase.execute({ content, roomId }, userId);
        expect(result.message.content).toBe(content);
      }
    });
  });

  describe('error handling', () => {
    it('should handle room repository errors', async () => {
      // Arrange
      const validRequest = {
        content: 'Test message',
        roomId,
      };
      
      mockRoomRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createMessageUseCase.execute(validRequest, userId))
        .rejects.toThrow('Database error');
    });

    it('should handle message repository errors', async () => {
      // Arrange
      const validRequest = {
        content: 'Test message',
        roomId,
      };
      const room = RoomFactory.createWithParticipants([userId], { id: roomId });
      
      mockRoomRepository.findById.mockResolvedValue(room);
      mockMessageRepository.create.mockRejectedValue(new Error('Create error'));

      // Act & Assert
      await expect(createMessageUseCase.execute(validRequest, userId))
        .rejects.toThrow('Create error');
    });


  });
});
