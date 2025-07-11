import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '@application/interfaces/ITokenService';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UnauthorizedException } from '@shared/exceptions';
import { JWTPayload } from '@shared/types/common.types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

export class AuthMiddleware {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepository: IUserRepository
  ) {}

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authorization token required');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Verify token
      const payload: JWTPayload = await this.tokenService.verifyAccessToken(token);
      
      // Check if user still exists and is active
      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Add user info to request
      req.user = {
        id: payload.userId,
        email: payload.email,
        username: payload.username,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        try {
          const payload: JWTPayload = await this.tokenService.verifyAccessToken(token);
          const user = await this.userRepository.findById(payload.userId);
          
          if (user && user.isActive) {
            req.user = {
              id: payload.userId,
              email: payload.email,
              username: payload.username,
            };
          }
        } catch {
          // Ignore token errors for optional auth
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
