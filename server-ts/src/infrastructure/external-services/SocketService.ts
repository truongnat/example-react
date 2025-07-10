import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UUID } from '@shared/types/common.types';
import {
  JoinRoomDto,
  LeaveRoomDto,
  NewMessageDto,
  UserTypingDto,
  CreateMessageRequestDto
} from '@application/dtos/chat.dto';

interface AuthenticatedSocket extends Socket {
  userId?: UUID;
  username?: string;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<UUID, string> = new Map(); // userId -> socketId
  private chatController: any; // Will be injected later to avoid circular dependency

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public setChatController(chatController: any): void {
    this.chatController = chatController;
  }

  public initialize(): void {
    // Authentication middleware
    this.io.use(this.authenticateSocket.bind(this));

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.username} connected with socket ${socket.id}`);
      
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      }

      // Handle room joining
      socket.on('join-room', (data: JoinRoomDto) => {
        this.handleJoinRoom(socket, data);
      });

      // Handle room leaving
      socket.on('leave-room', (data: LeaveRoomDto) => {
        this.handleLeaveRoom(socket, data);
      });

      // Handle real-time message sending
      socket.on('send-message', async (data: CreateMessageRequestDto) => {
        await this.handleSendMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('typing', (data: UserTypingDto) => {
        this.handleTyping(socket, data);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User ${socket.username} disconnected`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
      });
    });
  }

  private async authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void): Promise<void> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      
      next();
    } catch (error) {
      next(new Error('Invalid authentication token'));
    }
  }

  private handleJoinRoom(socket: AuthenticatedSocket, data: JoinRoomDto): void {
    const roomId = `room-${data.roomId}`;
    socket.join(roomId);
    
    // Notify other users in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.userId,
      username: socket.username,
      roomId: data.roomId,
    });

    console.log(`User ${socket.username} joined room ${data.roomId}`);
  }

  private handleLeaveRoom(socket: AuthenticatedSocket, data: LeaveRoomDto): void {
    const roomId = `room-${data.roomId}`;
    socket.leave(roomId);
    
    // Notify other users in the room
    socket.to(roomId).emit('user-left', {
      userId: socket.userId,
      username: socket.username,
      roomId: data.roomId,
    });

    console.log(`User ${socket.username} left room ${data.roomId}`);
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: CreateMessageRequestDto): Promise<void> {
    try {
      if (!this.chatController) {
        console.error('ChatController not injected into SocketService');
        socket.emit('error', { message: 'Server configuration error' });
        return;
      }

      // Call ChatController to handle message creation and broadcasting
      await this.chatController.handleCreateMessage(
        data,
        socket.userId!,
        socket.username!,
        '' // avatarUrl - can be fetched from user service if needed
      );
    } catch (error) {
      console.error('Error handling send message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private handleTyping(socket: AuthenticatedSocket, data: UserTypingDto): void {
    const roomId = `room-${data.roomId}`;

    // Broadcast typing status to other users in the room
    socket.to(roomId).emit('user-typing', {
      userId: socket.userId,
      username: socket.username,
      roomId: data.roomId,
      isTyping: data.isTyping,
    });
  }

  // Public methods for broadcasting messages
  public broadcastNewMessage(data: NewMessageDto): void {
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('new-message', data);
  }

  public broadcastMessageUpdate(data: { messageId: UUID; content: string; roomId: UUID }): void {
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('message-updated', data);
  }

  public broadcastMessageDelete(data: { messageId: UUID; roomId: UUID }): void {
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('message-deleted', data);
  }

  public notifyUserOnline(userId: UUID): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('user-online', { userId });
    }
  }

  public notifyUserOffline(userId: UUID): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('user-offline', { userId });
    }
  }

  public getConnectedUsers(): UUID[] {
    return Array.from(this.connectedUsers.keys());
  }

  public isUserConnected(userId: UUID): boolean {
    return this.connectedUsers.has(userId);
  }
}
