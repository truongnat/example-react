import { httpClient } from '@/lib/http-client';

export interface SearchUsersResponse {
  users: {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class UserService {
  private baseUrl = '/users';

  async searchUsers(query?: string, page = 1, limit = 10, roomId?: string): Promise<SearchUsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (query && query.trim()) {
      params.append('q', query.trim());
    }

    if (roomId) {
      params.append('roomId', roomId);
    }

    const response = await httpClient.get<SearchUsersResponse>(
      `${this.baseUrl}/search?${params.toString()}`
    );

    // HttpClient returns ApiResponse<SearchUsersResponse>, so we need response.data
    return response.data || { users: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export const userService = new UserService();
