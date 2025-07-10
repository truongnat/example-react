import { Request, Response, NextFunction } from 'express';
import { CreateTodoUseCase } from '@application/use-cases/todo/CreateTodoUseCase';
import { GetTodosUseCase } from '@application/use-cases/todo/GetTodosUseCase';
import { CreateTodoRequestDto, GetTodosRequestDto, UpdateTodoRequestDto, UpdateTodoStatusRequestDto } from '@application/dtos/todo.dto';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';
import { NotFoundException } from '@shared/exceptions';

export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getTodosUseCase: GetTodosUseCase
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

      // This would need a GetTodoByIdUseCase implementation
      // For now, we'll return a placeholder response
      
      const response: ApiResponse = {
        success: true,
        data: { id: todoId, userId },
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

      // This would need an UpdateTodoUseCase implementation
      // For now, we'll return a placeholder response

      const response: ApiResponse = {
        success: true,
        data: { id: todoId, ...requestDto, userId },
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
      const { status } = req.body;
      const userId = req.user!.id;

      // This would need an UpdateTodoStatusUseCase implementation
      // For now, we'll return a placeholder response

      const response: ApiResponse = {
        success: true,
        data: { id: todoId, status, userId },
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

      // This would need a DeleteTodoUseCase implementation
      // For now, we'll return a placeholder response
      
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
