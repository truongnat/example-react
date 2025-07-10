import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { socketService, MessageData, RoomData, TypingData } from '@/services/socket.service';

export interface ChatMessage extends MessageData {
  isOptimistic?: boolean; // For optimistic updates
  error?: string; // For failed messages
}

export interface ChatRoom extends RoomData {
  unreadCount?: number;
  lastActivity?: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  roomId: string;
}

interface ChatState {
  // Current state
  currentRoomId: string | null;
  isConnected: boolean;
  
  // Rooms
  rooms: ChatRoom[];
  
  // Messages (keyed by roomId)
  messagesByRoom: Record<string, ChatMessage[]>;
  
  // Typing indicators (keyed by roomId)
  typingUsersByRoom: Record<string, TypingUser[]>;
  
  // UI state
  isTyping: Record<string, boolean>; // keyed by roomId
  typingTimeouts: Record<string, NodeJS.Timeout>; // keyed by roomId
  
  // Actions
  setCurrentRoom: (roomId: string | null) => void;
  setConnected: (connected: boolean) => void;
  
  // Room actions
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => void;
  removeRoom: (roomId: string) => void;
  
  // Message actions
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  addOptimisticMessage: (message: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string) => void;
  markMessageError: (tempId: string, error: string) => void;
  
  // Typing actions
  setTyping: (roomId: string, isTyping: boolean) => void;
  addTypingUser: (user: TypingUser) => void;
  removeTypingUser: (userId: string, roomId: string) => void;
  clearTypingUsers: (roomId: string) => void;
  
  // Utility actions
  incrementUnreadCount: (roomId: string) => void;
  clearUnreadCount: (roomId: string) => void;
  updateLastActivity: (roomId: string) => void;
  
