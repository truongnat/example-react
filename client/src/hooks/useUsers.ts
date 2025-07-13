import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  search: (query?: string, page?: number, limit?: number, roomId?: string) =>
    [...userKeys.all, 'search', { query, page, limit, roomId }] as const,
};

// Search users hook
export function useSearchUsers(query?: string, page = 1, limit = 10, roomId?: string) {
  return useQuery({
    queryKey: userKeys.search(query, page, limit, roomId),
    queryFn: () => userService.searchUsers(query, page, limit, roomId),
    staleTime: 5 * 60 * 1000, // 5 minutes (match test expectation)
    enabled: true, // Always enabled, will return all active users if no query
  });
}

// Alias for backward compatibility with tests
export const useUsers = useSearchUsers;
