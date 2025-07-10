import { useEffect } from 'react';
import { Users, Settings, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChatStore } from '@/stores/chatStore';
import { useRoom, useInfiniteMessages, useRealTimeMessages, useSocketConnection } from '@/hooks/useChat';

interface ChatRoomProps {
  roomId: string;
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const { 
    setCurrentRoom, 
    joinRoom, 
    messagesByRoom, 
    typingUsersByRoom,
    isConnected 
  } = useChatStore();
  
  const { connected } = useSocketConnection();
  
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
  
  // Get messages from store (real-time updates)
  const storeMessages = messagesByRoom[roomId] || [];
  
  // Combine server messages with store messages
  const allMessages = messagesData?.pages.flatMap(page => page.messages) || [];
  const combinedMessages = [...storeMessages, ...allMessages]
    .filter((message, index, arr) => 
      arr.findIndex(m => m.id === message.id) === index
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  const typingUsers = typingUsersByRoom[roomId] || [];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Room header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
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
              
              {!connected && (
                <Badge variant="destructive" className="text-xs">
                  Disconnected
                </Badge>
              )}
              
              {connected && (
                <Badge variant="secondary" className="text-xs">
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Phone className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Video className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Connection status */}
      {!connected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
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
    </div>
  );
}
