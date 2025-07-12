import { CreateRoomUseCase } from '@application/use-cases/chat/CreateRoomUseCase';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { ConflictException, ValidationException } from '@shared/exceptions';
import { RoomFactory } from '../../../../utils/factories';
import { createMockRoomRepository } from '../../../../utils/mocks';

describe('CreateRoomUseCase', () => {
  let createRoomUseCase: CreateRoomUseCase;
  let mockRoomRepository: jest.Mocked<IRoomRepository>;
  const authorId = 'test-author-id';

  beforeEach(() => {
    mockRoomRepository = createMockRoomRepository();
    createRoomUseCase = new CreateRoomUseCase(mockRoomRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validRequest = {
      name: 'Test Room',
      description: 'This is a test room',
      isPrivate: false,
    };

    it('should successfully create a room', async () => {
      // Arrange
      const room = RoomFactory.create({ name: validRequest.name, authorId: authorId });
      mockRoomRepository.existsByName.mockResolvedValue(false);
      mockRoomRepository.create.mockResolvedValue(room);

      // Act
      const result = await createRoomUseCase.execute(validRequest, authorId);

      // Assert
      expect(mockRoomRepository.existsByName).toHaveBeenCalledWith(validRequest.name);
      expect(mockRoomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validRequest.name,
          authorId: authorId,
        })
      );
      expect(result.room).toBeDefined();
      expect(result.room.name).toBe(validRequest.name);
    });

    it('should create room with default avatar if not provided', async () => {
      // Arrange
      const requestWithoutAvatar = {
        name: 'Test Room',
        description: 'Test description',
      };
      const room = RoomFactory.create({ name: requestWithoutAvatar.name, authorId: authorId });
      
      mockRoomRepository.existsByName.mockResolvedValue(false);
      mockRoomRepository.create.mockResolvedValue(room);

      // Act
      const result = await createRoomUseCase.execute(requestWithoutAvatar, authorId);

      // Assert
      expect(mockRoomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          avatarUrl: '', // Default empty string
        })
      );
      expect(result.room).toBeDefined();
    });

    it('should create room with provided avatar URL', async () => {
      // Arrange
      const requestWithAvatar = {
        ...validRequest,
        avatarUrl: 'https://example.com/room-avatar.jpg',
      };
      const room = RoomFactory.create({ name: requestWithAvatar.name, authorId: authorId });
      
      mockRoomRepository.existsByName.mockResolvedValue(false);
      mockRoomRepository.create.mockResolvedValue(room);

      // Act
      const result = await createRoomUseCase.execute(requestWithAvatar, authorId);

      // Assert
      expect(mockRoomRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          avatarUrl: requestWithAvatar.avatarUrl,
        })
      );
      expect(result.room).toBeDefined();
    });

    it('should throw ConflictException when room name already exists', async () => {
      // Arrange
      mockRoomRepository.existsByName.mockResolvedValue(true);

      // Act & Assert
      await expect(createRoomUseCase.execute(validRequest, authorId))
        .rejects.toThrow(ConflictException);

      expect(mockRoomRepository.existsByName).toHaveBeenCalledWith(validRequest.name);
      expect(mockRoomRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    it('should throw ValidationException for empty name', async () => {
      // Arrange
      const invalidRequest = {
        name: '',
        description: 'Test description',
      };

      // Act & Assert
      await expect(createRoomUseCase.execute(invalidRequest, authorId))
        .rejects.toThrow(ValidationException);

      expect(mockRoomRepository.existsByName).not.toHaveBeenCalled();
      expect(mockRoomRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for name that is too long', async () => {
      // Arrange
      const invalidRequest = {
        name: 'a'.repeat(101), // More than 100 characters
      };

      // Act & Assert
      await expect(createRoomUseCase.execute(invalidRequest, authorId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for avatar URL that is too long', async () => {
      // Arrange
      const invalidRequest = {
        name: 'Valid Room Name',
        avatarUrl: 'a'.repeat(501), // More than 500 characters
      };

      // Act & Assert
      await expect(createRoomUseCase.execute(invalidRequest, authorId))
        .rejects.toThrow(ValidationException);
    });



    it('should accept valid room data', async () => {
      // Arrange
      const validRequests = [
        {
          name: 'abc', // Minimum length
          description: 'Valid description',
        },
        {
          name: 'a'.repeat(100), // Maximum length
          description: 'a'.repeat(500), // Maximum description length
        },
        {
          name: 'Valid Room',
          description: 'Valid description',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      ];

      for (const request of validRequests) {
        const room = RoomFactory.create({ name: request.name, authorId: authorId });
        mockRoomRepository.existsByName.mockResolvedValue(false);
        mockRoomRepository.create.mockResolvedValue(room);

        // Act & Assert
        const result = await createRoomUseCase.execute(request, authorId);
        expect(result.room).toBeDefined();
      }
    });
  });

  describe('error handling', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      const validRequest = {
        name: 'Test Room',
        description: 'Test description',
      };
      
      mockRoomRepository.existsByName.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createRoomUseCase.execute(validRequest, authorId))
        .rejects.toThrow('Database error');
    });

    it('should handle create repository errors gracefully', async () => {
      // Arrange
      const validRequest = {
        name: 'Test Room',
        description: 'Test description',
      };
      
      mockRoomRepository.existsByName.mockResolvedValue(false);
      mockRoomRepository.create.mockRejectedValue(new Error('Create error'));

      // Act & Assert
      await expect(createRoomUseCase.execute(validRequest, authorId))
        .rejects.toThrow('Create error');
    });
  });
});
