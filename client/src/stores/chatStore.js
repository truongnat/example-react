import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { socketService } from '@/services/socket.service';
export const useChatStore = create()(devtools((set, get) => ({
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
            rooms: state.rooms.map(room => room.id === roomId ? Object.assign(Object.assign({}, room), updates) : room)
        }));
    },
    removeRoom: (roomId) => {
        set((state) => {
            const newMessagesByRoom = Object.assign({}, state.messagesByRoom);
            delete newMessagesByRoom[roomId];
            const newTypingUsersByRoom = Object.assign({}, state.typingUsersByRoom);
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
            messagesByRoom: Object.assign(Object.assign({}, state.messagesByRoom), { [roomId]: messages })
        }));
    },
    addMessage: (message) => {
        set((state) => {
            const roomMessages = state.messagesByRoom[message.roomId] || [];
            // Remove optimistic message if this is the real message
            const filteredMessages = roomMessages.filter(msg => !(msg.isOptimistic && msg.content === message.content &&
                Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000));
            return {
                messagesByRoom: Object.assign(Object.assign({}, state.messagesByRoom), { [message.roomId]: [message, ...filteredMessages] })
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
        const optimisticMessage = Object.assign(Object.assign({}, messageData), { id: tempId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isOptimistic: true });
        set((state) => ({
            messagesByRoom: Object.assign(Object.assign({}, state.messagesByRoom), { [messageData.roomId]: [optimisticMessage, ...(state.messagesByRoom[messageData.roomId] || [])] })
        }));
        return tempId;
    },
    updateMessage: (messageId, updates) => {
        set((state) => {
            const newMessagesByRoom = Object.assign({}, state.messagesByRoom);
            Object.keys(newMessagesByRoom).forEach(roomId => {
                newMessagesByRoom[roomId] = newMessagesByRoom[roomId].map(msg => msg.id === messageId ? Object.assign(Object.assign({}, msg), updates) : msg);
            });
            return { messagesByRoom: newMessagesByRoom };
        });
    },
    removeMessage: (messageId) => {
        set((state) => {
            const newMessagesByRoom = Object.assign({}, state.messagesByRoom);
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
            const timeout = window.setTimeout(() => {
                get().setTyping(roomId, false);
            }, 3000);
            set((state) => ({
                isTyping: Object.assign(Object.assign({}, state.isTyping), { [roomId]: true }),
                typingTimeouts: Object.assign(Object.assign({}, state.typingTimeouts), { [roomId]: timeout })
            }));
        }
        else {
            set((state) => {
                const newIsTyping = Object.assign({}, state.isTyping);
                delete newIsTyping[roomId];
                const newTimeouts = Object.assign({}, state.typingTimeouts);
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
            typingUsersByRoom: Object.assign(Object.assign({}, state.typingUsersByRoom), { [user.roomId]: [
                    ...(state.typingUsersByRoom[user.roomId] || []).filter(u => u.userId !== user.userId),
                    user
                ] })
        }));
    },
    removeTypingUser: (userId, roomId) => {
        set((state) => ({
            typingUsersByRoom: Object.assign(Object.assign({}, state.typingUsersByRoom), { [roomId]: (state.typingUsersByRoom[roomId] || []).filter(u => u.userId !== userId) })
        }));
    },
    clearTypingUsers: (roomId) => {
        set((state) => ({
            typingUsersByRoom: Object.assign(Object.assign({}, state.typingUsersByRoom), { [roomId]: [] })
        }));
    },
    // Utility actions
    incrementUnreadCount: (roomId) => {
        set((state) => ({
            rooms: state.rooms.map(room => room.id === roomId
                ? Object.assign(Object.assign({}, room), { unreadCount: (room.unreadCount || 0) + 1 }) : room)
        }));
    },
    clearUnreadCount: (roomId) => {
        set((state) => ({
            rooms: state.rooms.map(room => room.id === roomId
                ? Object.assign(Object.assign({}, room), { unreadCount: 0 }) : room)
        }));
    },
    updateLastActivity: (roomId) => {
        const now = new Date().toISOString();
        set((state) => ({
            rooms: state.rooms.map(room => room.id === roomId
                ? Object.assign(Object.assign({}, room), { lastActivity: now }) : room)
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
        Object.values(state.typingTimeouts).forEach((timeout) => {
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
}), {
    name: 'chat-store'
}));
