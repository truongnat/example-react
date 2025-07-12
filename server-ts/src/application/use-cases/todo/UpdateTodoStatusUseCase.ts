import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { UpdateTodoStatusRequestDto } from '@application/dtos/todo.dto';
import { ValidationException, NotFoundException, ForbiddenException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';
import { TODO_STATUS_ARRAY } from '@shared/constants';

export class UpdateTodoStatusUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(todoId: UUID, request: UpdateTodoStatusRequestDto, userId: UUID): Promise<{ todo: any }> {
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

    // Update todo status
    todo.changeStatus(request.status);

    // Save updated todo
    const updatedTodo = await this.todoRepository.update(todo);

    return {
      todo: updatedTodo.toJSON(),
    };
  }

  private validateRequest(request: UpdateTodoStatusRequestDto): void {
    const errors: string[] = [];

    // Validate status
    if (!request.status) {
      errors.push('Status is required');
    } else if (!TODO_STATUS_ARRAY.includes(request.status)) {
      errors.push('Invalid status value');
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
