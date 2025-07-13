import { describe, it, expect, vi, beforeEach } from 'vitest'
import { todoService } from '../todo.service'
import { httpClient } from '@/lib/http-client'
import { mockApiResponse, mockTodo } from '@/test/test-utils'
import type {
  CreateTodoRequestDto,
  UpdateTodoRequestDto,
  UpdateTodoStatusRequestDto,
  GetTodosRequestDto,
  TodoStatus,
} from '@/types/api'

// Mock the http client
vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('TodoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTodos', () => {
    it('should get todos without parameters', async () => {
      const mockResponse = mockApiResponse({
        todos: [mockTodo],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      })

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await todoService.getTodos()

      expect(httpClient.get).toHaveBeenCalledWith('/todos')
      expect(result).toEqual({
        todos: [mockTodo],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      })
    })

    it('should get todos with all parameters', async () => {
      const params: GetTodosRequestDto = {
        page: 2,
        limit: 5,
        status: 'COMPLETED' as TodoStatus,
        sortBy: 'title',
        sortOrder: 'asc',
      }

      const mockResponse = mockApiResponse({
        todos: [mockTodo],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      })

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await todoService.getTodos(params)

      expect(httpClient.get).toHaveBeenCalledWith(
        '/todos?page=2&limit=5&status=COMPLETED&sortBy=title&sortOrder=asc'
      )
      expect(result).toEqual({
        todos: [mockTodo],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      })
    })

    it('should get todos with partial parameters', async () => {
      const params: GetTodosRequestDto = {
        page: 1,
        status: 'IN_PROGRESS' as TodoStatus,
      }

      const mockResponse = mockApiResponse({
        todos: [mockTodo],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      })

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await todoService.getTodos(params)

      expect(httpClient.get).toHaveBeenCalledWith('/todos?page=1&status=IN_PROGRESS')
      expect(result).toEqual({
        todos: [mockTodo],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      })
    })

    it('should throw error when get todos fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Failed to fetch todos'

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      await expect(todoService.getTodos()).rejects.toThrow('Failed to fetch todos')
    })
  })

  describe('getTodoById', () => {
    it('should get todo by id successfully', async () => {
      const mockResponse = mockApiResponse(mockTodo)
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      const result = await todoService.getTodoById('todo-123')

      expect(httpClient.get).toHaveBeenCalledWith('/todos/todo-123')
      expect(result).toEqual(mockTodo)
    })

    it('should throw error when get todo by id fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Todo not found'

      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      await expect(todoService.getTodoById('invalid-id')).rejects.toThrow('Todo not found')
    })
  })

  describe('createTodo', () => {
    const createTodoData: CreateTodoRequestDto = {
      title: 'New Todo',
      content: 'New todo content',
    }

    it('should create todo successfully', async () => {
      const mockResponse = mockApiResponse({
        todo: mockTodo,
      })

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await todoService.createTodo(createTodoData)

      expect(httpClient.post).toHaveBeenCalledWith('/todos', createTodoData)
      expect(result).toEqual(mockTodo)
    })

    it('should throw error when create todo fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Validation failed'

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(todoService.createTodo(createTodoData)).rejects.toThrow('Validation failed')
    })

    it('should throw default error when no message provided', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = undefined

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await expect(todoService.createTodo(createTodoData)).rejects.toThrow('Failed to create todo')
    })
  })

  describe('updateTodo', () => {
    const updateTodoData: UpdateTodoRequestDto = {
      title: 'Updated Todo',
      content: 'Updated content',
    }

    it('should update todo successfully', async () => {
      const updatedTodo = { ...mockTodo, title: 'Updated Todo' }
      const mockResponse = mockApiResponse({
        todo: updatedTodo,
      })

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await todoService.updateTodo('todo-123', updateTodoData)

      expect(httpClient.put).toHaveBeenCalledWith('/todos/todo-123', updateTodoData)
      expect(result).toEqual(updatedTodo)
    })

    it('should throw error when update todo fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Todo not found'

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      await expect(todoService.updateTodo('invalid-id', updateTodoData)).rejects.toThrow('Todo not found')
    })
  })

  describe('updateTodoStatus', () => {
    const updateStatusData: UpdateTodoStatusRequestDto = {
      status: 'COMPLETED' as TodoStatus,
    }

    it('should update todo status successfully', async () => {
      const updatedTodo = { ...mockTodo, status: 'COMPLETED' as TodoStatus }
      const mockResponse = mockApiResponse({
        todo: updatedTodo,
      })

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      const result = await todoService.updateTodoStatus('todo-123', updateStatusData)

      expect(httpClient.put).toHaveBeenCalledWith('/todos/todo-123', updateStatusData)
      expect(result).toEqual(updatedTodo)
    })

    it('should throw error when update todo status fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Invalid status'

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      await expect(todoService.updateTodoStatus('todo-123', updateStatusData)).rejects.toThrow('Invalid status')
    })

    it('should throw default error when no message provided', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = undefined

      vi.mocked(httpClient.put).mockResolvedValue(mockResponse)

      await expect(todoService.updateTodoStatus('todo-123', updateStatusData)).rejects.toThrow('Failed to update todo status')
    })
  })

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      const mockResponse = mockApiResponse(null)
      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse)

      await expect(todoService.deleteTodo('todo-123')).resolves.not.toThrow()

      expect(httpClient.delete).toHaveBeenCalledWith('/todos/todo-123')
    })

    it('should throw error when delete todo fails', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = 'Todo not found'

      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse)

      await expect(todoService.deleteTodo('invalid-id')).rejects.toThrow('Todo not found')
    })

    it('should throw default error when no message provided', async () => {
      const mockResponse = mockApiResponse(null, false)
      mockResponse.message = undefined

      vi.mocked(httpClient.delete).mockResolvedValue(mockResponse)

      await expect(todoService.deleteTodo('todo-123')).rejects.toThrow('Failed to delete todo')
    })
  })
})
