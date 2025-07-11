import { UUID } from '@shared/types/common.types';

// Room DTOs
export interface CreateRoomRequestDto {
  name: string;
  avatarUrl?: string;
}

export interface UpdateRoomRequestDto {
  name?: string;
  avatarUrl?: string;
}

export interface RoomDto {
  id: UUID;
  name: string;
  avatarUrl: string;
  authorId: UUID;
  lastMessageId?: UUID;
  participants: UUID[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomWithLastMessageDto extends RoomDto {
  lastMessage?: MessageDto;
}

// Message DTOs
export interface CreateMessageRequestDto {
  content: string;
  roomId: UUID;
}

export interface UpdateMessageRequestDto {
  content: string;
}

export interface MessageDto {
  id: UUID;
  content: string;
  authorId: UUID;
  roomId: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageWithAuthorDto extends MessageDto {
  author: {
    id: UUID;
    username: string;
    avatarUrl: string;
  };
}

// Response DTOs
export interface CreateRoomResponseDto {
  room: RoomDto;
}

export interface UpdateRoomResponseDto {
  room: RoomDto;
}

export interface GetRoomsResponseDto {
  rooms: RoomWithLastMessageDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoomMemberDto {
  id: UUID;
  username: string;
  email: string;
  avatarUrl: string;
  isOnline: boolean;
  isAuthor: boolean;
  joinedAt: Date;
}

export interface GetRoomMembersResponseDto {
  members: RoomMemberDto[];
  totalMembers: number;
  roomInfo: {
    id: UUID;
    name: string;
    authorId: UUID;
    createdAt: Date;
  };
}

export interface GetRoomResponseDto {
  room: RoomDto;
}

export interface CreateMessageResponseDto {
  message: MessageDto;
}

export interface UpdateMessageResponseDto {
  message: MessageDto;
}

export interface GetMessagesResponseDto {
  messages: MessageWithAuthorDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Socket DTOs
export interface JoinRoomDto {
  roomId: UUID;
  userId: UUID;
}

export interface LeaveRoomDto {
  roomId: UUID;
  userId: UUID;
}

export interface NewMessageDto {
  message: MessageWithAuthorDto;
  roomId: UUID;
}

export interface UserTypingDto {
  userId: UUID;
  username: string;
  roomId: UUID;
  isTyping: boolean;
}
