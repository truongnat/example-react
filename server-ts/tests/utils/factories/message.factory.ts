import { Message, MessageProps } from '@domain/entities/Message';
import { UUID } from '@shared/types/common.types';

export interface MessageFactoryOptions {
  id?: UUID;
  content?: string;
  authorId?: UUID;
  roomId?: UUID;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MessageFactory {
  private static defaultProps: Partial<MessageProps> = {
    content: 'Test message content',
    authorId: 'test-author-id',
    roomId: 'test-room-id',
  };

  static create(options: MessageFactoryOptions = {}): Message {
    const props = {
      ...this.defaultProps,
      ...options,
    };

    // If we have all required props, use fromPersistence, otherwise use create
    if (options.id && options.createdAt && options.updatedAt && options.isDeleted !== undefined) {
      return Message.fromPersistence(props as any);
    }

    const message = Message.create(props as any);

    // Set additional properties if provided
    if (options.id) {
      (message as any)._id = options.id;
    }

    if (options.createdAt) {
      (message as any)._createdAt = options.createdAt;
    }

    if (options.updatedAt) {
      (message as any)._updatedAt = options.updatedAt;
    }

    return message;
  }

  static createMany(count: number, options: MessageFactoryOptions = {}): Message[] {
    return Array.from({ length: count }, (_, index) => 
      this.create({
        ...options,
        content: `${options.content || 'Test message content'} ${index + 1}`,
      })
    );
  }

  static createForRoom(roomId: UUID, options: MessageFactoryOptions = {}): Message {
    return this.create({
      ...options,
      roomId,
    });
  }

  static createForAuthor(authorId: UUID, options: MessageFactoryOptions = {}): Message {
    return this.create({
      ...options,
      authorId,
    });
  }

  static createForRoomAndAuthor(roomId: UUID, authorId: UUID, options: MessageFactoryOptions = {}): Message {
    return this.create({
      ...options,
      roomId,
      authorId,
    });
  }

  static createManyForRoom(roomId: UUID, count: number, options: MessageFactoryOptions = {}): Message[] {
    return this.createMany(count, {
      ...options,
      roomId,
    });
  }

  static createManyForAuthor(authorId: UUID, count: number, options: MessageFactoryOptions = {}): Message[] {
    return this.createMany(count, {
      ...options,
      authorId,
    });
  }

  static createConversation(roomId: UUID, authorIds: UUID[], messageCount: number = 5): Message[] {
    const messages: Message[] = [];

    for (let i = 0; i < messageCount; i++) {
      const authorId = authorIds[i % authorIds.length];
      messages.push(this.create({
        content: `Message ${i + 1} from author ${authorId}`,
        authorId,
        roomId,
        createdAt: new Date(Date.now() + i * 1000), // 1 second apart
      }));
    }
    
    return messages;
  }
}
