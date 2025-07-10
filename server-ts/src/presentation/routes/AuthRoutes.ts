import { Router } from 'express';
import { AuthController } from '@presentation/controllers/AuthController';
import { AuthValidator } from '@presentation/validators/AuthValidator';
import { ValidationMiddleware } from '@presentation/validators/ValidationMiddleware';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';

export class AuthRoutes {
  private router = Router();

  constructor(
    private readonly authController: AuthController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.post(
      '/register',
      AuthValidator.register(),
      ValidationMiddleware.handleValidationErrors,
      this.authController.register
    );

    this.router.post(
      '/login',
      AuthValidator.login(),
      ValidationMiddleware.handleValidationErrors,
      this.authController.login
    );

    // Protected routes
    this.router.post(
      '/logout',
      this.authMiddleware.authenticate,
      this.authController.logout
    );

    this.router.get(
      '/me',
      this.authMiddleware.authenticate,
      this.authController.me
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
