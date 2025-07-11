import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UUID, PaginationOptions } from '@shared/types/common.types';

export interface SearchUsersRequestDto {
  query?: string;
  page?: number;
  limit?: number;
  excludeUserIds?: UUID[];
}

export interface SearchUsersResponseDto {
  users: {
    id: UUID;
    username: string;
    email: string;
    avatarUrl: string;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SearchUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: SearchUsersRequestDto): Promise<SearchUsersResponseDto> {
    const { query = '', page = 1, limit = 10, excludeUserIds = [] } = request;
    
    // Limit the number of results to prevent abuse
    const maxLimit = Math.min(limit, 50);
    
    const options: PaginationOptions = {
      page,
      limit: maxLimit,
      sortBy: 'username',
      sortOrder: 'asc',
    };

    // If no query, return active users
    const result = query.trim()
      ? await this.userRepository.searchUsers(query.trim(), options, excludeUserIds)
      : await this.userRepository.findActiveUsers(options, excludeUserIds);

    return {
      users: result.data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
