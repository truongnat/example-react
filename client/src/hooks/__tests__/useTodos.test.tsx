import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useTodos,
  useTodo,
  useCreateTodo,
  useUpdateTodo,
  useUpdateTodoStatus,
  useDeleteTodo,
} from '../useTodos'
import { todoService } from '@/services/todo.service'
import { mockTodo } from '@/test/test-utils'
import type { TodoStatus } from '@/types/api'

// Mock dependencies
vi.mock('@/services/todo.service', () => ({
  todoService: {
    getTodos: vi.fn(),
    getTodoById: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    updateTodoStatus: vi.fn(),
    deleteTodo: vi.fn(),
  },
}))

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTodos hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useTodos', () => {
    it('should fetch todos successfully', async () => {
      const mockResponse = {
        todos: [mockTodo],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      vi.mocked(todoService.getTodos).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.getTodos).toHaveBeenCalledWith(undefined)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should fetch todos with parameters', async () => {
      const params = {
        page: 2,
        limit: 5,
        status: 'COMPLETED' as TodoStatus,
      }

      const mockResponse = {
        todos: [mockTodo],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      }

      vi.mocked(todoService.getTodos).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useTodos(params), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.getTodos).toHaveBeenCalledWith(params)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should not retry on 401 errors', async () => {
      const error = { status: 401 }
      vi.mocked(todoService.getTodos).mockRejectedValue(error)

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // Should not retry on 401
      expect(todoService.getTodos).toHaveBeenCalledTimes(1)
    })
  })

  describe('useTodo', () => {
    it('should fetch todo by id successfully', async () => {
      vi.mocked(todoService.getTodoById).mockResolvedValue(mockTodo)

      const { result } = renderHook(() => useTodo('todo-123'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.getTodoById).toHaveBeenCalledWith('todo-123')
      expect(result.current.data).toEqual(mockTodo)
    })

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useTodo(''), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe('idle')
      expect(todoService.getTodoById).not.toHaveBeenCalled()
    })
  })

  describe('useCreateTodo', () => {
    it('should create todo successfully', async () => {
      vi.mocked(todoService.createTodo).mockResolvedValue(mockTodo)

      const { result } = renderHook(() => useCreateTodo(), {
        wrapper: createWrapper(),
      })

      const createData = {
        title: 'New Todo',
        content: 'New todo content',
      }

      result.current.mutate(createData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.createTodo).toHaveBeenCalledWith(createData)
      expect(result.current.data).toEqual(mockTodo)
    })

    it('should handle create error', async () => {
      const error = new Error('Create failed')
      vi.mocked(todoService.createTodo).mockRejectedValue(error)

      const { result } = renderHook(() => useCreateTodo(), {
        wrapper: createWrapper(),
      })

      const createData = {
        title: '',
        content: '',
      }

      result.current.mutate(createData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })

  describe('useUpdateTodo', () => {
    it('should update todo successfully', async () => {
      const updatedTodo = { ...mockTodo, title: 'Updated Todo' }
      vi.mocked(todoService.updateTodo).mockResolvedValue(updatedTodo)

      const { result } = renderHook(() => useUpdateTodo(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        id: 'todo-123',
        data: { title: 'Updated Todo' },
      }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.updateTodo).toHaveBeenCalledWith('todo-123', { title: 'Updated Todo' })
      expect(result.current.data).toEqual(updatedTodo)
    })

    it('should handle update error', async () => {
      const error = new Error('Update failed')
      vi.mocked(todoService.updateTodo).mockRejectedValue(error)

      const { result } = renderHook(() => useUpdateTodo(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        id: 'invalid-id',
        data: { title: 'Updated Todo' },
      }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })

  describe('useUpdateTodoStatus', () => {
    it('should update todo status successfully', async () => {
      const updatedTodo = { ...mockTodo, status: 'COMPLETED' as TodoStatus }
      vi.mocked(todoService.updateTodoStatus).mockResolvedValue(updatedTodo)

      const { result } = renderHook(() => useUpdateTodoStatus(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        id: 'todo-123',
        data: { status: 'COMPLETED' as TodoStatus },
      }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.updateTodoStatus).toHaveBeenCalledWith('todo-123', { status: 'COMPLETED' })
      expect(result.current.data).toEqual(updatedTodo)
    })

    it('should handle status update error', async () => {
      const error = new Error('Status update failed')
      vi.mocked(todoService.updateTodoStatus).mockRejectedValue(error)

      const { result } = renderHook(() => useUpdateTodoStatus(), {
        wrapper: createWrapper(),
      })

      const updateData = {
        id: 'todo-123',
        status: 'INVALID' as TodoStatus,
      }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })

  describe('useDeleteTodo', () => {
    it('should delete todo successfully', async () => {
      vi.mocked(todoService.deleteTodo).mockResolvedValue()

      const { result } = renderHook(() => useDeleteTodo(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('todo-123')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(todoService.deleteTodo).toHaveBeenCalledWith('todo-123')
    })

    it('should handle delete error', async () => {
      const error = new Error('Delete failed')
      vi.mocked(todoService.deleteTodo).mockRejectedValue(error)

      const { result } = renderHook(() => useDeleteTodo(), {
        wrapper: createWrapper(),
      })

      result.current.mutate('invalid-id')

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(error)
    })
  })
})
