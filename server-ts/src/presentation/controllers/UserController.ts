import { Request, Response, NextFunction } from 'express';
import { SearchUsersUseCase } from '@application/use-cases/user/SearchUsersUseCase';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';

export class UserController {
  constructor(
    private readonly searchUsersUseCase: SearchUsersUseCase,
    private readonly roomRepository: IRoomRepository
  ) {}

  public async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const roomId = req.query.roomId as string;

      let excludeUserIds: string[] = [];

      // If roomId is provided, exclude room participants
      if (roomId) {
        const room = await this.roomRepository.findById(roomId);
        if (room) {
          excludeUserIds = room.participants;
        }
      }

      const result = await this.searchUsersUseCase.execute({
        query,
        page,
        limit,
        excludeUserIds,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Users retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
