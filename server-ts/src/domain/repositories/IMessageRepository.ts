import { Message } from '@domain/entities/Message';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';

export interface IMessageRepository {
  // Create
  create(message: Message): Promise<Message>;

  // Read
  findById(id: UUID): Promise<Message | null>;
  findByRoomId(roomId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Message>>;
  findByAuthorId(authorId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Message>>;
  findByRoomIdAndAuthorId(roomId: UUID, authorId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Message>>;
  findVisibleByRoomId(roomId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Message>>;
  findLatestByRoomId(roomId: UUID): Promise<Message | null>;

  // Update
  update(message: Message): Promise<Message>;
  markAsDeleted(id: UUID): Promise<void>;
  restore(id: UUID): Promise<void>;

  // Delete
  delete(id: UUID): Promise<void>;

  // Utility
  exists(id: UUID): Promise<boolean>;
  count(): Promise<number>;
  countByRoomId(roomId: UUID): Promise<number>;
  countByAuthorId(authorId: UUID): Promise<number>;
  countVisibleByRoomId(roomId: UUID): Promise<number>;
}
