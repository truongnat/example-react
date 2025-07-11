import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

export interface MessageData {
  id: string;
  content: string;
  authorId: string;
  roomId: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoomData {
  id: string;
  name: string;
  avatarUrl: string;
  authorId: string;
  participants: string[];
  lastMessageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypingData {
  userId: string;
  username: string;
  roomId: string;
  isTyping: boolean;
}

export interface UserJoinedData {
  userId: string;
  username: string;
  roomId: string;
}

export interface UserLeftData {
  userId: string;
  username: string;
  roomId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private connectionPromise: Promise<void> | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionRefCount = 0; // Track how many components are using the connection

  // Event listeners
  private messageListeners: ((message: MessageData) => void)[] = [];
  private messageUpdateListeners: ((data: { messageId: string; content: string; roomId: string }) => void)[] = [];
  private messageDeleteListeners: ((data: { messageId: string; roomId: string }) => void)[] = [];
  private typingListeners: ((data: TypingData) => void)[] = [];
  private userJoinedListeners: ((data: UserJoinedData) => void)[] = [];
  private userLeftListeners: ((data: UserLeftData) => void)[] = [];
  private userOfflineInRoomListeners: ((data: { userId: string; username: string; roomId: string }) => void)[] = [];
  private roomDeletedListeners: ((data: { roomId: string; roomName: string; message: string }) => void)[] = [];
  private roomUpdatedListeners: ((data: { roomId: string; roomName: string; avatarUrl: string; updatedRoom: any; message: string }) => void)[] = [];
  private roomListUpdatedListeners: ((data: { action: string; room: any }) => void)[] = [];
  private userRemovedFromRoomListeners: ((data: { roomId: string; roomName: string; message: string }) => void)[] = [];
  private memberRemovedListeners: ((data: { roomId: string; roomName: string; removedUserId: string; removedUsername: string; message: string }) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  connect(): Promise<void> {
    // Increment reference count
    this.connectionRefCount++;

    // If already connected or connecting, return existing promise
    if (this.isConnected) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // Clear any existing reconnect timeout
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }

        const authStore = useAuthStore.getState();
        const token = authStore.tokens?.accessToken;

        if (!token) {
          this.connectionPromise = null;
          reject(new Error('No authentication token available'));
          return;
        }

        // Disconnect existing socket if any
        if (this.socket) {
          this.socket.removeAllListeners();
          this.socket.disconnect();
        }

        // Create socket connection
        this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true, // Force new connection
        });

        // Connection event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.connectionPromise = null;
          this.notifyConnectionListeners(true);
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          this.isConnected = false;
          this.connectionPromise = null;
          this.notifyConnectionListeners(false);

          // Only auto-reconnect if we still have active references
          if (this.connectionRefCount > 0) {
            // Auto-reconnect for certain disconnect reasons
            if (reason === 'io server disconnect' || reason === 'io client disconnect') {
              // Server or client initiated disconnect, don't reconnect
              return;
            }

            this.handleReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.isConnected = false;
          this.connectionPromise = null;
          this.notifyConnectionListeners(false);

          // Check if it's an authentication error
          if (error.message?.includes('Authentication') || error.message?.includes('token')) {
            // Try to refresh token and reconnect
            this.handleTokenRefreshAndReconnect().catch(() => {
              if (this.reconnectAttempts === 0) {
                reject(error);
              }
            });
          } else {
            if (this.reconnectAttempts === 0) {
              reject(error);
            }

            // Only reconnect if we still have active references
            if (this.connectionRefCount > 0) {
              this.handleReconnect();
            }
          }
        });

        // Chat event handlers
        this.socket.on('new-message', (data: { message: MessageData; roomId: string }) => {
          this.notifyMessageListeners(data.message);
        });

        this.socket.on('message-updated', (data: { messageId: string; content: string; roomId: string }) => {
          this.notifyMessageUpdateListeners(data);
        });

        this.socket.on('message-deleted', (data: { messageId: string; roomId: string }) => {
          this.notifyMessageDeleteListeners(data);
        });

        this.socket.on('user-typing', (data: TypingData) => {
          this.notifyTypingListeners(data);
        });

        this.socket.on('user-joined', (data: UserJoinedData) => {
          this.notifyUserJoinedListeners(data);
        });

        this.socket.on('user-left', (data: UserLeftData) => {
          this.notifyUserLeftListeners(data);
        });

