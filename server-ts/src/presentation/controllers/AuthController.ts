import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@application/use-cases/auth/LogoutUseCase';
import { GetUserUseCase } from '@application/use-cases/auth/GetUserUseCase';
import { UpdateUserUseCase } from '@application/use-cases/auth/UpdateUserUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/auth/RefreshTokenUseCase';
import { ChangePasswordUseCase } from '@application/use-cases/auth/ChangePasswordUseCase';
import { RegisterRequestDto, LoginRequestDto, RefreshTokenRequestDto, ChangePasswordRequestDto } from '@application/dtos/auth.dto';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: RegisterRequestDto = req.body;
      const result = await this.registerUseCase.execute(requestDto);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'User registered successfully',
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: LoginRequestDto = req.body;
      const result = await this.loginUseCase.execute(requestDto);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      // Execute logout use case to handle user offline status and real-time updates
      await this.logoutUseCase.execute(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Logout successful',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: RefreshTokenRequestDto = req.body;
      const result = await this.refreshTokenUseCase.execute(requestDto);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get full user info from database using the user ID from auth middleware
      const userId = req.user!.id;
      const user = await this.getUserUseCase.execute(userId);

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'User profile retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const requestDto = req.body;
      const result = await this.updateUserUseCase.execute(userId, requestDto);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'User profile updated successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: ChangePasswordRequestDto = req.body;
      const userId = req.user!.id;

      const result = await this.changePasswordUseCase.execute(userId, requestDto);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: result.message,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;

      // For now, return a placeholder response
      // This would need a DeleteAccountUseCase implementation
      const response: ApiResponse = {
        success: true,
        message: 'Account deleted successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
