import { TodoController } from '@presentation/controllers/TodoController';
import { CreateTodoUseCase } from '@application/use-cases/todo/CreateTodoUseCase';
import { GetTodosUseCase } from '@application/use-cases/todo/GetTodosUseCase';
import { UpdateTodoUseCase } from '@application/use-cases/todo/UpdateTodoUseCase';
import { UpdateTodoStatusUseCase } from '@application/use-cases/todo/UpdateTodoStatusUseCase';
import { DeleteTodoUseCase } from '@application/use-cases/todo/DeleteTodoUseCase';
import { createMockRequest, createMockResponse, createMockNext } from '../../../utils/helpers';
import { HTTP_STATUS } from '@shared/constants';
import { TODO_STATUS } from '@shared/constants';

describe('TodoController', () => {
  let todoController: TodoController;
  let mockCreateTodoUseCase: jest.Mocked<CreateTodoUseCase>;
  let mockGetTodosUseCase: jest.Mocked<GetTodosUseCase>;
  let mockUpdateTodoUseCase: jest.Mocked<UpdateTodoUseCase>;
  let mockUpdateTodoStatusUseCase: jest.Mocked<UpdateTodoStatusUseCase>;
  let mockDeleteTodoUseCase: jest.Mocked<DeleteTodoUseCase>;
  let mockTodoRepository: any;

  beforeEach(() => {
    mockCreateTodoUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetTodosUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateTodoUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateTodoStatusUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteTodoUseCase = {
      execute: jest.fn(),
    } as any;

    mockTodoRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUserIdAndStatus: jest.fn(),
    } as any;

    todoController = new TodoController(
      mockCreateTodoUseCase,
      mockGetTodosUseCase,
      mockUpdateTodoUseCase,
      mockUpdateTodoStatusUseCase,
      mockDeleteTodoUseCase,
      mockTodoRepository
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create todo successfully', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', email: 'test@example.com', username: 'testuser' },
        body: {
          title: 'Test Todo',
          content: 'This is a test todo',
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        todo: {
          id: 'todo-123',
          title: 'Test Todo',
          content: 'This is a test todo',
          status: TODO_STATUS.INITIAL,
          userId: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockCreateTodoUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await todoController.create(req as any, res as any, next);

      // Assert
      expect(mockCreateTodoUseCase.execute).toHaveBeenCalledWith(req.body, 'user-123');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Todo created successfully',
      });
    });

    it('should handle create todo errors', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', email: 'test@example.com', username: 'testuser' },
        body: { title: 'Test Todo', content: 'Test content' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Create failed');
      mockCreateTodoUseCase.execute.mockRejectedValue(error);

      // Act
      await todoController.create(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should get todos successfully with default pagination', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', email: 'test@example.com', username: 'testuser' },
        query: {},
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        todos: [
          {
            id: 'todo-1',
            title: 'Todo 1',
            content: 'Content 1',
            status: TODO_STATUS.TODO,
            userId: 'user-123',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'todo-2',
            title: 'Todo 2',
            content: 'Content 2',
            status: TODO_STATUS.REVIEW,
            userId: 'user-123',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockGetTodosUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await todoController.getAll(req as any, res as any, next);

      // Assert
      expect(mockGetTodosUseCase.execute).toHaveBeenCalledWith(
        {
          page: undefined,
          limit: undefined,
          status: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        },
        'user-123'
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Todos retrieved successfully',
      });
    });

    it('should get todos with custom pagination and filters', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', email: 'test@example.com', username: 'testuser' },
        query: {
          page: '2',
          limit: '5',
          status: TODO_STATUS.TODO,
          sortBy: 'title',
          sortOrder: 'asc',
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const mockResult = {
        todos: [{
          id: 'todo-1',
          title: 'Todo 1',
          content: 'Content 1',
          status: TODO_STATUS.TODO,
          userId: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      };

      mockGetTodosUseCase.execute.mockResolvedValue(mockResult);

      // Act
      await todoController.getAll(req as any, res as any, next);

      // Assert
      expect(mockGetTodosUseCase.execute).toHaveBeenCalledWith(
        {
          page: 2,
          limit: 5,
          status: TODO_STATUS.TODO,
          sortBy: 'title',
          sortOrder: 'asc',
        },
        'user-123'
      );
    });

    it('should handle get todos errors', async () => {
      // Arrange
      const req = createMockRequest({
        user: { id: 'user-123', email: 'test@example.com', username: 'testuser' },
        query: {},
      });
      const res = createMockResponse();
      const next = createMockNext();

      const error = new Error('Get todos failed');
      mockGetTodosUseCase.execute.mockRejectedValue(error);

      // Act
      await todoController.getAll(req as any, res as any, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

});
