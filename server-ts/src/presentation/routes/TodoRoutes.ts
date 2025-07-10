import { Router } from 'express';
import { TodoController } from '@presentation/controllers/TodoController';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';
import { body, param, query } from 'express-validator';
import { ValidationMiddleware } from '@presentation/validators/ValidationMiddleware';
import { TODO_STATUS_ARRAY } from '@shared/constants';

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management
 */

export class TodoRoutes {
  private router = Router();

  constructor(
    private readonly todoController: TodoController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All todo routes require authentication
    this.router.use(this.authMiddleware.authenticate);

    // Get all todos
    this.router.get(
      '/',
      [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('status').optional().isIn(TODO_STATUS_ARRAY).withMessage('Invalid status'),
        query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'title', 'status']).withMessage('Invalid sort field'),
        query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.todoController.getAll
    );

    // Get todo by ID
    this.router.get(
      '/:id',
      [
        param('id').isUUID().withMessage('Invalid todo ID'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.todoController.getById
    );

    // Create todo
    this.router.post(
      '/',
      [
        body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
        body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Content must be between 1 and 2000 characters'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.todoController.create
    );

    // Update todo
    this.router.put(
      '/:id',
      [
        param('id').isUUID().withMessage('Invalid todo ID'),
        body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
        body('content').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Content must be between 1 and 2000 characters'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.todoController.update
    );

    // Delete todo
    this.router.delete(
      '/:id',
      [
        param('id').isUUID().withMessage('Invalid todo ID'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.todoController.delete
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
