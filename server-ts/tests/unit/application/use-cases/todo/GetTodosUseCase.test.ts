import { GetTodosUseCase } from '@application/use-cases/todo/GetTodosUseCase';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { GetTodosRequestDto } from '@application/dtos/todo.dto';
import { Todo } from '@domain/entities/Todo';
import { TODO_STATUS, PAGINATION_DEFAULTS } from '@shared/constants';
import { PaginatedResult } from '@shared/types/common.types';

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

describe('GetTodosUseCase', () => {
  let getTodosUseCase: GetTodosUseCase;

  beforeEach(() => {
    getTodosUseCase = new GetTodosUseCase(mockTodoRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  const userId = 'user-123';

  const createMockTodos = (count: number): Todo[] => {
    return Array.from({ length: count }, (_, index) => 
      Todo.create({
        title: `Todo ${index + 1}`,
        content: `Content for todo ${index + 1}`,
        userId,
      })
    );
  };

  const createMockPaginatedResult = (todos: Todo[], total: number, page: number = 1, limit: number = 10): PaginatedResult<Todo> => ({
    data: todos,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });

  describe('successful todo retrieval', () => {
    it('should get all todos for user with default pagination', async () => {
      // Arrange
      const mockTodos = createMockTodos(5);
      const mockResult = createMockPaginatedResult(mockTodos, 5);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute({}, userId);

      // Assert
      expect(result.todos).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(PAGINATION_DEFAULTS.LIMIT);
      expect(result.totalPages).toBe(1);

      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(userId, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
    });

    it('should get todos with custom pagination', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        page: 2,
        limit: 5,
      };

      const mockTodos = createMockTodos(3);
      const mockResult = createMockPaginatedResult(mockTodos, 8, 2, 5);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(result.todos).toHaveLength(3);
      expect(result.total).toBe(8);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(2);

      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(userId, {
        page: 2,
        limit: 5,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
    });

    it('should get todos filtered by status', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        status: TODO_STATUS.TODO,
      };

      const mockTodos = createMockTodos(3);
      mockTodos.forEach(todo => todo.markAsTodo());
      const mockResult = createMockPaginatedResult(mockTodos, 3);
      
      mockTodoRepository.findByUserIdAndStatus.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(result.todos).toHaveLength(3);
      expect(result.todos.every(todo => todo.status === TODO_STATUS.TODO)).toBe(true);

      expect(mockTodoRepository.findByUserIdAndStatus).toHaveBeenCalledWith(userId, TODO_STATUS.TODO, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
      expect(mockTodoRepository.findByUserId).not.toHaveBeenCalled();
    });

    it('should get todos with custom sorting', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockTodos = createMockTodos(3);
      const mockResult = createMockPaginatedResult(mockTodos, 3);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(userId, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        sortBy: 'title',
        sortOrder: 'asc',
      });
    });

    it('should map camelCase sortBy to snake_case', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        sortBy: 'createdAt',
      };

      const mockTodos = createMockTodos(2);
      const mockResult = createMockPaginatedResult(mockTodos, 2);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(userId, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
    });

    it('should handle invalid sortBy field gracefully', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        sortBy: 'invalidField' as any,
      };

      const mockTodos = createMockTodos(2);
      const mockResult = createMockPaginatedResult(mockTodos, 2);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(userId, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        sortBy: 'created_at', // Should default to created_at
        sortOrder: 'desc',
      });
    });

    it('should enforce maximum limit', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        limit: 1000, // Exceeds max limit
      };

      const mockTodos = createMockTodos(10);
      const mockResult = createMockPaginatedResult(mockTodos, 10, 1, PAGINATION_DEFAULTS.MAX_LIMIT);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(userId, {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.MAX_LIMIT,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
    });

    it('should return empty result when no todos found', async () => {
      // Arrange
      const mockResult = createMockPaginatedResult([], 0);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute({}, userId);

      // Assert
      expect(result.todos).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('different status filters', () => {
    it('should get todos with INITIAL status', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        status: TODO_STATUS.INITIAL,
      };

      const mockTodos = createMockTodos(2);
      const mockResult = createMockPaginatedResult(mockTodos, 2);
      
      mockTodoRepository.findByUserIdAndStatus.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserIdAndStatus).toHaveBeenCalledWith(userId, TODO_STATUS.INITIAL, expect.any(Object));
    });

    it('should get todos with DONE status', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        status: TODO_STATUS.DONE,
      };

      const mockTodos = createMockTodos(2);
      mockTodos.forEach(todo => {
        todo.markAsTodo();
        todo.markAsDone();
      });
      const mockResult = createMockPaginatedResult(mockTodos, 2);
      
      mockTodoRepository.findByUserIdAndStatus.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserIdAndStatus).toHaveBeenCalledWith(userId, TODO_STATUS.DONE, expect.any(Object));
    });

    it('should get todos with KEEPING status', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        status: TODO_STATUS.KEEPING,
      };

      const mockTodos = createMockTodos(2);
      mockTodos.forEach(todo => todo.markAsKeeping());
      const mockResult = createMockPaginatedResult(mockTodos, 2);
      
      mockTodoRepository.findByUserIdAndStatus.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(mockTodoRepository.findByUserIdAndStatus).toHaveBeenCalledWith(userId, TODO_STATUS.KEEPING, expect.any(Object));
    });
  });

  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockTodoRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getTodosUseCase.execute({}, userId))
        .rejects.toThrow('Database error');
    });

    it('should handle status filter repository errors gracefully', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        status: TODO_STATUS.TODO,
      };

      mockTodoRepository.findByUserIdAndStatus.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getTodosUseCase.execute(request, userId))
        .rejects.toThrow('Database error');
    });

    it('should handle different user ID formats', async () => {
      // Arrange
      const uuidUserId = '550e8400-e29b-41d4-a716-446655440000';
      const mockTodos = createMockTodos(2);
      const mockResult = createMockPaginatedResult(mockTodos, 2);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute({}, uuidUserId);

      // Assert
      expect(mockTodoRepository.findByUserId).toHaveBeenCalledWith(uuidUserId, expect.any(Object));
    });

    it('should handle large page numbers', async () => {
      // Arrange
      const request: GetTodosRequestDto = {
        page: 999,
        limit: 10,
      };

      const mockResult = createMockPaginatedResult([], 0, 999, 10);
      
      mockTodoRepository.findByUserId.mockResolvedValue(mockResult);

      // Act
      const result = await getTodosUseCase.execute(request, userId);

      // Assert
      expect(result.page).toBe(999);
      expect(result.todos).toHaveLength(0);
    });
  });
});
