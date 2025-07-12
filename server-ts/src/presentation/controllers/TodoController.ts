import { Request, Response, NextFunction } from 'express';
import { CreateTodoUseCase } from '@application/use-cases/todo/CreateTodoUseCase';
import { GetTodosUseCase } from '@application/use-cases/todo/GetTodosUseCase';
import { UpdateTodoUseCase } from '@application/use-cases/todo/UpdateTodoUseCase';
import { UpdateTodoStatusUseCase } from '@application/use-cases/todo/UpdateTodoStatusUseCase';
import { DeleteTodoUseCase } from '@application/use-cases/todo/DeleteTodoUseCase';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { ForbiddenException } from '@shared/exceptions';
import { CreateTodoRequestDto, GetTodosRequestDto, UpdateTodoRequestDto, UpdateTodoStatusRequestDto } from '@application/dtos/todo.dto';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';
import { NotFoundException } from '@shared/exceptions';

export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getTodosUseCase: GetTodosUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly updateTodoStatusUseCase: UpdateTodoStatusUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly todoRepository: ITodoRepository
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: CreateTodoRequestDto = req.body;
      const userId = req.user!.id; // User is guaranteed to exist due to auth middleware
      
      const result = await this.createTodoUseCase.execute(requestDto, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Todo created successfully',
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: GetTodosRequestDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        status: req.query.status as any,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      const userId = req.user!.id;
      
      const result = await this.getTodosUseCase.execute(requestDto, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Todos retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = req.params.id;
      const userId = req.user!.id;

      if (!todoId) {
        throw new NotFoundException('Todo ID is required');
      }

      // Find todo
      const todo = await this.todoRepository.findById(todoId);
      if (!todo) {
        throw new NotFoundException('Todo not found');
      }

      // Check if user owns this todo
      if (!todo.isOwnedBy(userId)) {
        throw new ForbiddenException('You can only access your own todos');
      }

      const response: ApiResponse = {
        success: true,
        data: { todo: todo.toJSON() },
        message: 'Todo retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = req.params.id;
      const requestDto: UpdateTodoRequestDto = req.body;
      const userId = req.user!.id;

      if (!todoId) {
        throw new NotFoundException('Todo ID is required');
      }

      const result = await this.updateTodoUseCase.execute(todoId, requestDto, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Todo updated successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = req.params.id;
      const requestDto: UpdateTodoStatusRequestDto = req.body;
      const userId = req.user!.id;

      if (!todoId) {
        throw new NotFoundException('Todo ID is required');
      }

      const result = await this.updateTodoStatusUseCase.execute(todoId, requestDto, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Todo status updated successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const todoId = req.params.id;
      const userId = req.user!.id;

      if (!todoId) {
        throw new NotFoundException('Todo ID is required');
      }

      await this.deleteTodoUseCase.execute(todoId, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Todo deleted successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
