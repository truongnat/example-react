import { httpClient } from '@/lib/http-client'
import type {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
  UpdateTodoRequestDto,
  UpdateTodoResponseDto,
  UpdateTodoStatusRequestDto,
  GetTodosRequestDto,
  GetTodosResponseDto,
  TodoDto,
} from '@/types/api'

export class TodoService {
  async getTodos(params?: GetTodosRequestDto): Promise<GetTodosResponseDto> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const queryString = searchParams.toString()
    const endpoint = `/todos${queryString ? `?${queryString}` : ''}`

    const response = await httpClient.get<GetTodosResponseDto>(endpoint)

    // HttpClient already returns ApiResponse<GetTodosResponseDto>, so response.data is GetTodosResponseDto
    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to fetch todos')
  }

  async getTodoById(id: string): Promise<TodoDto> {
    const response = await httpClient.get<TodoDto>(`/todos/${id}`)

    // HttpClient already returns ApiResponse<TodoDto>, so response.data is TodoDto
    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to fetch todo')
  }

  async createTodo(data: CreateTodoRequestDto): Promise<TodoDto> {
    const response = await httpClient.post<CreateTodoResponseDto>('/todos', data)

    // HttpClient already returns ApiResponse<CreateTodoResponseDto>, so response.data is CreateTodoResponseDto
    if (response.success && response.data) {
      return response.data.todo
    }

    throw new Error(response.message || 'Failed to create todo')
  }

  async updateTodo(id: string, data: UpdateTodoRequestDto): Promise<TodoDto> {
    const response = await httpClient.put<UpdateTodoResponseDto>(`/todos/${id}`, data)

    // HttpClient already returns ApiResponse<UpdateTodoResponseDto>, so response.data is UpdateTodoResponseDto
    if (response.success && response.data) {
      return response.data.todo
    }

    throw new Error(response.message || 'Failed to update todo')
  }

  async updateTodoStatus(id: string, data: UpdateTodoStatusRequestDto): Promise<TodoDto> {
    // Use the specific status update endpoint
    const response = await httpClient.put<{ todo: TodoDto }>(`/todos/${id}/status`, data)

    // HttpClient already returns ApiResponse<{ todo: TodoDto }>, so response.data is { todo: TodoDto }
    if (response.success && response.data) {
      return response.data.todo
    }

    throw new Error(response.message || 'Failed to update todo status')
  }

  async deleteTodo(id: string): Promise<void> {
    const response = await httpClient.delete(`/todos/${id}`)

    // HttpClient already returns ApiResponse, so we check response.success directly
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete todo')
    }
  }
}

// Export singleton instance
export const todoService = new TodoService()
