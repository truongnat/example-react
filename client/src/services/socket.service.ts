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

  // Event listeners
  private messageListeners: ((message: MessageData) => void)[] = [];
  private messageUpdateListeners: ((data: { messageId: string; content: string; roomId: string }) => void)[] = [];
  private messageDeleteListeners: ((data: { messageId: string; roomId: string }) => void)[] = [];
  private typingListeners: ((data: TypingData) => void)[] = [];
  private userJoinedListeners: ((data: UserJoinedData) => void)[] = [];
  private userLeftListeners: ((data: UserLeftData) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const authStore = useAuthStore.getState();
        const token = authStore.tokens?.accessToken;

        if (!token) {
          reject(new Error('No authentication token available'));
          return;
        }

        // Create socket connection
        this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          timeout: 10000,
        });

        // Connection event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifyConnectionListeners(true);
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          this.isConnected = false;
          this.notifyConnectionListeners(false);
          
          // Auto-reconnect for certain disconnect reasons
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, don't reconnect
            return;
          }
          
          this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.isConnected = false;
          this.notifyConnectionListeners(false);
          
          if (this.reconnectAttempts === 0) {
            reject(error);
          }
          
          this.handleReconnect();
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

        this.socket.on('error', (error: any) => {
          console.error('Socket error:', error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect().catch(console.error);
      }
    }, delay);
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
        username: authStore.user?.name,
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
