import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        // Event listeners
        this.messageListeners = [];
        this.messageUpdateListeners = [];
        this.messageDeleteListeners = [];
        this.typingListeners = [];
        this.userJoinedListeners = [];
        this.userLeftListeners = [];
        this.connectionListeners = [];
    }
    connect() {
        return new Promise((resolve, reject) => {
            var _a;
            try {
                const authStore = useAuthStore.getState();
                const token = (_a = authStore.tokens) === null || _a === void 0 ? void 0 : _a.accessToken;
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
                    var _a;
                    console.log('Socket connected:', (_a = this.socket) === null || _a === void 0 ? void 0 : _a.id);
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
                this.socket.on('new-message', (data) => {
                    this.notifyMessageListeners(data.message);
                });
                this.socket.on('message-updated', (data) => {
                    this.notifyMessageUpdateListeners(data);
                });
                this.socket.on('message-deleted', (data) => {
                    this.notifyMessageDeleteListeners(data);
                });
                this.socket.on('user-typing', (data) => {
                    this.notifyTypingListeners(data);
                });
                this.socket.on('user-joined', (data) => {
                    this.notifyUserJoinedListeners(data);
                });
                this.socket.on('user-left', (data) => {
                    this.notifyUserLeftListeners(data);
                });
                this.socket.on('error', (error) => {
                    console.error('Socket error:', error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.notifyConnectionListeners(false);
        }
    }
    handleReconnect() {
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
    joinRoom(roomId) {
        var _a;
        if (this.socket && this.isConnected) {
            const authStore = useAuthStore.getState();
            this.socket.emit('join-room', {
                roomId,
                userId: (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id
            });
        }
    }
    leaveRoom(roomId) {
        var _a;
        if (this.socket && this.isConnected) {
            const authStore = useAuthStore.getState();
            this.socket.emit('leave-room', {
                roomId,
                userId: (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id
            });
        }
    }
    // Message operations
    sendMessage(roomId, content) {
        if (this.socket && this.isConnected) {
            this.socket.emit('send-message', {
                roomId,
                content
            });
        }
    }
    // Typing indicators
    sendTyping(roomId, isTyping) {
        var _a, _b;
        if (this.socket && this.isConnected) {
            const authStore = useAuthStore.getState();
            this.socket.emit('typing', {
                roomId,
                userId: (_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id,
                username: (_b = authStore.user) === null || _b === void 0 ? void 0 : _b.name,
                isTyping
            });
        }
    }
    // Event listener management
    onNewMessage(callback) {
        this.messageListeners.push(callback);
        return () => {
            this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
        };
    }
    onMessageUpdate(callback) {
        this.messageUpdateListeners.push(callback);
        return () => {
            this.messageUpdateListeners = this.messageUpdateListeners.filter(cb => cb !== callback);
        };
    }
    onMessageDelete(callback) {
        this.messageDeleteListeners.push(callback);
        return () => {
            this.messageDeleteListeners = this.messageDeleteListeners.filter(cb => cb !== callback);
        };
    }
    onTyping(callback) {
        this.typingListeners.push(callback);
        return () => {
            this.typingListeners = this.typingListeners.filter(cb => cb !== callback);
        };
    }
    onUserJoined(callback) {
        this.userJoinedListeners.push(callback);
        return () => {
            this.userJoinedListeners = this.userJoinedListeners.filter(cb => cb !== callback);
        };
    }
    onUserLeft(callback) {
        this.userLeftListeners.push(callback);
        return () => {
            this.userLeftListeners = this.userLeftListeners.filter(cb => cb !== callback);
        };
    }
    onConnectionChange(callback) {
        this.connectionListeners.push(callback);
        return () => {
            this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback);
        };
    }
    // Notification methods
    notifyMessageListeners(message) {
        this.messageListeners.forEach(callback => callback(message));
    }
    notifyMessageUpdateListeners(data) {
        this.messageUpdateListeners.forEach(callback => callback(data));
    }
    notifyMessageDeleteListeners(data) {
        this.messageDeleteListeners.forEach(callback => callback(data));
    }
    notifyTypingListeners(data) {
        this.typingListeners.forEach(callback => callback(data));
    }
    notifyUserJoinedListeners(data) {
        this.userJoinedListeners.forEach(callback => callback(data));
    }
    notifyUserLeftListeners(data) {
        this.userLeftListeners.forEach(callback => callback(data));
    }
    notifyConnectionListeners(connected) {
        this.connectionListeners.forEach(callback => callback(connected));
    }
    // Getters
    get connected() {
        return this.isConnected;
    }
    get socketId() {
        var _a;
        return (_a = this.socket) === null || _a === void 0 ? void 0 : _a.id;
    }
}
// Export singleton instance
export const socketService = new SocketService();
