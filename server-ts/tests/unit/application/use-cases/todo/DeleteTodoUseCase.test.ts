import { DeleteTodoUseCase } from '@application/use-cases/todo/DeleteTodoUseCase';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';
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

describe('DeleteTodoUseCase', () => {
  let deleteTodoUseCase: DeleteTodoUseCase;

  beforeEach(() => {
    deleteTodoUseCase = new DeleteTodoUseCase(mockTodoRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  const userId = 'user-123';
  const todoId = 'todo-456';
  const otherUserId = 'user-789';

  const createMockTodo = (ownerId: string = userId): Todo => {
    return Todo.create({
      title: 'Test Todo',
      content: 'Test content',
      userId: ownerId,
    });
  };

  describe('successful todo deletion', () => {
    it('should delete todo successfully when user owns it', async () => {
      // Arrange
      const mockTodo = createMockTodo();

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteTodoUseCase.execute(todoId, userId);

      // Assert
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    });

    it('should delete todo with different statuses', async () => {
      // Arrange
      const mockTodo = createMockTodo();
      mockTodo.markAsTodo();
      mockTodo.markAsDone();

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteTodoUseCase.execute(todoId, userId);

      // Assert
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    });

    it('should delete todo regardless of content length', async () => {
      // Arrange
      const mockTodo = Todo.create({
        title: 'a'.repeat(200),
        content: 'b'.repeat(2000),
        userId,
      });

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteTodoUseCase.execute(todoId, userId);

      // Assert
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    });
  });

  describe('authorization errors', () => {
    it('should throw NotFoundException when todo not found', async () => {
      // Arrange
      mockTodoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteTodoUseCase.execute(todoId, userId))
        .rejects.toThrow(NotFoundException);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException with correct message', async () => {
      // Arrange
      mockTodoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      try {
        await deleteTodoUseCase.execute(todoId, userId);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).message).toBe('Todo not found');
      }
    });

    it('should throw ForbiddenException when user does not own todo', async () => {
      // Arrange
      const mockTodo = createMockTodo(otherUserId);

      mockTodoRepository.findById.mockResolvedValue(mockTodo);

      // Act & Assert
      await expect(deleteTodoUseCase.execute(todoId, userId))
        .rejects.toThrow(ForbiddenException);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException with correct message', async () => {
      // Arrange
      const mockTodo = createMockTodo(otherUserId);

      mockTodoRepository.findById.mockResolvedValue(mockTodo);

      // Act & Assert
      try {
        await deleteTodoUseCase.execute(todoId, userId);
        fail('Should have thrown ForbiddenException');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect((error as ForbiddenException).message).toBe('You can only delete your own todos');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle repository findById errors gracefully', async () => {
      // Arrange
      mockTodoRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(deleteTodoUseCase.execute(todoId, userId))
        .rejects.toThrow('Database error');
      
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository delete errors gracefully', async () => {
      // Arrange
      const mockTodo = createMockTodo();

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockRejectedValue(new Error('Delete error'));

      // Act & Assert
      await expect(deleteTodoUseCase.execute(todoId, userId))
        .rejects.toThrow('Delete error');
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    });

    it('should handle different user ID formats', async () => {
      // Arrange
      const uuidUserId = '550e8400-e29b-41d4-a716-446655440000';
      const mockTodo = createMockTodo(uuidUserId);

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteTodoUseCase.execute(todoId, uuidUserId);

      // Assert
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    });

    it('should handle different todo ID formats', async () => {
      // Arrange
      const uuidTodoId = '550e8400-e29b-41d4-a716-446655440001';
      const mockTodo = createMockTodo();

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteTodoUseCase.execute(uuidTodoId, userId);

      // Assert
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(uuidTodoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(uuidTodoId);
    });

    it('should handle todos with special characters in title and content', async () => {
      // Arrange
      const mockTodo = Todo.create({
        title: 'Todo with émojis 🎉 and spëcial chars: @#$%^&*()',
        content: 'Content with émojis 🚀 and spëcial chars: @#$%^&*()',
        userId,
      });

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act
      await deleteTodoUseCase.execute(todoId, userId);

      // Assert
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    });

    it('should handle concurrent deletion attempts', async () => {
      // Arrange
      const mockTodo = createMockTodo();

      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      // Act - Simulate concurrent deletion attempts
      const deletePromise1 = deleteTodoUseCase.execute(todoId, userId);
      const deletePromise2 = deleteTodoUseCase.execute(todoId, userId);

      // Assert
      await expect(Promise.all([deletePromise1, deletePromise2]))
        .resolves.toEqual([undefined, undefined]);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockTodoRepository.delete).toHaveBeenCalledTimes(2);
    });

    it('should handle empty todo ID', async () => {
      // Arrange
      const emptyTodoId = '';

      mockTodoRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteTodoUseCase.execute(emptyTodoId, userId))
        .rejects.toThrow(NotFoundException);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(emptyTodoId);
    });

    it('should handle empty user ID', async () => {
      // Arrange
      const emptyUserId = '';
      const mockTodo = createMockTodo();

      mockTodoRepository.findById.mockResolvedValue(mockTodo);

      // Act & Assert
      await expect(deleteTodoUseCase.execute(todoId, emptyUserId))
        .rejects.toThrow(ForbiddenException);
      
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();
    });
  });
});
