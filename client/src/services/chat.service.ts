import { httpClient } from '@/lib/http-client';
import { MessageData, RoomData } from './socket.service';

export interface CreateRoomRequest {
  name: string;
  avatarUrl?: string;
}

export interface UpdateRoomRequest {
  name?: string;
  avatarUrl?: string;
}

export interface CreateMessageRequest {
  content: string;
  roomId: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoomsResponse {
  rooms: RoomData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MessagesResponse {
  messages: MessageData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

class ChatService {
  private baseUrl = '/api/chat';

  // Room operations
  async getRooms(page = 1, limit = 10): Promise<RoomsResponse> {
    const response = await httpClient.get<ApiResponse<RoomsResponse>>(
      `${this.baseUrl}/rooms?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  async getRoom(roomId: string): Promise<RoomData> {
    const response = await httpClient.get<ApiResponse<{ room: RoomData }>>(
      `${this.baseUrl}/rooms/${roomId}`
    );
    return response.data.data.room;
  }

  async createRoom(data: CreateRoomRequest): Promise<RoomData> {
    const response = await httpClient.post<ApiResponse<{ room: RoomData }>>(
      `${this.baseUrl}/rooms`,
      data
    );
    return response.data.data.room;
  }

  async updateRoom(roomId: string, data: UpdateRoomRequest): Promise<RoomData> {
    const response = await httpClient.put<ApiResponse<{ room: RoomData }>>(
      `${this.baseUrl}/rooms/${roomId}`,
      data
    );
    return response.data.data.room;
  }

  async deleteRoom(roomId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/rooms/${roomId}`);
  }

  async joinRoom(roomId: string): Promise<RoomData> {
    const response = await httpClient.post<ApiResponse<{ room: RoomData }>>(
      `${this.baseUrl}/rooms/${roomId}/join`
    );
    return response.data.data.room;
  }

  async leaveRoom(roomId: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/rooms/${roomId}/leave`);
  }

  // Message operations
  async getMessages(roomId: string, page = 1, limit = 50): Promise<MessagesResponse> {
    const response = await httpClient.get<ApiResponse<MessagesResponse>>(
      `${this.baseUrl}/rooms/${roomId}/messages?page=${page}&limit=${limit}`
    );
    return response.data.data;
  }

  async updateMessage(roomId: string, messageId: string, data: UpdateMessageRequest): Promise<MessageData> {
    const response = await httpClient.put<ApiResponse<{ message: MessageData }>>(
      `${this.baseUrl}/rooms/${roomId}/messages/${messageId}`,
      data
    );
    return response.data.data.message;
  }

  async deleteMessage(roomId: string, messageId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/rooms/${roomId}/messages/${messageId}`);
  }
}

export const chatService = new ChatService();
