import { CreateTodoUseCase } from '@application/use-cases/todo/CreateTodoUseCase';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { CreateTodoRequestDto } from '@application/dtos/todo.dto';
import { ValidationException, ConflictException } from '@shared/exceptions';
import { Todo } from '@domain/entities/Todo';
import { TODO_STATUS } from '@shared/constants';

// Mock implementations
const mockTodoRepository: jest.Mocked<ITodoRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findByStatus: jest.fn(),
  findByUserIdAndStatus: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
  existsByUserIdAndTitle: jest.fn(),
  count: jest.fn(),
  countByUserId: jest.fn(),
  countByStatus: jest.fn(),
  countByUserIdAndStatus: jest.fn(),
};

describe('CreateTodoUseCase', () => {
  let createTodoUseCase: CreateTodoUseCase;

  beforeEach(() => {
    createTodoUseCase = new CreateTodoUseCase(mockTodoRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  const userId = 'user-123';
  const validCreateRequest: CreateTodoRequestDto = {
    title: 'Test Todo',
    content: 'This is a test todo content',
  };

  describe('successful todo creation', () => {
    it('should create todo successfully with valid data', async () => {
      // Arrange
      const mockTodo = Todo.create({
        title: validCreateRequest.title,
        content: validCreateRequest.content,
        userId,
      });

      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockResolvedValue(mockTodo);

      // Act
      const result = await createTodoUseCase.execute(validCreateRequest, userId);

      // Assert
      expect(result).toHaveProperty('todo');
      expect(result.todo.title).toBe(validCreateRequest.title);
      expect(result.todo.content).toBe(validCreateRequest.content);
      expect(result.todo.userId).toBe(userId);
      expect(result.todo.status).toBe(TODO_STATUS.INITIAL);

      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(userId, validCreateRequest.title);
      expect(mockTodoRepository.create).toHaveBeenCalledWith(expect.any(Todo));
    });

    it('should create todo with trimmed title and content', async () => {
      // Arrange
      const requestWithSpaces = {
        title: '  Test Todo  ',
        content: '  This is a test todo content  ',
      };

      const mockTodo = Todo.create({
        title: requestWithSpaces.title.trim(),
        content: requestWithSpaces.content.trim(),
        userId,
      });

      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockResolvedValue(mockTodo);

      // Act
      const result = await createTodoUseCase.execute(requestWithSpaces, userId);

      // Assert
      expect(result.todo.title).toBe('Test Todo');
      expect(result.todo.content).toBe('This is a test todo content');
    });

    it('should create todo with maximum allowed length', async () => {
      // Arrange
      const maxLengthRequest = {
        title: 'a'.repeat(200),
        content: 'b'.repeat(2000),
      };

      const mockTodo = Todo.create({
        title: maxLengthRequest.title,
        content: maxLengthRequest.content,
        userId,
      });

      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockResolvedValue(mockTodo);

      // Act
      const result = await createTodoUseCase.execute(maxLengthRequest, userId);

      // Assert
      expect(result.todo.title).toBe(maxLengthRequest.title);
      expect(result.todo.content).toBe(maxLengthRequest.content);
    });
  });

  describe('validation errors', () => {
    it('should throw ValidationException for empty title', async () => {
      // Arrange
      const invalidRequest = {
        ...validCreateRequest,
        title: '',
      };

      // Act & Assert
      await expect(createTodoUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
      
      expect(mockTodoRepository.existsByUserIdAndTitle).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for whitespace-only title', async () => {
      // Arrange
      const invalidRequest = {
        ...validCreateRequest,
        title: '   ',
      };

      // Act & Assert
      await expect(createTodoUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for title too long', async () => {
      // Arrange
      const invalidRequest = {
        ...validCreateRequest,
        title: 'a'.repeat(201),
      };

      // Act & Assert
      await expect(createTodoUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for empty content', async () => {
      // Arrange
      const invalidRequest = {
        ...validCreateRequest,
        content: '',
      };

      // Act & Assert
      await expect(createTodoUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for content too long', async () => {
      // Arrange
      const invalidRequest = {
        ...validCreateRequest,
        content: 'a'.repeat(2001),
      };

      // Act & Assert
      await expect(createTodoUseCase.execute(invalidRequest, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException with multiple errors', async () => {
      // Arrange
      const invalidRequest = {
        title: '',
        content: '',
      };

      // Act & Assert
      try {
        await createTodoUseCase.execute(invalidRequest, userId);
        fail('Should have thrown ValidationException');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
        expect((error as ValidationException).errors).toHaveLength(2);
        expect((error as ValidationException).errors).toContain('Title is required');
        expect((error as ValidationException).errors).toContain('Content is required');
      }
    });
  });

  describe('conflict errors', () => {
    it('should throw ConflictException when todo with same title exists', async () => {
      // Arrange
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(true);

      // Act & Assert
      await expect(createTodoUseCase.execute(validCreateRequest, userId))
        .rejects.toThrow(ConflictException);
      
      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(userId, validCreateRequest.title);
      expect(mockTodoRepository.create).not.toHaveBeenCalled();
    });

    it('should allow same title for different users', async () => {
      // Arrange
      const anotherUserId = 'user-456';
      const mockTodo = Todo.create({
        title: validCreateRequest.title,
        content: validCreateRequest.content,
        userId: anotherUserId,
      });

      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockResolvedValue(mockTodo);

      // Act
      const result = await createTodoUseCase.execute(validCreateRequest, anotherUserId);

      // Assert
      expect(result.todo.userId).toBe(anotherUserId);
      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(anotherUserId, validCreateRequest.title);
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockTodoRepository.existsByUserIdAndTitle.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createTodoUseCase.execute(validCreateRequest, userId))
        .rejects.toThrow('Database error');
    });

    it('should handle create repository errors gracefully', async () => {
      // Arrange
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockRejectedValue(new Error('Create error'));

      // Act & Assert
      await expect(createTodoUseCase.execute(validCreateRequest, userId))
        .rejects.toThrow('Create error');
    });

    it('should handle special characters in title and content', async () => {
      // Arrange
      const specialCharRequest = {
        title: 'Todo with émojis 🎉 and spëcial chars: @#$%^&*()',
        content: 'Content with émojis 🚀 and spëcial chars: @#$%^&*()',
      };

      const mockTodo = Todo.create({
        title: specialCharRequest.title,
        content: specialCharRequest.content,
        userId,
      });

      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockResolvedValue(mockTodo);

      // Act
      const result = await createTodoUseCase.execute(specialCharRequest, userId);

      // Assert
      expect(result.todo.title).toBe(specialCharRequest.title);
      expect(result.todo.content).toBe(specialCharRequest.content);
    });

    it('should handle different user ID formats', async () => {
      // Arrange
      const uuidUserId = '550e8400-e29b-41d4-a716-446655440000';
      const mockTodo = Todo.create({
        title: validCreateRequest.title,
        content: validCreateRequest.content,
        userId: uuidUserId,
      });

      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.create.mockResolvedValue(mockTodo);

      // Act
      const result = await createTodoUseCase.execute(validCreateRequest, uuidUserId);

      // Assert
      expect(result.todo.userId).toBe(uuidUserId);
      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(uuidUserId, validCreateRequest.title);
    });
  });
});
