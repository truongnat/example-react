import { Router } from 'express';
import { query } from 'express-validator';
import { UserController } from '@presentation/controllers/UserController';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';

export class UserRoutes {
  private router: Router;

  constructor(
    private readonly userController: UserController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /api/users/search:
     *   get:
     *     summary: Search users
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Search query (username or email)
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *           maximum: 50
     *         description: Number of users per page
     *     responses:
     *       200:
     *         description: Users retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                   properties:
     *                     users:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                           username:
     *                             type: string
     *                           email:
     *                             type: string
     *                           avatarUrl:
     *                             type: string
     *                     total:
     *                       type: integer
     *                     page:
     *                       type: integer
     *                     limit:
     *                       type: integer
     *                     totalPages:
     *                       type: integer
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      '/search',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      [
        query('q').optional().isString().withMessage('Query must be a string'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
      ],
      this.userController.searchUsers.bind(this.userController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
