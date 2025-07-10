import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class LeaveRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(roomId: UUID, userId: UUID): Promise<void> {
    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is a participant
    if (!room.isParticipant(userId)) {
      throw new ForbiddenException('User is not a participant of this room');
    }

    // Don't allow room author to leave
    if (room.isAuthor(userId)) {
      throw new ForbiddenException('Room author cannot leave the room');
    }

    // Remove user from participants
    room.removeParticipant(userId);

    // Save updated room
    await this.roomRepository.update(room);
  }
}
