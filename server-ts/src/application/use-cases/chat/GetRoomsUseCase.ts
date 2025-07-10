import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { GetRoomsResponseDto } from '@application/dtos/chat.dto';
import { UUID, PaginationOptions } from '@shared/types/common.types';

export class GetRoomsUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(options: PaginationOptions, userId: UUID): Promise<GetRoomsResponseDto> {
    // Get rooms where user is a participant
    const result = await this.roomRepository.findByParticipant(userId, options);

    return {
      rooms: result.data.map(room => room.toJSON()),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
