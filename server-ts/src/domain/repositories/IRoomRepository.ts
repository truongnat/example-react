import { Room } from '@domain/entities/Room';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';

export interface IRoomRepository {
  // Create
  create(room: Room): Promise<Room>;

  // Read
  findById(id: UUID): Promise<Room | null>;
  findByAuthorId(authorId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Room>>;
  findByParticipant(userId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Room>>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Room>>;

  // Update
  update(room: Room): Promise<Room>;
  addParticipant(roomId: UUID, userId: UUID): Promise<void>;
  removeParticipant(roomId: UUID, userId: UUID): Promise<void>;
  updateLastMessage(roomId: UUID, messageId: UUID): Promise<void>;

  // Delete
  delete(id: UUID): Promise<void>;

  // Utility
  exists(id: UUID): Promise<boolean>;
  existsByName(name: string): Promise<boolean>;
  isParticipant(roomId: UUID, userId: UUID): Promise<boolean>;
  count(): Promise<number>;
  countByAuthorId(authorId: UUID): Promise<number>;
}
