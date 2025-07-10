import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class DeleteRoomUseCase {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute(roomId: UUID, userId: UUID): Promise<void> {
    // Find room
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user can delete this room (only author can delete)
    if (!room.isAuthor(userId)) {
      throw new ForbiddenException('Only room author can delete the room');
    }

    // Delete all messages in the room first
    // Note: This could be optimized with a bulk delete operation
    const messages = await this.messageRepository.findByRoomId(roomId);
    for (const message of messages.data) {
      await this.messageRepository.delete(message.id);
    }

    // Delete the room
    await this.roomRepository.delete(roomId);
  }
}
