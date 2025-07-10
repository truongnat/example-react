import { UUID } from '@shared/types/common.types';
import { TodoStatus } from '@shared/constants';

// Request DTOs
export interface CreateTodoRequestDto {
  title: string;
  content: string;
}

export interface UpdateTodoRequestDto {
  title?: string;
  content?: string;
}

export interface UpdateTodoStatusRequestDto {
  status: TodoStatus;
}

export interface GetTodosRequestDto {
  page?: number;
  limit?: number;
  status?: TodoStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response DTOs
export interface TodoDto {
  id: UUID;
  title: string;
  content: string;
  status: TodoStatus;
  userId: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoResponseDto {
  todo: TodoDto;
}

export interface UpdateTodoResponseDto {
  todo: TodoDto;
}

export interface GetTodosResponseDto {
  todos: TodoDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTodoResponseDto {
  todo: TodoDto;
}

export interface TodoStatsDto {
  total: number;
  initial: number;
  todo: number;
  review: number;
  done: number;
  keeping: number;
}
