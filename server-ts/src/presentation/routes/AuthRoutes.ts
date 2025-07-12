import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '@presentation/controllers/AuthController';
import { AuthValidator } from '@presentation/validators/AuthValidator';
import { ValidationMiddleware } from '@presentation/validators/ValidationMiddleware';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

export class AuthRoutes {
  private router = Router();

  constructor(
    private readonly authController: AuthController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 minLength: 2
     *                 maxLength: 50
     *                 pattern: '^[a-zA-Z0-9_-]+$'
     *                 example: johndoe
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 minLength: 8
     *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)'
     *                 example: Password123
     *               avatarUrl:
     *                 type: string
     *                 format: uri
     *                 example: https://example.com/avatar.jpg
     *     responses:
     *       201:
     *         description: User registered successfully
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
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *                         tokens:
     *                           $ref: '#/components/schemas/AuthTokens'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       409:
     *         description: Email or username already exists
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      '/register',
      AuthValidator.register(),
      ValidationMiddleware.handleValidationErrors,
      this.authController.register
    );

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 example: Password123
     *     responses:
     *       200:
     *         description: Login successful
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
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *                         tokens:
     *                           $ref: '#/components/schemas/AuthTokens'
     *       401:
     *         description: Invalid credentials
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      '/login',
      AuthValidator.login(),
      ValidationMiddleware.handleValidationErrors,
      this.authController.login
    );

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Logout user
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      '/logout',
      this.authMiddleware.authenticate,
      this.authController.logout
    );

    /**
     * @swagger
     * /auth/refresh:
     *   post:
     *     summary: Refresh access token
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - refreshToken
     *             properties:
     *               refreshToken:
     *                 type: string
     *                 description: Valid refresh token
     *     responses:
     *       200:
     *         description: Token refreshed successfully
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
     *                         tokens:
     *                           $ref: '#/components/schemas/AuthTokens'
     *       401:
     *         description: Invalid or expired refresh token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      '/refresh',
      AuthValidator.refreshToken(),
      ValidationMiddleware.handleValidationErrors,
      this.authController.refresh
    );

    /**
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Get current user profile
     *     description: Retrieve complete profile information for the authenticated user
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: User not found or account deactivated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.get(
      '/me',
      this.authMiddleware.authenticate,
      this.authController.me
    );

    /**
     * @swagger
     * /auth/profile:
     *   put:
     *     summary: Update user profile
     *     description: Update username and/or avatar URL for the authenticated user
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 minLength: 3
     *                 maxLength: 50
     *                 pattern: '^[a-zA-Z0-9_-]+$'
     *                 example: newusername
     *               avatarUrl:
     *                 type: string
     *                 format: uri
     *                 example: https://example.com/new-avatar.jpg
     *     responses:
     *       200:
     *         description: Profile updated successfully
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
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     *       409:
     *         description: Username already exists
     */
    this.router.put(
      '/profile',
      this.authMiddleware.authenticate,
      [
        body('username')
          .optional()
          .isString()
          .isLength({ min: 3, max: 50 })
          .matches(/^[a-zA-Z0-9_-]+$/)
          .withMessage('Username must be 3-50 characters and contain only letters, numbers, underscores, and hyphens'),
        body('avatarUrl')
          .optional()
          .isURL()
          .withMessage('Avatar URL must be a valid URL'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.authController.updateProfile
    );

    /**
     * @swagger
     * /auth/password:
     *   put:
     *     summary: Change user password
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - currentPassword
     *               - newPassword
     *             properties:
     *               currentPassword:
     *                 type: string
     *                 example: oldPassword123
     *               newPassword:
     *                 type: string
     *                 example: newPassword123
     *     responses:
     *       200:
     *         description: Password changed successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized or incorrect current password
     */
    this.router.put(
      '/password',
      this.authMiddleware.authenticate,
      [
        body('currentPassword')
          .notEmpty()
          .withMessage('Current password is required'),
        body('newPassword')
          .isLength({ min: 8 })
          .withMessage('New password must be at least 8 characters long')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
          .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
      ],
      ValidationMiddleware.handleValidationErrors,
      this.authController.changePassword
    );

    /**
     * @swagger
     * /auth/account:
     *   delete:
     *     summary: Delete user account
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Account deleted successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     */
    this.router.delete(
      '/account',
      this.authMiddleware.authenticate,
      this.authController.deleteAccount
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
