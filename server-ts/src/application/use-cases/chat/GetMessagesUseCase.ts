import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { GetMessagesResponseDto } from '@application/dtos/chat.dto';
import { UUID, PaginationOptions } from '@shared/types/common.types';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';

export class GetMessagesUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(roomId: UUID, options: PaginationOptions, userId: UUID): Promise<GetMessagesResponseDto> {
    // Check if room exists
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user can access this room
    if (!room.canUserAccess(userId)) {
      throw new ForbiddenException('Access denied to this room');
    }

    // Get visible messages for the room
    const result = await this.messageRepository.findVisibleByRoomId(roomId, options);

    // Get unique author IDs
    const authorIds = [...new Set(result.data.map(message => message.authorId))];

    // Fetch author information
    const authors = await this.userRepository.findByIds(authorIds);
    const authorMap = new Map(authors.map(author => [author.id, author]));

    // Convert to DTOs with author information
    const messagesWithAuthor = result.data.map(message => {
      const author = authorMap.get(message.authorId);
      return {
        ...message.toJSON(),
        author: {
          id: message.authorId,
          username: author?.username || 'Unknown User',
          avatarUrl: author?.avatarUrl || '',
        },
      };
    });

    return {
      messages: messagesWithAuthor,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  // Helper method for getting a single message
  async getMessageById(messageId: UUID, userId: UUID): Promise<any> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user can access the room
    const room = await this.roomRepository.findById(message.roomId);
    if (!room || !room.canUserAccess(userId)) {
      throw new ForbiddenException('Access denied');
    }

    return message.toJSON();
  }
}
