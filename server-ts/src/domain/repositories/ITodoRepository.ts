import { Todo } from '@domain/entities/Todo';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';
import { TodoStatus } from '@shared/constants';

export interface ITodoRepository {
  // Create
  create(todo: Todo): Promise<Todo>;

  // Read
  findById(id: UUID): Promise<Todo | null>;
  findByUserId(userId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Todo>>;
  findByStatus(status: TodoStatus, options?: PaginationOptions): Promise<PaginatedResult<Todo>>;
  findByUserIdAndStatus(userId: UUID, status: TodoStatus, options?: PaginationOptions): Promise<PaginatedResult<Todo>>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Todo>>;

  // Update
  update(todo: Todo): Promise<Todo>;
  updateStatus(id: UUID, status: TodoStatus): Promise<void>;

  // Delete
  delete(id: UUID): Promise<void>;

  // Utility
  exists(id: UUID): Promise<boolean>;
  existsByUserIdAndTitle(userId: UUID, title: string): Promise<boolean>;
  count(): Promise<number>;
  countByUserId(userId: UUID): Promise<number>;
  countByStatus(status: TodoStatus): Promise<number>;
  countByUserIdAndStatus(userId: UUID, status: TodoStatus): Promise<number>;
}
