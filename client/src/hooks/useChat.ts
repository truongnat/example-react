import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { chatService, CreateRoomRequest, UpdateRoomRequest, UpdateMessageRequest } from '@/services/chat.service';
import { socketService, MessageData } from '@/services/socket.service';
import { useEffect, useCallback } from 'react';

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  room: (id: string) => [...chatKeys.all, 'room', id] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
};

// Rooms hooks
export function useRooms(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...chatKeys.rooms(), page, limit],
    queryFn: () => chatService.getRooms(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRoom(roomId: string) {
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
    mutationFn: (data: CreateRoomRequest) => chatService.createRoom(data),
    onSuccess: () => {
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

export function useUpdateRoom(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoomRequest) => chatService.updateRoom(roomId, data),
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
    mutationFn: (roomId: string) => chatService.deleteRoom(roomId),
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
    mutationFn: (roomId: string) => chatService.joinRoom(roomId),
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
    mutationFn: (roomId: string) => chatService.leaveRoom(roomId),
    onSuccess: (_, roomId) => {
      // Leave room via socket
      socketService.leaveRoom(roomId);
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

// Messages hooks
export function useMessages(roomId: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: [...chatKeys.messages(roomId), page, limit],
    queryFn: () => chatService.getMessages(roomId, page, limit),
    enabled: !!roomId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useInfiniteMessages(roomId: string, limit = 50) {
  return useInfiniteQuery({
    queryKey: [...chatKeys.messages(roomId), 'infinite'],
    queryFn: ({ pageParam = 1 }) => chatService.getMessages(roomId, pageParam as number, limit),
    enabled: !!roomId,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useUpdateMessage(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: string; data: UpdateMessageRequest }) =>
      chatService.updateMessage(roomId, messageId, data),
    onSuccess: () => {
      // Invalidate messages for this room
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
    },
  });
}

export function useDeleteMessage(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatService.deleteMessage(roomId, messageId),
    onSuccess: () => {
      // Invalidate messages for this room
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
    },
  });
}

// Real-time message hook
export function useRealTimeMessages(roomId: string) {
  const queryClient = useQueryClient();

  const addMessage = useCallback((message: MessageData) => {
    if (message.roomId !== roomId) return;

    // Add message to infinite query cache
    queryClient.setQueryData(
      [...chatKeys.messages(roomId), 'infinite'],
      (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          // Add to first page (most recent messages)
          newPages[0] = {
            ...newPages[0],
            messages: [message, ...newPages[0].messages],
            total: newPages[0].total + 1,
          };
        }

        return {
          ...oldData,
          pages: newPages,
        };
      }
    );

    // Also invalidate regular messages query
    queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
  }, [queryClient, roomId]);

  const updateMessage = useCallback((data: { messageId: string; content: string; roomId: string }) => {
    if (data.roomId !== roomId) return;

    // Update message in cache
    queryClient.setQueryData(
      [...chatKeys.messages(roomId), 'infinite'],
      (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((msg: MessageData) =>
            msg.id === data.messageId
              ? { ...msg, content: data.content, updatedAt: new Date().toISOString() }
              : msg
          ),
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      }
    );
  }, [queryClient, roomId]);

  const deleteMessage = useCallback((data: { messageId: string; roomId: string }) => {
    if (data.roomId !== roomId) return;

    // Remove message from cache
    queryClient.setQueryData(
      [...chatKeys.messages(roomId), 'infinite'],
      (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          messages: page.messages.filter((msg: MessageData) => msg.id !== data.messageId),
          total: Math.max(0, page.total - 1),
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      }
    );
  }, [queryClient, roomId]);

  useEffect(() => {
    if (!roomId) return;

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
    const connectSocket = async () => {
      try {
        if (!socketService.connected) {
          await socketService.connect();
        }
      } catch (error) {
        console.error('Failed to connect to socket:', error);
      }
    };

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
