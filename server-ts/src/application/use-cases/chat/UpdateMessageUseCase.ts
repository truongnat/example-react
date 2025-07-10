import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { UpdateMessageRequestDto, UpdateMessageResponseDto } from '@application/dtos/chat.dto';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException, ValidationException } from '@shared/exceptions';

export class UpdateMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(messageId: UUID, request: UpdateMessageRequestDto, userId: UUID): Promise<UpdateMessageResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find message
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user can edit this message
    if (!message.canBeEditedBy(userId)) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    // Update message content
    message.updateContent(request.content);

    // Save updated message
    const updatedMessage = await this.messageRepository.update(message);

    return {
      message: updatedMessage.toJSON(),
    };
  }

  private validateRequest(request: UpdateMessageRequestDto): void {
    if (!request.content || request.content.trim().length === 0) {
      throw new ValidationException('Message content cannot be empty');
    }

    if (request.content.length > 2000) {
      throw new ValidationException('Message content cannot exceed 2000 characters');
    }
  }
}
