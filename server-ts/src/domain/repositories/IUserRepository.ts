import { User } from '@domain/entities/User';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';

export interface IUserRepository {
  // Create
  create(user: User): Promise<User>;

  // Read
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<User>>;
  findActiveUsers(options?: PaginationOptions): Promise<PaginatedResult<User>>;
  findOnlineUsers(): Promise<User[]>;

  // Update
  update(user: User): Promise<User>;
  updateOnlineStatus(userId: UUID, isOnline: boolean): Promise<void>;

  // Delete
  delete(id: UUID): Promise<void>;
  softDelete(id: UUID): Promise<void>;

  // Utility
  exists(id: UUID): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  count(): Promise<number>;
}
