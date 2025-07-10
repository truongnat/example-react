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

    /**
     * @swagger
     * /todos:
     *   get:
     *     summary: Get user's todos
     *     tags: [Todos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Number of items per page
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [initial, todo, review, done, keeping]
     *         description: Filter by todo status
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [createdAt, updatedAt, title, status]
     *           default: createdAt
     *         description: Sort field
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: desc
     *         description: Sort order
     *     responses:
     *       200:
     *         description: Todos retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       allOf:
     *                         - $ref: '#/components/schemas/PaginatedResponse'
     *                         - type: object
     *                           properties:
     *                             data:
     *                               type: array
     *                               items:
     *                                 $ref: '#/components/schemas/Todo'
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
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

    /**
     * @swagger
     * /todos:
     *   post:
     *     summary: Create a new todo
     *     tags: [Todos]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - content
     *             properties:
     *               title:
     *                 type: string
     *                 minLength: 1
     *                 maxLength: 200
     *                 example: Complete project documentation
     *               content:
     *                 type: string
     *                 minLength: 1
     *                 maxLength: 2000
     *                 example: Write comprehensive API documentation with examples
     *     responses:
     *       201:
     *         description: Todo created successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         todo:
     *                           $ref: '#/components/schemas/Todo'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       409:
     *         description: Todo with this title already exists
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
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
