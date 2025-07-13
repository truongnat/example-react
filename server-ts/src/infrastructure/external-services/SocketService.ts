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
      socket.on('disconnect', (reason) => {
        console.log(`User ${socket.username} disconnected. Reason: ${reason}`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);

          // Notify other users that this user went offline
          socket.broadcast.emit('user-offline', {
            userId: socket.userId,
            username: socket.username,
          });
        }
      });

      // Handle connection errors
      socket.on('error', (error) => {
        console.error(`Socket error for user ${socket.username}:`, error);
      });
    });
  }

  private async authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void): Promise<void> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        console.log('Socket authentication failed: No token provided');
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      socket.username = decoded.username;

      console.log(`Socket authenticated for user: ${socket.username} (${socket.userId})`);
      next();
    } catch (error) {
      console.log('Socket authentication failed:', error instanceof Error ? error.message : 'Unknown error');

      if (error instanceof jwt.TokenExpiredError) {
        next(new Error('Authentication token expired'));
      } else if (error instanceof jwt.JsonWebTokenError) {
        next(new Error('Invalid authentication token'));
      } else {
        next(new Error('Authentication failed'));
      }
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
    // Broadcast to all users in room including sender (no optimistic updates)
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

  public notifyUserInvited(data: {
    userId: string;
    roomId: string;
    invitedBy: { id: string; username: string }
  }): void {
    // Find user's socket and notify them
    const userSockets = this.getUserSockets(data.userId);
    userSockets.forEach(socket => {
      socket.emit('room-invitation', {
        roomId: data.roomId,
        invitedBy: data.invitedBy,
        message: `${data.invitedBy.username} invited you to join a chat room`,
      });
    });
  }

  private getUserSockets(userId: string): AuthenticatedSocket[] {
    const sockets: AuthenticatedSocket[] = [];
    this.io.sockets.sockets.forEach((socket) => {
      const authSocket = socket as AuthenticatedSocket;
      if (authSocket.userId === userId) {
        sockets.push(authSocket);
      }
    });
    return sockets;
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

  public broadcastUserOfflineToRoom(data: {
    userId: UUID;
    username: string;
    roomId: UUID;
  }): void {
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('user-offline-in-room', {
      userId: data.userId,
      username: data.username,
      roomId: data.roomId,
    });
  }

  public disconnectUser(userId: UUID): void {
    const userSockets = this.getUserSockets(userId);
    userSockets.forEach(socket => {
      socket.disconnect(true);
    });
    this.connectedUsers.delete(userId);
  }

  public broadcastRoomDeleted(data: {
    roomId: UUID;
    roomName: string;
    participants: UUID[];
  }): void {
    // Broadcast to all participants that the room was deleted
    data.participants.forEach(participantId => {
      const userSockets = this.getUserSockets(participantId);
      userSockets.forEach(socket => {
        socket.emit('room-deleted', {
          roomId: data.roomId,
          roomName: data.roomName,
          message: `Room "${data.roomName}" has been deleted`,
        });
      });
    });

    // Also broadcast to the room channel in case anyone is still connected
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('room-deleted', {
      roomId: data.roomId,
      roomName: data.roomName,
      message: `Room "${data.roomName}" has been deleted`,
    });
  }

  public broadcastRoomUpdated(data: {
    roomId: UUID;
    roomName: string;
    avatarUrl: string;
    participants: UUID[];
    updatedRoom: any;
  }): void {
    // Broadcast to all participants that the room was updated
    data.participants.forEach(participantId => {
      const userSockets = this.getUserSockets(participantId);
      userSockets.forEach(socket => {
        socket.emit('room-updated', {
          roomId: data.roomId,
          roomName: data.roomName,
          avatarUrl: data.avatarUrl,
          updatedRoom: data.updatedRoom,
          message: `Room "${data.roomName}" has been updated`,
        });
      });
    });

    // Also broadcast to the room channel
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('room-updated', {
      roomId: data.roomId,
      roomName: data.roomName,
      avatarUrl: data.avatarUrl,
      updatedRoom: data.updatedRoom,
      message: `Room "${data.roomName}" has been updated`,
    });

    // Broadcast to all users to update room lists
    this.io.emit('room-list-updated', {
      action: 'updated',
      room: data.updatedRoom,
    });
  }

  public notifyUserRemovedFromRoom(data: {
    userId: UUID;
    username: string;
    roomId: UUID;
    roomName: string;
  }): void {
    // Notify the specific user that they were removed from the room
    const userSockets = this.getUserSockets(data.userId);
    userSockets.forEach(socket => {
      socket.emit('user-removed-from-room', {
        roomId: data.roomId,
        roomName: data.roomName,
        message: `You have been removed from room "${data.roomName}"`,
      });
    });
  }

  public broadcastMemberRemoved(data: {
    roomId: UUID;
    roomName: string;
    removedUserId: UUID;
    removedUsername: string;
    remainingParticipants: UUID[];
  }): void {
    // Broadcast to remaining participants that a member was removed
    data.remainingParticipants.forEach(participantId => {
      const userSockets = this.getUserSockets(participantId);
      userSockets.forEach(socket => {
        socket.emit('member-removed', {
          roomId: data.roomId,
          roomName: data.roomName,
          removedUserId: data.removedUserId,
          removedUsername: data.removedUsername,
          message: `${data.removedUsername} was removed from the room`,
        });
      });
    });

    // Also broadcast to the room channel
    const roomId = `room-${data.roomId}`;
    this.io.to(roomId).emit('member-removed', {
      roomId: data.roomId,
      roomName: data.roomName,
      removedUserId: data.removedUserId,
      removedUsername: data.removedUsername,
      message: `${data.removedUsername} was removed from the room`,
    });
  }

  public isUserConnected(userId: UUID): boolean {
    return this.connectedUsers.has(userId);
  }

  // Additional methods for testing and general use
  public emitToRoom(roomId: string, event: string, data?: any): void {
    this.io.to(roomId).emit(event, data);
  }

  public emitToUser(userId: UUID, event: string, data?: any): void {
    try {
      const userSockets = this.getUserSockets(userId);
      userSockets.forEach(socket => {
        try {
          socket.emit(event, data);
        } catch (error) {
          console.error(`Error emitting to socket ${socket.id}:`, error);
        }
      });
    } catch (error) {
      console.error(`Error in emitToUser for user ${userId}:`, error);
    }
  }

  public getUserSocketIds(userId: UUID): string[] {
    const userSockets = this.getUserSockets(userId);
    return userSockets.map(socket => socket.id);
  }

  public joinRoom(userId: UUID, roomId: string): void {
    try {
      const userSockets = this.getUserSockets(userId);
      userSockets.forEach(socket => {
        try {
          socket.join(roomId);
        } catch (error) {
          console.error(`Error joining socket ${socket.id} to room ${roomId}:`, error);
        }
      });
    } catch (error) {
      console.error(`Error in joinRoom for user ${userId}:`, error);
    }
  }

  public leaveRoom(userId: UUID, roomId: string): void {
    try {
      const userSockets = this.getUserSockets(userId);
      userSockets.forEach(socket => {
        try {
          socket.leave(roomId);
        } catch (error) {
          console.error(`Error leaving socket ${socket.id} from room ${roomId}:`, error);
        }
      });
    } catch (error) {
      console.error(`Error in leaveRoom for user ${userId}:`, error);
    }
  }

  public broadcast(event: string, data?: any): void {
    this.io.emit(event, data);
  }
}
