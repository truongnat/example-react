import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { NotFoundException, ForbiddenException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(todoId: UUID, userId: UUID): Promise<void> {
    // Find todo
    const todo = await this.todoRepository.findById(todoId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    // Check if user owns this todo
    if (!todo.isOwnedBy(userId)) {
      throw new ForbiddenException('You can only delete your own todos');
    }

    // Delete the todo
    await this.todoRepository.delete(todoId);
  }
}
