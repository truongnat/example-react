import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { GetTodosRequestDto, GetTodosResponseDto } from '@application/dtos/todo.dto';
import { UUID, PaginationOptions } from '@shared/types/common.types';
import { PAGINATION_DEFAULTS } from '@shared/constants';

export class GetTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(request: GetTodosRequestDto, userId: UUID): Promise<GetTodosResponseDto> {
    // Map camelCase sortBy to snake_case for database
    const sortByMapping: Record<string, string> = {
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'title': 'title',
      'status': 'status',
      'userId': 'user_id'
    };

    const sortBy = request.sortBy ? sortByMapping[request.sortBy] || 'created_at' : 'created_at';

    // Prepare pagination options
    const options: PaginationOptions = {
      page: request.page || PAGINATION_DEFAULTS.PAGE,
      limit: Math.min(request.limit || PAGINATION_DEFAULTS.LIMIT, PAGINATION_DEFAULTS.MAX_LIMIT),
      sortBy,
      sortOrder: request.sortOrder || 'desc',
    };

    // Get todos based on status filter
    const result = request.status
      ? await this.todoRepository.findByUserIdAndStatus(userId, request.status, options)
      : await this.todoRepository.findByUserId(userId, options);

    return {
      todos: result.data.map(todo => todo.toJSON()),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
