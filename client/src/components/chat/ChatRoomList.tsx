import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Search, Users, Hash, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatStore, ChatRoom } from '@/stores/chatStore';
import { useRooms, useCreateRoom, useJoinRoom, useRealTimeRoomDeletion, useRealTimeRoomUpdates } from '@/hooks/useChat';
import { useAuthStore } from '@/stores/authStore';
import { CreateRoomDialog } from './CreateRoomDialog';

interface ChatRoomListProps {
  onRoomSelect: (roomId: string) => void;
  selectedRoomId?: string;
}

interface RoomItemProps {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
}

function RoomItem({ room, isSelected, onClick }: RoomItemProps) {
  const joinRoomMutation = useJoinRoom();
  const { user } = useAuthStore();

  const handleJoinRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    joinRoomMutation.mutate(room.id);
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-100 ${
        isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
      }`}
    >
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={room.avatarUrl} />
          <AvatarFallback>
            <Hash className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        
        {/* Online indicator (placeholder) */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">
            {room.name}
          </h3>
          
          <div className="flex items-center gap-1">
            {room.unreadCount && room.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {room.unreadCount > 99 ? '99+' : room.unreadCount}
              </Badge>
            )}
            
            {room.lastActivity && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(room.lastActivity), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <span>{room.participants.length} members</span>
          </div>
          
          {/* Join button for rooms user is not part of */}
          {user && !room.participants.includes(user.id) && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleJoinRoom}
              disabled={joinRoomMutation.isPending}
              className="h-6 px-2 text-xs"
            >
              {joinRoomMutation.isPending ? 'Joining...' : 'Join'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatRoomList({ onRoomSelect, selectedRoomId }: ChatRoomListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Use API sorting instead of client-side sorting
  // Rooms are already sorted by updated_at DESC from the backend
  const { data: roomsData, isLoading, error, refetch } = useRooms(1, 10, 'updated_at', 'desc');

  // Enable real-time room deletion updates
  useRealTimeRoomDeletion();

  // Enable real-time room updates
  useRealTimeRoomUpdates();

  // Use rooms from API data instead of store
  const rooms = roomsData?.rooms || [];

  console.log('ChatRoomList Debug:', {
    isLoading,
    error,
    roomsData,
    rooms,
    roomsCount: rooms.length
  });

  // Filter rooms based on search query (only filtering, no sorting needed)
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load rooms</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Chat Rooms ({rooms.length})</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="h-8 w-8 p-0"
              title="Refresh rooms"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No rooms found' : 'No rooms available'}
            {!searchQuery && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create your first room
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredRooms.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                isSelected={selectedRoomId === room.id}
                onClick={() => onRoomSelect(room.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Create room dialog */}
      <CreateRoomDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
