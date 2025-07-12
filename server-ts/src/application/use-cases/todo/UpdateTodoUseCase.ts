import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { UpdateTodoRequestDto, UpdateTodoResponseDto } from '@application/dtos/todo.dto';
import { ValidationException, NotFoundException, ForbiddenException, ConflictException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(todoId: UUID, request: UpdateTodoRequestDto, userId: UUID): Promise<UpdateTodoResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find todo
    const todo = await this.todoRepository.findById(todoId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    // Check if user owns this todo
    if (!todo.isOwnedBy(userId)) {
      throw new ForbiddenException('You can only update your own todos');
    }

    // Check if title is being changed and if it conflicts with existing todos
    if (request.title && request.title !== todo.title) {
      const existingTodo = await this.todoRepository.existsByUserIdAndTitle(userId, request.title);
      if (existingTodo) {
        throw new ConflictException('Todo with this title already exists');
      }
    }

    // Update todo content with trimmed values
    const trimmedTitle = request.title !== undefined ? request.title.trim() : undefined;
    const trimmedContent = request.content !== undefined ? request.content.trim() : undefined;
    todo.updateContent(trimmedTitle, trimmedContent);

    // Save updated todo
    const updatedTodo = await this.todoRepository.update(todo);

    return {
      todo: updatedTodo.toJSON(),
    };
  }

  private validateRequest(request: UpdateTodoRequestDto): void {
    const errors: string[] = [];

    // At least one field must be provided
    if (request.title === undefined && request.content === undefined) {
      throw new ValidationException('At least one field must be provided for update', ['At least one field must be provided for update']);
    }

    // Validate title if provided
    if (request.title !== undefined) {
      if (request.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      } else if (request.title.trim().length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    // Validate content if provided
    if (request.content !== undefined) {
      if (request.content.trim().length === 0) {
        errors.push('Content cannot be empty');
      } else if (request.content.trim().length > 2000) {
        errors.push('Content must be less than 2000 characters');
      }
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
