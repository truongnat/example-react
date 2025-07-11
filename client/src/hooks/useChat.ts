import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { chatService, CreateRoomRequest, UpdateRoomRequest, UpdateMessageRequest } from '@/services/chat.service';
import { socketService, MessageData, TypingData } from '@/services/socket.service';
import { useChatStore } from '@/stores/chatStore';
import { useEffect, useCallback, useState } from 'react';

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  room: (id: string) => [...chatKeys.all, 'room', id] as const,
  roomMembers: (roomId: string) => [...chatKeys.all, 'room', roomId, 'members'] as const,
  messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
};

// Rooms hooks
export function useRooms(
  page = 1,
  limit = 10,
  sortBy: 'name' | 'updated_at' | 'created_at' = 'updated_at',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  return useQuery({
    queryKey: [...chatKeys.rooms(), page, limit, sortBy, sortOrder],
    queryFn: () => chatService.getRooms(page, limit, sortBy, sortOrder),
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

export function useInviteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, userIds }: { roomId: string; userIds: string[] }) =>
      chatService.inviteUsers(roomId, userIds),
    onSuccess: (data, variables) => {
      // Invalidate rooms list and specific room to refresh participant count
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({ queryKey: chatKeys.room(variables.roomId) });

      // Show success message
      console.log(`Successfully invited ${data.invitedUsers.length} users`);
      if (data.alreadyMembers.length > 0) {
        console.log(`${data.alreadyMembers.length} users were already members`);
      }
      if (data.notFound.length > 0) {
        console.log(`${data.notFound.length} users were not found`);
      }
    },
  });
}

export function useRoomMembers(roomId: string) {
  return useQuery({
    queryKey: chatKeys.roomMembers(roomId),
    queryFn: () => chatService.getRoomMembers(roomId),
    enabled: !!roomId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, memberId }: { roomId: string; memberId: string }) =>
      chatService.removeMember(roomId, memberId),
    onSuccess: (_, variables) => {
      // Invalidate room members to refresh the list
      queryClient.invalidateQueries({ queryKey: chatKeys.roomMembers(variables.roomId) });
      // Also invalidate room data to update participant count
      queryClient.invalidateQueries({ queryKey: chatKeys.room(variables.roomId) });
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
          // Add to first page (newest messages at the end)
          newPages[0] = {
            ...newPages[0],
            messages: [...newPages[0].messages, message], // Add at the end for ASC sorting
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

// Real-time typing indicators hook
export function useRealTimeTyping(roomId: string) {
  const { addTypingUser, removeTypingUser } = useChatStore();

  const handleTyping = useCallback((data: TypingData) => {
    if (data.roomId !== roomId) return;

    if (data.isTyping) {
      addTypingUser({
        userId: data.userId,
        username: data.username,
        roomId: data.roomId,
      });
    } else {
      removeTypingUser(data.userId, data.roomId);
    }
  }, [roomId, addTypingUser, removeTypingUser]);

  useEffect(() => {
    const unsubscribe = socketService.onTyping(handleTyping);
    return unsubscribe;
  }, [handleTyping]);
}

// Real-time user offline status hook
export function useRealTimeUserStatus() {
  const queryClient = useQueryClient();

  const handleUserOfflineInRoom = useCallback((data: { userId: string; username: string; roomId: string }) => {
    // Invalidate room members query to refresh online status
    queryClient.invalidateQueries({ queryKey: chatKeys.roomMembers(data.roomId) });

    // Optionally show a notification that user went offline
    console.log(`${data.username} went offline in room ${data.roomId}`);
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = socketService.onUserOfflineInRoom(handleUserOfflineInRoom);
    return unsubscribe;
  }, [handleUserOfflineInRoom]);
}

// Real-time room deletion hook
export function useRealTimeRoomDeletion() {
  const queryClient = useQueryClient();

  const handleRoomDeleted = useCallback((data: { roomId: string; roomName: string; message: string }) => {
    // Invalidate rooms query to refresh the room list
    queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });

    // Show notification about room deletion
    console.log(`Room deleted: ${data.message}`);

    // If user is currently in the deleted room, they should be redirected
    // This will be handled by the individual room components
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = socketService.onRoomDeleted(handleRoomDeleted);
    return unsubscribe;
  }, [handleRoomDeleted]);
}

// Hook for handling room deletion when user is in the specific room
export function useRoomDeletionRedirect(roomId: string) {
  const navigate = useNavigate();

  const handleRoomDeleted = useCallback((data: { roomId: string; roomName: string; message: string }) => {
    // Only handle if this is the current room
    if (data.roomId === roomId) {
      // Show alert/notification
      alert(data.message);

      // Redirect to chat list
      navigate({ to: '/chat' });
    }
  }, [roomId, navigate]);

  useEffect(() => {
    const unsubscribe = socketService.onRoomDeleted(handleRoomDeleted);
    return unsubscribe;
  }, [handleRoomDeleted]);
}

// Real-time room update hook
export function useRealTimeRoomUpdates() {
  const queryClient = useQueryClient();

  const handleRoomUpdated = useCallback((data: { roomId: string; roomName: string; avatarUrl: string; updatedRoom: any; message: string }) => {
    // Invalidate specific room query
    queryClient.invalidateQueries({ queryKey: chatKeys.room(data.roomId) });

    // Show notification about room update
    console.log(`Room updated: ${data.message}`);
  }, [queryClient]);

  const handleRoomListUpdated = useCallback((data: { action: string; room: any }) => {
    // Invalidate rooms query to refresh the room list
    queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });

    console.log(`Room list updated: ${data.action} room ${data.room?.name || ''}`);
  }, [queryClient]);

  useEffect(() => {
    const unsubscribeRoomUpdated = socketService.onRoomUpdated(handleRoomUpdated);
    const unsubscribeRoomListUpdated = socketService.onRoomListUpdated(handleRoomListUpdated);

    return () => {
      unsubscribeRoomUpdated();
      unsubscribeRoomListUpdated();
    };
  }, [handleRoomUpdated, handleRoomListUpdated]);
}

