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
    
    if (response.success && response.data) {
      return response.data
    }
    
    throw new Error(response.message || 'Failed to fetch todos')
  }

  async getTodoById(id: string): Promise<TodoDto> {
    const response = await httpClient.get<TodoDto>(`/todos/${id}`)
    
    if (response.success && response.data) {
      return response.data
    }
    
    throw new Error(response.message || 'Failed to fetch todo')
  }

  async createTodo(data: CreateTodoRequestDto): Promise<TodoDto> {
    const response = await httpClient.post<CreateTodoResponseDto>('/todos', data)
    
    if (response.success && response.data) {
      return response.data.todo
    }
    
    throw new Error(response.message || 'Failed to create todo')
  }

  async updateTodo(id: string, data: UpdateTodoRequestDto): Promise<TodoDto> {
    const response = await httpClient.put<UpdateTodoResponseDto>(`/todos/${id}`, data)
    
    if (response.success && response.data) {
      return response.data.todo
    }
    
    throw new Error(response.message || 'Failed to update todo')
  }

  async updateTodoStatus(id: string, data: UpdateTodoStatusRequestDto): Promise<TodoDto> {
    // Use the general update endpoint with status in body
    const response = await httpClient.put<UpdateTodoResponseDto>(`/todos/${id}`, data)

    if (response.success && response.data) {
      return response.data.todo
    }

    throw new Error(response.message || 'Failed to update todo status')
  }

  async deleteTodo(id: string): Promise<void> {
    const response = await httpClient.delete(`/todos/${id}`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete todo')
    }
  }
}

// Export singleton instance
export const todoService = new TodoService()
