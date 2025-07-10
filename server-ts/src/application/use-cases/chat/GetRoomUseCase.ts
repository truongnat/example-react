import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { GetRoomResponseDto } from '@application/dtos/chat.dto';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class GetRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(roomId: UUID, userId: UUID): Promise<GetRoomResponseDto> {
    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user can access this room
    if (!room.canUserAccess(userId)) {
      throw new ForbiddenException('Access denied to this room');
    }

    return {
      room: room.toJSON(),
    };
  }
}