// Hook for handling room updates when user is in the specific room
export function useRoomUpdateNotification(roomId: string) {
  const handleRoomUpdated = useCallback((data: { roomId: string; roomName: string; avatarUrl: string; updatedRoom: any; message: string }) => {
    // Only handle if this is the current room
    if (data.roomId === roomId) {
      // Show notification about room update
      console.log(`Current room updated: ${data.message}`);
      // You could show a toast notification here instead of console.log
    }
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = socketService.onRoomUpdated(handleRoomUpdated);
    return unsubscribe;
  }, [handleRoomUpdated]);
}

// Hook for handling user removal from room (redirect user)
export function useUserRemovalRedirect() {
  const navigate = useNavigate();

  const handleUserRemovedFromRoom = useCallback((data: { roomId: string; roomName: string; message: string }) => {
    // Show alert/notification
    alert(data.message);

    // Redirect to chat list
    navigate({ to: '/chat' });
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = socketService.onUserRemovedFromRoom(handleUserRemovedFromRoom);
    return unsubscribe;
  }, [handleUserRemovedFromRoom]);
}

// Hook for handling member removal notifications in room
export function useRealTimeMemberRemoval() {
  const queryClient = useQueryClient();

  const handleMemberRemoved = useCallback((data: { roomId: string; roomName: string; removedUserId: string; removedUsername: string; message: string }) => {
    // Invalidate room members query to refresh the member list
    queryClient.invalidateQueries({ queryKey: chatKeys.roomMembers(data.roomId) });

    // Invalidate room data to update participant count
    queryClient.invalidateQueries({ queryKey: chatKeys.room(data.roomId) });

    // Show notification about member removal
    console.log(`Member removed: ${data.message}`);
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = socketService.onMemberRemoved(handleMemberRemoved);
    return unsubscribe;
  }, [handleMemberRemoved]);
}

// Socket connection hook with proper lifecycle management
export function useSocketConnection() {
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState({
    connected: socketService.connected,
    socketId: socketService.socketId,
  });

  useEffect(() => {
    const connectSocket = async () => {
      try {
        if (!socketService.connected) {
          console.log('Connecting to socket...');
          await socketService.connect();
        }
      } catch (error) {
        console.error('Failed to connect to socket:', error);
      }
    };

    connectSocket();

    // Cleanup on unmount - this will decrement reference count
    return () => {
      console.log('Disconnecting socket (component unmount)');
      socketService.disconnect();
    };
  }, []); // Empty dependency array - only run once per component mount

  useEffect(() => {
    const unsubscribe = socketService.onConnectionChange((connected) => {
      console.log('Socket connection state changed:', connected);
      setConnectionState({
        connected,
        socketId: socketService.socketId,
      });

      if (connected) {
        // Invalidate all chat queries when reconnected
        queryClient.invalidateQueries({ queryKey: chatKeys.all });
      }
    });

    return unsubscribe;
  }, [queryClient]);

  return connectionState;
}

// Lightweight hook for components that just need to know connection status
export function useSocketStatus() {
  const [connected, setConnected] = useState(socketService.connected);

  useEffect(() => {
    const unsubscribe = socketService.onConnectionChange(setConnected);
    return unsubscribe;
  }, []);

  return { connected };
}
