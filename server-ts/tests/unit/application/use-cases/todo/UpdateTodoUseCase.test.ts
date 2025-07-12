import { UpdateTodoUseCase } from '@application/use-cases/todo/UpdateTodoUseCase';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { UpdateTodoRequestDto } from '@application/dtos/todo.dto';
import { ValidationException, NotFoundException, ForbiddenException, ConflictException } from '@shared/exceptions';
import { Todo } from '@domain/entities/Todo';

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

describe('UpdateTodoUseCase', () => {
  let updateTodoUseCase: UpdateTodoUseCase;

  beforeEach(() => {
    updateTodoUseCase = new UpdateTodoUseCase(mockTodoRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  const userId = 'user-123';
  const todoId = 'todo-456';
  const otherUserId = 'user-789';

  const createMockTodo = (ownerId: string = userId): Todo => {
    return Todo.create({
      title: 'Original Todo',
      content: 'Original content',
      userId: ownerId,
    });
  };

  describe('successful todo update', () => {
    it('should update todo title successfully', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: 'Updated Todo Title',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.update.mockResolvedValue(mockTodo);

      // Act
      const result = await updateTodoUseCase.execute(todoId, request, userId);

      // Assert
      expect(result.todo.title).toBe('Updated Todo Title');
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(userId, request.title);
      expect(mockTodoRepository.update).toHaveBeenCalledWith(mockTodo);
    });

    it('should update todo content successfully', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        content: 'Updated todo content',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.update.mockResolvedValue(mockTodo);

      // Act
      const result = await updateTodoUseCase.execute(todoId, request, userId);

      // Assert
      expect(result.todo.content).toBe('Updated todo content');
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.existsByUserIdAndTitle).not.toHaveBeenCalled();
      expect(mockTodoRepository.update).toHaveBeenCalledWith(mockTodo);
    });

    it('should update both title and content successfully', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: 'Updated Todo Title',
        content: 'Updated todo content',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.update.mockResolvedValue(mockTodo);

      // Act
      const result = await updateTodoUseCase.execute(todoId, request, userId);

      // Assert
      expect(result.todo.title).toBe('Updated Todo Title');
      expect(result.todo.content).toBe('Updated todo content');
      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(userId, request.title);
    });

    it('should not check for title conflict when title is unchanged', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: 'Original Todo', // Same as current title
        content: 'Updated content',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.update.mockResolvedValue(mockTodo);

      // Act
      await updateTodoUseCase.execute(todoId, request, userId);

      // Assert
      expect(mockTodoRepository.existsByUserIdAndTitle).not.toHaveBeenCalled();
    });

    it('should update todo with trimmed values', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: '  Updated Todo Title  ',
        content: '  Updated content  ',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.update.mockResolvedValue(mockTodo);

      // Act
      const result = await updateTodoUseCase.execute(todoId, request, userId);

      // Assert
      expect(result.todo.title).toBe('Updated Todo Title');
      expect(result.todo.content).toBe('Updated content');
    });
  });

  describe('validation errors', () => {
    it('should throw ValidationException when no fields provided', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {};

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ValidationException);
      
      expect(mockTodoRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationException for empty title', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        title: '',
      };

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for whitespace-only title', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        title: '   ',
      };

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for title too long', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        title: 'a'.repeat(201),
      };

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for empty content', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        content: '',
      };

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for content too long', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        content: 'a'.repeat(2001),
      };

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException with multiple errors', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        title: '',
        content: '',
      };

      // Act & Assert
      try {
        await updateTodoUseCase.execute(todoId, request, userId);
        fail('Should have thrown ValidationException');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
        expect((error as ValidationException).errors).toHaveLength(2);
        expect((error as ValidationException).errors).toContain('Title cannot be empty');
        expect((error as ValidationException).errors).toContain('Content cannot be empty');
      }
    });
  });

  describe('authorization errors', () => {
    it('should throw NotFoundException when todo not found', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        title: 'Updated Title',
      };

      mockTodoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(NotFoundException);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user does not own todo', async () => {
      // Arrange
      const mockTodo = createMockTodo(otherUserId);
      const request: UpdateTodoRequestDto = {
        title: 'Updated Title',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ForbiddenException);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('conflict errors', () => {
    it('should throw ConflictException when new title conflicts with existing todo', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: 'Conflicting Title',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(true);

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow(ConflictException);
      
      expect(mockTodoRepository.existsByUserIdAndTitle).toHaveBeenCalledWith(userId, request.title);
      expect(mockTodoRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      const request: UpdateTodoRequestDto = {
        title: 'Updated Title',
      };

      mockTodoRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow('Database error');
    });

    it('should handle update repository errors gracefully', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: 'Updated Title',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.update.mockRejectedValue(new Error('Update error'));

      // Act & Assert
      await expect(updateTodoUseCase.execute(todoId, request, userId))
        .rejects.toThrow('Update error');
    });

    it('should handle special characters in title and content', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      const request: UpdateTodoRequestDto = {
        title: 'Todo with émojis 🎉 and spëcial chars: @#$%^&*()',
        content: 'Content with émojis 🚀 and spëcial chars: @#$%^&*()',
      };

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.existsByUserIdAndTitle.mockResolvedValue(false);
      mockTodoRepository.update.mockResolvedValue(mockTodo);

      // Act
      const result = await updateTodoUseCase.execute(todoId, request, userId);

      // Assert
      expect(result.todo.title).toBe(request.title);
      expect(result.todo.content).toBe(request.content);
    });
  });
});