        this.socket.on('user-offline-in-room', (data: { userId: string; username: string; roomId: string }) => {
          this.notifyUserOfflineInRoomListeners(data);
        });

        this.socket.on('room-deleted', (data: { roomId: string; roomName: string; message: string }) => {
          this.notifyRoomDeletedListeners(data);
        });

        this.socket.on('room-updated', (data: { roomId: string; roomName: string; avatarUrl: string; updatedRoom: any; message: string }) => {
          this.notifyRoomUpdatedListeners(data);
        });

        this.socket.on('room-list-updated', (data: { action: string; room: any }) => {
          this.notifyRoomListUpdatedListeners(data);
        });

        this.socket.on('user-removed-from-room', (data: { roomId: string; roomName: string; message: string }) => {
          this.notifyUserRemovedFromRoomListeners(data);
        });

        this.socket.on('member-removed', (data: { roomId: string; roomName: string; removedUserId: string; removedUsername: string; message: string }) => {
          this.notifyMemberRemovedListeners(data);
        });

        this.socket.on('error', (error: any) => {
          console.error('Socket error:', error);
        });

      } catch (error) {
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect(): void {
    // Decrement reference count
    this.connectionRefCount = Math.max(0, this.connectionRefCount - 1);

    // Only disconnect if no more references
    if (this.connectionRefCount === 0) {
      this.forceDisconnect();
    }
  }

  private forceDisconnect(): void {
    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
    this.connectionPromise = null;
    this.reconnectAttempts = 0;
    this.notifyConnectionListeners(false);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    // Don't reconnect if no active references
    if (this.connectionRefCount === 0) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isConnected && this.connectionRefCount > 0) {
        // Reset connection promise to allow new connection attempt
        this.connectionPromise = null;
        this.connect().catch(console.error);
      }
    }, delay);
  }

  private async handleTokenRefreshAndReconnect(): Promise<void> {
    try {
      // Try to refresh the token using httpClient
      const authStore = useAuthStore.getState();
      const refreshToken = authStore.tokens?.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Use httpClient's built-in refresh mechanism
      // This will automatically update tokens in storage
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.data?.tokens) {
        throw new Error('Invalid refresh token response');
      }

      // Update tokens in auth store
      authStore.setTokens(data.data.tokens);

      // Reset connection state and try to reconnect
      this.connectionPromise = null;
      this.reconnectAttempts = 0;

      if (this.connectionRefCount > 0) {
        await this.connect();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If token refresh fails, logout user
      const authStore = useAuthStore.getState();
      authStore.logout();

      // Don't try normal reconnect after auth failure
      throw error;
    }
  }

  // Room operations
  joinRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      const authStore = useAuthStore.getState();
      this.socket.emit('join-room', {
        roomId,
        userId: authStore.user?.id
      });
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      const authStore = useAuthStore.getState();
      this.socket.emit('leave-room', {
        roomId,
        userId: authStore.user?.id
      });
    }
  }

  // Message operations
  sendMessage(roomId: string, content: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', {
        roomId,
        content
      });
    }
  }

  // Typing indicators
  sendTyping(roomId: string, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      const authStore = useAuthStore.getState();
      this.socket.emit('typing', {
        roomId,
        userId: authStore.user?.id,
        username: authStore.user?.name, // ✅ Correct: use name (mapped from backend username)
        isTyping
      });
    }
  }

  // Event listener management
  onNewMessage(callback: (message: MessageData) => void): () => void {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
    };
  }

  onMessageUpdate(callback: (data: { messageId: string; content: string; roomId: string }) => void): () => void {
    this.messageUpdateListeners.push(callback);
    return () => {
      this.messageUpdateListeners = this.messageUpdateListeners.filter(cb => cb !== callback);
    };
  }

  onMessageDelete(callback: (data: { messageId: string; roomId: string }) => void): () => void {
    this.messageDeleteListeners.push(callback);
    return () => {
      this.messageDeleteListeners = this.messageDeleteListeners.filter(cb => cb !== callback);
    };
  }

  onTyping(callback: (data: TypingData) => void): () => void {
    this.typingListeners.push(callback);
    return () => {
      this.typingListeners = this.typingListeners.filter(cb => cb !== callback);
    };
  }

  onUserJoined(callback: (data: UserJoinedData) => void): () => void {
    this.userJoinedListeners.push(callback);
    return () => {
      this.userJoinedListeners = this.userJoinedListeners.filter(cb => cb !== callback);
    };
  }

  onUserLeft(callback: (data: UserLeftData) => void): () => void {
    this.userLeftListeners.push(callback);
    return () => {
      this.userLeftListeners = this.userLeftListeners.filter(cb => cb !== callback);
    };
  }

  onUserOfflineInRoom(callback: (data: { userId: string; username: string; roomId: string }) => void): () => void {
    this.userOfflineInRoomListeners.push(callback);
    return () => {
      this.userOfflineInRoomListeners = this.userOfflineInRoomListeners.filter(cb => cb !== callback);
    };
  }

  onRoomDeleted(callback: (data: { roomId: string; roomName: string; message: string }) => void): () => void {
    this.roomDeletedListeners.push(callback);
    return () => {
      this.roomDeletedListeners = this.roomDeletedListeners.filter(cb => cb !== callback);
    };
  }

  onRoomUpdated(callback: (data: { roomId: string; roomName: string; avatarUrl: string; updatedRoom: any; message: string }) => void): () => void {
    this.roomUpdatedListeners.push(callback);
    return () => {
      this.roomUpdatedListeners = this.roomUpdatedListeners.filter(cb => cb !== callback);
    };
  }

  onRoomListUpdated(callback: (data: { action: string; room: any }) => void): () => void {
    this.roomListUpdatedListeners.push(callback);
    return () => {
      this.roomListUpdatedListeners = this.roomListUpdatedListeners.filter(cb => cb !== callback);
    };
  }

  onUserRemovedFromRoom(callback: (data: { roomId: string; roomName: string; message: string }) => void): () => void {
    this.userRemovedFromRoomListeners.push(callback);
    return () => {
      this.userRemovedFromRoomListeners = this.userRemovedFromRoomListeners.filter(cb => cb !== callback);
    };
  }

  onMemberRemoved(callback: (data: { roomId: string; roomName: string; removedUserId: string; removedUsername: string; message: string }) => void): () => void {
    this.memberRemovedListeners.push(callback);
    return () => {
      this.memberRemovedListeners = this.memberRemovedListeners.filter(cb => cb !== callback);
    };
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback);
    };
  }

  // Notification methods
  private notifyMessageListeners(message: MessageData): void {
    this.messageListeners.forEach(callback => callback(message));
  }

  private notifyMessageUpdateListeners(data: { messageId: string; content: string; roomId: string }): void {
    this.messageUpdateListeners.forEach(callback => callback(data));
  }

  private notifyMessageDeleteListeners(data: { messageId: string; roomId: string }): void {
    this.messageDeleteListeners.forEach(callback => callback(data));
  }

  private notifyTypingListeners(data: TypingData): void {
    this.typingListeners.forEach(callback => callback(data));
  }

  private notifyUserJoinedListeners(data: UserJoinedData): void {
    this.userJoinedListeners.forEach(callback => callback(data));
  }

  private notifyUserLeftListeners(data: UserLeftData): void {
    this.userLeftListeners.forEach(callback => callback(data));
  }

  private notifyUserOfflineInRoomListeners(data: { userId: string; username: string; roomId: string }): void {
    this.userOfflineInRoomListeners.forEach(callback => callback(data));
  }

  private notifyRoomDeletedListeners(data: { roomId: string; roomName: string; message: string }): void {
    this.roomDeletedListeners.forEach(callback => callback(data));
  }

  private notifyRoomUpdatedListeners(data: { roomId: string; roomName: string; avatarUrl: string; updatedRoom: any; message: string }): void {
    this.roomUpdatedListeners.forEach(callback => callback(data));
  }

  private notifyRoomListUpdatedListeners(data: { action: string; room: any }): void {
    this.roomListUpdatedListeners.forEach(callback => callback(data));
  }

  private notifyUserRemovedFromRoomListeners(data: { roomId: string; roomName: string; message: string }): void {
    this.userRemovedFromRoomListeners.forEach(callback => callback(data));
  }

  private notifyMemberRemovedListeners(data: { roomId: string; roomName: string; removedUserId: string; removedUsername: string; message: string }): void {
    this.memberRemovedListeners.forEach(callback => callback(data));
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(callback => callback(connected));
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton instance
export const socketService = new SocketService();
