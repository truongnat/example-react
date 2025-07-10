import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { GetRoomResponseDto } from '@application/dtos/chat.dto';
import { UUID } from '@shared/types/common.types';
import { NotFoundException } from '@shared/exceptions';

export class JoinRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(roomId: UUID, userId: UUID): Promise<GetRoomResponseDto> {
    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Add user as participant if not already
    room.addParticipant(userId);

    // Save updated room
    const updatedRoom = await this.roomRepository.update(room);

    return {
      room: updatedRoom.toJSON(),
    };
  }
}
