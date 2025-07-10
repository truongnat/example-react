import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { todoService } from '@/services/todo.service'
import type {
  CreateTodoRequestDto,
  UpdateTodoRequestDto,
  UpdateTodoStatusRequestDto,
  GetTodosRequestDto,
  TodoDto,
} from '@/types/api'

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params?: GetTodosRequestDto) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

// Get todos query
export const useTodos = (params?: GetTodosRequestDto) => {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todoService.getTodos(params),
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) return false
      return failureCount < 3
    },
  })
}

// Get todo by ID query
export const useTodo = (id: string) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoService.getTodoById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Create todo mutation
export const useCreateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTodoRequestDto) => todoService.createTodo(data),
    onSuccess: (newTodo) => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      
      // Optionally add the new todo to existing cache
      queryClient.setQueryData(todoKeys.detail(newTodo.id), newTodo)
    },
    onError: (error) => {
      console.error('Failed to create todo:', error)
    },
  })
}

// Update todo mutation
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequestDto }) =>
      todoService.updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo)
      
      // Invalidate todos list to reflect changes
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update todo:', error)
    },
  })
}

// Update todo status mutation
export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoStatusRequestDto }) =>
      todoService.updateTodoStatus(id, data),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo)
      
      // Invalidate todos list to reflect changes
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update todo status:', error)
    },
  })
}

// Delete todo mutation
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => todoService.deleteTodo(id),
    onSuccess: (_, deletedId) => {
      // Remove the todo from cache
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) })
      
      // Invalidate todos list to reflect changes
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete todo:', error)
    },
  })
}

// Optimistic update for todo status (for better UX)
export const useToggleTodoStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      // Determine new status
      const newStatus = currentStatus === 'completed' ? 'initial' : 'completed'
      
      return todoService.updateTodoStatus(id, { status: newStatus as any })
    },
    onMutate: async ({ id, currentStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) })
      
      // Snapshot previous value
      const previousTodo = queryClient.getQueryData<TodoDto>(todoKeys.detail(id))
      
      // Optimistically update
      if (previousTodo) {
        const newStatus = currentStatus === 'completed' ? 'initial' : 'completed'
        queryClient.setQueryData(todoKeys.detail(id), {
          ...previousTodo,
          status: newStatus,
        })
      }
      
      return { previousTodo }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTodo) {
        queryClient.setQueryData(todoKeys.detail(variables.id), context.previousTodo)
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
