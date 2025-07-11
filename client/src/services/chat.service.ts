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

export interface InviteUsersResponse {
  invitedUsers: {
    id: string;
    username: string;
    email: string;
  }[];
  alreadyMembers: string[];
  notFound: string[];
}

export interface RoomMember {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  isOnline: boolean;
  isAuthor: boolean;
  joinedAt: string;
}

export interface RoomMembersResponse {
  members: RoomMember[];
  totalMembers: number;
  roomInfo: {
    id: string;
    name: string;
    authorId: string;
    createdAt: string;
  };
}

class ChatService {
  private baseUrl = '/chat';

  // Room operations
  async getRooms(
    page = 1,
    limit = 10,
    sortBy: 'name' | 'updated_at' | 'created_at' = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<RoomsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    const response = await httpClient.get<RoomsResponse>(
      `${this.baseUrl}/rooms?${params.toString()}`
    );
    // HttpClient returns ApiResponse<RoomsResponse>, so we need response.data
    return response.data || { rooms: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }

  async getRoom(roomId: string): Promise<RoomData> {
    const response = await httpClient.get<{ room: RoomData }>(
      `${this.baseUrl}/rooms/${roomId}`
    );
    // HttpClient returns ApiResponse<{ room: RoomData }>, so we need response.data?.room
    return response.data?.room || {} as RoomData;
  }

  async createRoom(data: CreateRoomRequest): Promise<RoomData> {
    const response = await httpClient.post<{ room: RoomData }>(
      `${this.baseUrl}/rooms`,
      data
    );
    // HttpClient returns ApiResponse<{ room: RoomData }>, so we need response.data?.room
    return response.data?.room || {} as RoomData;
  }

  async updateRoom(roomId: string, data: UpdateRoomRequest): Promise<RoomData> {
    const response = await httpClient.put<{ room: RoomData }>(
      `${this.baseUrl}/rooms/${roomId}`,
      data
    );
    // HttpClient returns ApiResponse<{ room: RoomData }>, so we need response.data?.room
    return response.data?.room || {} as RoomData;
  }

  async deleteRoom(roomId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/rooms/${roomId}`);
  }

  async joinRoom(roomId: string): Promise<RoomData> {
    const response = await httpClient.post<{ room: RoomData }>(
      `${this.baseUrl}/rooms/${roomId}/join`
    );
    // HttpClient returns ApiResponse<{ room: RoomData }>, so we need response.data?.room
    return response.data?.room || {} as RoomData;
  }

  async leaveRoom(roomId: string): Promise<void> {
    await httpClient.post(`${this.baseUrl}/rooms/${roomId}/leave`);
  }

  async inviteUsers(roomId: string, userIds: string[]): Promise<InviteUsersResponse> {
    const response = await httpClient.post<InviteUsersResponse>(
      `${this.baseUrl}/rooms/${roomId}/invite`,
      { userIds }
    );
    // HttpClient returns ApiResponse<InviteUsersResponse>, so we need response.data
    return response.data || { invitedUsers: [], alreadyMembers: [], notFound: [] };
  }

  async getRoomMembers(roomId: string): Promise<RoomMembersResponse> {
    const response = await httpClient.get<RoomMembersResponse>(
      `${this.baseUrl}/rooms/${roomId}/members`
    );
    // HttpClient returns ApiResponse<RoomMembersResponse>, so we need response.data
    return response.data || { members: [], totalMembers: 0, roomInfo: { id: '', name: '', authorId: '', createdAt: '' } };
  }

  async removeMember(roomId: string, memberId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/rooms/${roomId}/members/${memberId}`);
  }

  // Message operations
  async getMessages(roomId: string, page = 1, limit = 50): Promise<MessagesResponse> {
    const response = await httpClient.get<MessagesResponse>(
      `${this.baseUrl}/rooms/${roomId}/messages?page=${page}&limit=${limit}`
    );
    // HttpClient returns ApiResponse<MessagesResponse>, so we need response.data
    return response.data || { messages: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  }

  async updateMessage(roomId: string, messageId: string, data: UpdateMessageRequest): Promise<MessageData> {
    const response = await httpClient.put<{ message: MessageData }>(
      `${this.baseUrl}/rooms/${roomId}/messages/${messageId}`,
      data
    );
    // HttpClient returns ApiResponse<{ message: MessageData }>, so we need response.data?.message
    return response.data?.message || {} as MessageData;
  }

  async deleteMessage(roomId: string, messageId: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/rooms/${roomId}/messages/${messageId}`);
  }
}

export const chatService = new ChatService();
