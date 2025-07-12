import { Room, RoomProps } from '@domain/entities/Room';
import { UUID } from '@shared/types/common.types';

export interface RoomFactoryOptions {
  id?: UUID;
  name?: string;
  avatarUrl?: string;
  authorId?: UUID;
  lastMessageId?: UUID;
  participants?: UUID[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class RoomFactory {
  private static defaultProps: Partial<RoomProps> = {
    name: 'Test Room',
    avatarUrl: 'https://example.com/room-avatar.jpg',
    authorId: 'test-author-id',
  };

  static create(options: RoomFactoryOptions = {}): Room {
    const props = {
      ...this.defaultProps,
      ...options,
    };

    // If we have all required props, use fromPersistence, otherwise use create
    if (options.id && options.createdAt && options.updatedAt && options.participants) {
      return Room.fromPersistence(props as any);
    }

    const room = Room.create(props as any);

    // Set additional properties if provided
    if (options.id) {
      (room as any)._id = options.id;
    }

    if (options.participants) {
      options.participants.forEach(participantId => {
        if (participantId !== room.authorId) { // Don't add author twice
          room.addParticipant(participantId);
        }
      });
    }

    if (options.lastMessageId) {
      room.setLastMessage(options.lastMessageId);
    }

    if (options.createdAt) {
      (room as any)._createdAt = options.createdAt;
    }

    if (options.updatedAt) {
      (room as any)._updatedAt = options.updatedAt;
    }

    return room;
  }

  static createMany(count: number, options: RoomFactoryOptions = {}): Room[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        ...options,
        name: `${options.name || 'Test Room'} ${index + 1}`,
      })
    );
  }

  static createWithParticipants(participantIds: UUID[], options: RoomFactoryOptions = {}): Room {
    return this.create({
      ...options,
      participants: participantIds,
    });
  }

  static createForAuthor(authorId: UUID, options: RoomFactoryOptions = {}): Room {
    return this.create({
      ...options,
      authorId,
    });
  }

  static createManyForAuthor(authorId: UUID, count: number, options: RoomFactoryOptions = {}): Room[] {
    return this.createMany(count, {
      ...options,
      authorId,
    });
  }
}
