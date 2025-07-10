import { Todo } from '@domain/entities/Todo';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { CreateTodoRequestDto, CreateTodoResponseDto } from '@application/dtos/todo.dto';
import { ValidationException, ConflictException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(request: CreateTodoRequestDto, userId: UUID): Promise<CreateTodoResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Check if todo with same title already exists for user
    const existingTodo = await this.todoRepository.existsByUserIdAndTitle(userId, request.title);
    if (existingTodo) {
      throw new ConflictException('Todo with this title already exists');
    }

    // Create todo
    const todo = Todo.create({
      title: request.title,
      content: request.content,
      userId,
    });

    // Save todo
    const savedTodo = await this.todoRepository.create(todo);

    return {
      todo: savedTodo.toJSON(),
    };
  }

  private validateRequest(request: CreateTodoRequestDto): void {
    const errors: string[] = [];

    if (!request.title || request.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (request.title.trim().length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (!request.content || request.content.trim().length === 0) {
      errors.push('Content is required');
    } else if (request.content.trim().length > 2000) {
      errors.push('Content must be less than 2000 characters');
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
