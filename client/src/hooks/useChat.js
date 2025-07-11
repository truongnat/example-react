var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';
import { socketService } from '@/services/socket.service';
import { useEffect, useCallback } from 'react';
// Query keys
export const chatKeys = {
    all: ['chat'],
    rooms: () => [...chatKeys.all, 'rooms'],
    room: (id) => [...chatKeys.all, 'room', id],
    messages: (roomId) => [...chatKeys.all, 'messages', roomId],
};
// Rooms hooks
export function useRooms(page = 1, limit = 10) {
    return useQuery({
        queryKey: [...chatKeys.rooms(), page, limit],
        queryFn: () => chatService.getRooms(page, limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
export function useRoom(roomId) {
    return useQuery({
        queryKey: chatKeys.room(roomId),
        queryFn: () => chatService.getRoom(roomId),
        enabled: !!roomId,
        staleTime: 5 * 60 * 1000,
    });
}
export function useCreateRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => chatService.createRoom(data),
        onSuccess: () => {
            // Invalidate rooms list
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
}
export function useUpdateRoom(roomId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => chatService.updateRoom(roomId, data),
        onSuccess: (updatedRoom) => {
            // Update room cache
            queryClient.setQueryData(chatKeys.room(roomId), updatedRoom);
            // Invalidate rooms list
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
}
export function useDeleteRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId) => chatService.deleteRoom(roomId),
        onSuccess: (_, roomId) => {
            // Remove room from cache
            queryClient.removeQueries({ queryKey: chatKeys.room(roomId) });
            // Invalidate rooms list
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
}
export function useJoinRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId) => chatService.joinRoom(roomId),
        onSuccess: (updatedRoom, roomId) => {
            // Update room cache
            queryClient.setQueryData(chatKeys.room(roomId), updatedRoom);
            // Invalidate rooms list
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
            // Join room via socket
            socketService.joinRoom(roomId);
        },
    });
}
export function useLeaveRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId) => chatService.leaveRoom(roomId),
        onSuccess: (_, roomId) => {
            // Leave room via socket
            socketService.leaveRoom(roomId);
            // Invalidate rooms list
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
}
// Messages hooks
export function useMessages(roomId, page = 1, limit = 50) {
    return useQuery({
        queryKey: [...chatKeys.messages(roomId), page, limit],
        queryFn: () => chatService.getMessages(roomId, page, limit),
        enabled: !!roomId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
export function useInfiniteMessages(roomId, limit = 50) {
    return useInfiniteQuery({
        queryKey: [...chatKeys.messages(roomId), 'infinite'],
        queryFn: ({ pageParam = 1 }) => chatService.getMessages(roomId, pageParam, limit),
        enabled: !!roomId,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        staleTime: 1 * 60 * 1000,
    });
}
export function useUpdateMessage(roomId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ messageId, data }) => chatService.updateMessage(roomId, messageId, data),
        onSuccess: () => {
            // Invalidate messages for this room
            queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
        },
    });
}
export function useDeleteMessage(roomId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (messageId) => chatService.deleteMessage(roomId, messageId),
        onSuccess: () => {
            // Invalidate messages for this room
            queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
        },
    });
}
// Real-time message hook
export function useRealTimeMessages(roomId) {
    const queryClient = useQueryClient();
    const addMessage = useCallback((message) => {
        if (message.roomId !== roomId)
            return;
        // Add message to infinite query cache
        queryClient.setQueryData([...chatKeys.messages(roomId), 'infinite'], (oldData) => {
            if (!oldData)
                return oldData;
            const newPages = [...oldData.pages];
            if (newPages.length > 0) {
                // Add to first page (most recent messages)
                newPages[0] = Object.assign(Object.assign({}, newPages[0]), { messages: [message, ...newPages[0].messages], total: newPages[0].total + 1 });
            }
            return Object.assign(Object.assign({}, oldData), { pages: newPages });
        });
        // Also invalidate regular messages query
        queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
    }, [queryClient, roomId]);
    const updateMessage = useCallback((data) => {
        if (data.roomId !== roomId)
            return;
        // Update message in cache
        queryClient.setQueryData([...chatKeys.messages(roomId), 'infinite'], (oldData) => {
            if (!oldData)
                return oldData;
            const newPages = oldData.pages.map((page) => (Object.assign(Object.assign({}, page), { messages: page.messages.map((msg) => msg.id === data.messageId
                    ? Object.assign(Object.assign({}, msg), { content: data.content, updatedAt: new Date().toISOString() }) : msg) })));
            return Object.assign(Object.assign({}, oldData), { pages: newPages });
        });
    }, [queryClient, roomId]);
    const deleteMessage = useCallback((data) => {
        if (data.roomId !== roomId)
            return;
        // Remove message from cache
        queryClient.setQueryData([...chatKeys.messages(roomId), 'infinite'], (oldData) => {
            if (!oldData)
                return oldData;
            const newPages = oldData.pages.map((page) => (Object.assign(Object.assign({}, page), { messages: page.messages.filter((msg) => msg.id !== data.messageId), total: Math.max(0, page.total - 1) })));
            return Object.assign(Object.assign({}, oldData), { pages: newPages });
        });
    }, [queryClient, roomId]);
    useEffect(() => {
        if (!roomId)
            return;
        // Subscribe to real-time events
        const unsubscribeNewMessage = socketService.onNewMessage(addMessage);
        const unsubscribeUpdateMessage = socketService.onMessageUpdate(updateMessage);
        const unsubscribeDeleteMessage = socketService.onMessageDelete(deleteMessage);
        return () => {
            unsubscribeNewMessage();
            unsubscribeUpdateMessage();
            unsubscribeDeleteMessage();
        };
    }, [roomId, addMessage, updateMessage, deleteMessage]);
}
// Socket connection hook
export function useSocketConnection() {
    const queryClient = useQueryClient();
    useEffect(() => {
        const connectSocket = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socketService.connected) {
                    yield socketService.connect();
                }
            }
            catch (error) {
                console.error('Failed to connect to socket:', error);
            }
        });
        connectSocket();
        // Cleanup on unmount
        return () => {
            socketService.disconnect();
        };
    }, []);
    useEffect(() => {
        const unsubscribe = socketService.onConnectionChange((connected) => {
            if (connected) {
                // Invalidate all chat queries when reconnected
                queryClient.invalidateQueries({ queryKey: chatKeys.all });
            }
        });
        return unsubscribe;
    }, [queryClient]);
    return {
        connected: socketService.connected,
        socketId: socketService.socketId,
    };
}