  // Socket actions
  sendMessage: (roomId: string, content: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  
  // Cleanup
  cleanup: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentRoomId: null,
      isConnected: false,
      rooms: [],
      messagesByRoom: {},
      typingUsersByRoom: {},
      isTyping: {},
      typingTimeouts: {},

      // Basic setters
      setCurrentRoom: (roomId) => {
        set({ currentRoomId: roomId });
        
        // Clear unread count for current room
        if (roomId) {
          get().clearUnreadCount(roomId);
        }
      },

      setConnected: (connected) => {
        set({ isConnected: connected });
      },

      // Room actions
      setRooms: (rooms) => {
        set({ rooms });
      },

      addRoom: (room) => {
        set((state) => ({
          rooms: [room, ...state.rooms.filter(r => r.id !== room.id)]
        }));
      },

      updateRoom: (roomId, updates) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId ? { ...room, ...updates } : room
          )
        }));
      },

      removeRoom: (roomId) => {
        set((state) => {
          const newMessagesByRoom = { ...state.messagesByRoom };
          delete newMessagesByRoom[roomId];
          
          const newTypingUsersByRoom = { ...state.typingUsersByRoom };
          delete newTypingUsersByRoom[roomId];
          
          return {
            rooms: state.rooms.filter(room => room.id !== roomId),
            messagesByRoom: newMessagesByRoom,
            typingUsersByRoom: newTypingUsersByRoom,
            currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId
          };
        });
      },

      // Message actions
      setMessages: (roomId, messages) => {
        set((state) => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: messages
          }
        }));
      },

      addMessage: (message) => {
        set((state) => {
          const roomMessages = state.messagesByRoom[message.roomId] || [];
          
          // Remove optimistic message if this is the real message
          const filteredMessages = roomMessages.filter(msg => 
            !(msg.isOptimistic && msg.content === message.content && 
              Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000)
          );
          
          return {
            messagesByRoom: {
              ...state.messagesByRoom,
              [message.roomId]: [message, ...filteredMessages]
            }
          };
        });
        
        // Update room's last activity and increment unread if not current room
        const { currentRoomId, updateLastActivity, incrementUnreadCount } = get();
        updateLastActivity(message.roomId);
        
        if (currentRoomId !== message.roomId) {
          incrementUnreadCount(message.roomId);
        }
      },

      addOptimisticMessage: (messageData) => {
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const optimisticMessage: ChatMessage = {
          ...messageData,
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isOptimistic: true
        };
        
        set((state) => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [messageData.roomId]: [optimisticMessage, ...(state.messagesByRoom[messageData.roomId] || [])]
          }
        }));
        
        return tempId;
      },

      updateMessage: (messageId, updates) => {
        set((state) => {
          const newMessagesByRoom = { ...state.messagesByRoom };
          
          Object.keys(newMessagesByRoom).forEach(roomId => {
            newMessagesByRoom[roomId] = newMessagesByRoom[roomId].map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            );
          });
          
          return { messagesByRoom: newMessagesByRoom };
        });
      },

      removeMessage: (messageId) => {
        set((state) => {
          const newMessagesByRoom = { ...state.messagesByRoom };
          
          Object.keys(newMessagesByRoom).forEach(roomId => {
            newMessagesByRoom[roomId] = newMessagesByRoom[roomId].filter(msg => msg.id !== messageId);
          });
          
          return { messagesByRoom: newMessagesByRoom };
        });
      },

      markMessageError: (tempId, error) => {
        get().updateMessage(tempId, { error, isOptimistic: false });
      },

      // Typing actions
      setTyping: (roomId, isTyping) => {
        const state = get();
        
        // Clear existing timeout
        if (state.typingTimeouts[roomId]) {
          clearTimeout(state.typingTimeouts[roomId]);
        }
        
        // Send typing indicator
        socketService.sendTyping(roomId, isTyping);
        
        if (isTyping) {
          // Set timeout to stop typing after 3 seconds
          const timeout = setTimeout(() => {
            get().setTyping(roomId, false);
          }, 3000);
          
          set((state) => ({
            isTyping: { ...state.isTyping, [roomId]: true },
            typingTimeouts: { ...state.typingTimeouts, [roomId]: timeout }
          }));
        } else {
          set((state) => {
            const newIsTyping = { ...state.isTyping };
            delete newIsTyping[roomId];
            
            const newTimeouts = { ...state.typingTimeouts };
            delete newTimeouts[roomId];
            
            return {
              isTyping: newIsTyping,
              typingTimeouts: newTimeouts
            };
          });
        }
      },

      addTypingUser: (user) => {
        set((state) => ({
          typingUsersByRoom: {
            ...state.typingUsersByRoom,
            [user.roomId]: [
              ...(state.typingUsersByRoom[user.roomId] || []).filter(u => u.userId !== user.userId),
              user
            ]
          }
        }));
      },

      removeTypingUser: (userId, roomId) => {
        set((state) => ({
          typingUsersByRoom: {
            ...state.typingUsersByRoom,
            [roomId]: (state.typingUsersByRoom[roomId] || []).filter(u => u.userId !== userId)
          }
        }));
      },

      clearTypingUsers: (roomId) => {
        set((state) => ({
          typingUsersByRoom: {
            ...state.typingUsersByRoom,
            [roomId]: []
          }
        }));
      },

      // Utility actions
      incrementUnreadCount: (roomId) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId
              ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
              : room
          )
        }));
      },

      clearUnreadCount: (roomId) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId
              ? { ...room, unreadCount: 0 }
              : room
          )
        }));
      },

      updateLastActivity: (roomId) => {
        const now = new Date().toISOString();
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId
              ? { ...room, lastActivity: now }
              : room
          )
        }));
      },

      // Socket actions
      sendMessage: (roomId, content) => {
        // Add optimistic message
        const tempId = get().addOptimisticMessage({
          content,
          roomId,
          authorId: '', // Will be filled by socket response
          author: {
            id: '',
            username: '',
            avatarUrl: ''
          }
        });
        
        // Send via socket
        socketService.sendMessage(roomId, content);
        
        // Update last activity
        get().updateLastActivity(roomId);
      },

      joinRoom: (roomId) => {
        socketService.joinRoom(roomId);
      },

      leaveRoom: (roomId) => {
        socketService.leaveRoom(roomId);
      },

      // Cleanup
      cleanup: () => {
        const state = get();
        
        // Clear all timeouts
        Object.values(state.typingTimeouts).forEach(timeout => {
          clearTimeout(timeout);
        });
        
        set({
          currentRoomId: null,
          isConnected: false,
          rooms: [],
          messagesByRoom: {},
          typingUsersByRoom: {},
          isTyping: {},
          typingTimeouts: {}
        });
      }
    }),
    {
      name: 'chat-store'
    }
  )
);
