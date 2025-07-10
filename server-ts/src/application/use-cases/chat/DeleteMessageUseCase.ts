import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(messageId: UUID, userId: UUID): Promise<void> {
    // Find message
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user can delete this message
    if (!message.canBeDeletedBy(userId)) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    // Soft delete the message
    message.delete();
    await this.messageRepository.update(message);
  }
}
