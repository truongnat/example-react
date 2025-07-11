import { useEffect, useState } from 'react';
import { Users, Phone, Video, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { InviteUsersDialog } from './InviteUsersDialog';
import { RoomSettings } from './RoomSettings';
import { InlineConnectionStatus } from '@/components/ConnectionStatus';
import { useChatStore } from '@/stores/chatStore';
import { useRoom, useInfiniteMessages, useRealTimeMessages, useRealTimeTyping, useRealTimeUserStatus, useRoomDeletionRedirect, useRoomUpdateNotification, useUserRemovalRedirect, useRealTimeMemberRemoval, useSocketStatus } from '@/hooks/useChat';
import { useAuthStore } from '@/stores/authStore';

interface ChatRoomProps {
  roomId: string;
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const {
    setCurrentRoom,
    joinRoom,
    messagesByRoom,
  } = useChatStore();

  const { connected } = useSocketStatus();
  const { user } = useAuthStore();
  
  // Fetch room data
  const { data: room, isLoading: roomLoading, error: roomError } = useRoom(roomId);
  
  // Fetch messages with infinite scroll
  const {
    data: messagesData,
    isLoading: messagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages(roomId);
  
  // Setup real-time message updates
  useRealTimeMessages(roomId);

  // Enable real-time typing indicators
  useRealTimeTyping(roomId);

  // Enable real-time user status updates
  useRealTimeUserStatus();

  // Handle room deletion redirect
  useRoomDeletionRedirect(roomId);

  // Handle room update notifications
  useRoomUpdateNotification(roomId);

  // Handle user removal from room (redirect)
  useUserRemovalRedirect();

  // Handle member removal notifications
  useRealTimeMemberRemoval();
  
  // Get messages from store (real-time updates)
  const storeMessages = messagesByRoom[roomId] || [];
  
  // Combine server messages with store messages, prioritizing store messages (real-time)
  const allMessages = messagesData?.pages.flatMap(page => page.messages) || [];

  // Create a Map to deduplicate by ID, prioritizing store messages
  const messageMap = new Map();

  // Add server messages first
  allMessages.forEach(msg => {
    messageMap.set(msg.id, msg);
  });

  // Add store messages (will overwrite server messages with same ID)
  storeMessages.forEach(msg => {
    messageMap.set(msg.id, msg);
  });

  const combinedMessages = Array.from(messageMap.values())
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // ASC: oldest first, newest last

  // Set current room and join via socket
  useEffect(() => {
    setCurrentRoom(roomId);
    
    if (connected) {
      joinRoom(roomId);
    }
    
    return () => {
      setCurrentRoom(null);
    };
  }, [roomId, connected, setCurrentRoom, joinRoom]);

  if (roomError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load room</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (roomLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading room...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Room not found</div>
      </div>
    );
  }



  return (
    <div className="h-full flex flex-col bg-white">
      {/* Room header - Sticky */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={room.avatarUrl} />
            <AvatarFallback>
              {room.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="font-semibold text-gray-900">{room.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{room.participants.length} members</span>
              <span>•</span>
              <InlineConnectionStatus />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Show invite button only for room author */}
          {user && room.authorId === user.id && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setShowInviteDialog(true)}
              title="Invite users to this room"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          )}

          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Phone className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Video className="w-4 h-4" />
          </Button>
          <RoomSettings
            roomId={roomId}
            roomName={room.name}
            isAuthor={user?.id === room.authorId}
            room={room}
          />
        </div>
      </div>
      
      {/* Connection status - Also sticky */}
      {!connected && (
        <div className="sticky top-[73px] z-10 bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span>Reconnecting to chat...</span>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <MessageList
        roomId={roomId}
        messages={combinedMessages}
        isLoading={messagesLoading || isFetchingNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={() => fetchNextPage()}
      />
      
      {/* Message input */}
      <MessageInput
        roomId={roomId}
        disabled={!connected}
        placeholder={
          connected
            ? "Type a message..."
            : "Connecting to chat..."
        }
      />

      {/* Invite Users Dialog */}
      <InviteUsersDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        roomId={roomId}
        roomName={room.name}
      />
    </div>
  );
}
