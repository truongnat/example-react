import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { Message } from '@domain/entities/Message';
import { CreateMessageRequestDto, CreateMessageResponseDto } from '@application/dtos/chat.dto';
import { UUID } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException, ValidationException } from '@shared/exceptions';

export class CreateMessageUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(request: CreateMessageRequestDto, authorId: UUID): Promise<CreateMessageResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Check if room exists
    const room = await this.roomRepository.findById(request.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user can access this room
    if (!room.canUserAccess(authorId)) {
      throw new ForbiddenException('Access denied to this room');
    }

    // Create message
    const message = Message.create({
      content: request.content,
      authorId,
      roomId: request.roomId,
    });

    // Save message
    const savedMessage = await this.messageRepository.create(message);

    // Update room's last message
    room.setLastMessage(savedMessage.id);
    await this.roomRepository.update(room);

    return {
      message: savedMessage.toJSON(),
    };
  }

  private validateRequest(request: CreateMessageRequestDto): void {
    if (!request.content || request.content.trim().length === 0) {
      throw new ValidationException('Message content cannot be empty');
    }

    if (request.content.length > 2000) {
      throw new ValidationException('Message content cannot exceed 2000 characters');
    }

    if (!request.roomId) {
      throw new ValidationException('Room ID is required');
    }
  }
}
