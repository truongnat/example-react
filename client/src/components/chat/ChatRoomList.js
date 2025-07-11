import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Search, Users, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/stores/chatStore';
import { useRooms, useJoinRoom } from '@/hooks/useChat';
import { CreateRoomDialog } from './CreateRoomDialog';
function RoomItem({ room, isSelected, onClick }) {
    const joinRoomMutation = useJoinRoom();
    const handleJoinRoom = (e) => {
        e.stopPropagation();
        joinRoomMutation.mutate(room.id);
    };
    return (React.createElement("div", { onClick: onClick, className: `flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-100 ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''}` },
        React.createElement("div", { className: "relative" },
            React.createElement(Avatar, { className: "w-10 h-10" },
                React.createElement(AvatarImage, { src: room.avatarUrl }),
                React.createElement(AvatarFallback, null,
                    React.createElement(Hash, { className: "w-5 h-5" }))),
            React.createElement("div", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" })),
        React.createElement("div", { className: "flex-1 min-w-0" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("h3", { className: "font-medium text-gray-900 truncate" }, room.name),
                React.createElement("div", { className: "flex items-center gap-1" },
                    room.unreadCount && room.unreadCount > 0 && (React.createElement(Badge, { variant: "destructive", className: "text-xs" }, room.unreadCount > 99 ? '99+' : room.unreadCount)),
                    room.lastActivity && (React.createElement("span", { className: "text-xs text-gray-500" }, formatDistanceToNow(new Date(room.lastActivity), { addSuffix: true }))))),
            React.createElement("div", { className: "flex items-center justify-between mt-1" },
                React.createElement("div", { className: "flex items-center gap-1 text-xs text-gray-500" },
                    React.createElement(Users, { className: "w-3 h-3" }),
                    React.createElement("span", null,
                        room.participants.length,
                        " members")),
                !room.participants.includes('current-user-id') && (React.createElement(Button, { size: "sm", variant: "outline", onClick: handleJoinRoom, disabled: joinRoomMutation.isPending, className: "h-6 px-2 text-xs" }, joinRoomMutation.isPending ? 'Joining...' : 'Join'))))));
}
export function ChatRoomList({ onRoomSelect, selectedRoomId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const { rooms } = useChatStore();
    const { data: roomsData, isLoading, error } = useRooms();
    // Filter rooms based on search query
    const filteredRooms = rooms.filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase()));
    // Sort rooms by last activity
    const sortedRooms = [...filteredRooms].sort((a, b) => {
        const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
        const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
        return bTime - aTime;
    });
    if (error) {
        return (React.createElement("div", { className: "h-full flex items-center justify-center p-4" },
            React.createElement("div", { className: "text-center" },
                React.createElement("p", { className: "text-red-600 mb-2" }, "Failed to load rooms"),
                React.createElement(Button, { variant: "outline", onClick: () => window.location.reload() }, "Retry"))));
    }
    return (React.createElement("div", { className: "h-full flex flex-col bg-white border-r" },
        React.createElement("div", { className: "p-4 border-b" },
            React.createElement("div", { className: "flex items-center justify-between mb-3" },
                React.createElement("h2", { className: "text-lg font-semibold text-gray-900" }, "Chat Rooms"),
                React.createElement(Button, { size: "sm", onClick: () => setShowCreateDialog(true), className: "h-8 w-8 p-0" },
                    React.createElement(Plus, { className: "w-4 h-4" }))),
            React.createElement("div", { className: "relative" },
                React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                React.createElement("input", { type: "text", placeholder: "Search rooms...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" }))),
        React.createElement("div", { className: "flex-1 overflow-y-auto" }, isLoading ? (React.createElement("div", { className: "p-4 text-center text-gray-500" }, "Loading rooms...")) : sortedRooms.length === 0 ? (React.createElement("div", { className: "p-4 text-center text-gray-500" },
            searchQuery ? 'No rooms found' : 'No rooms available',
            !searchQuery && (React.createElement("div", { className: "mt-2" },
                React.createElement(Button, { variant: "outline", size: "sm", onClick: () => setShowCreateDialog(true) }, "Create your first room"))))) : (React.createElement("div", { className: "divide-y" }, sortedRooms.map((room) => (React.createElement(RoomItem, { key: room.id, room: room, isSelected: selectedRoomId === room.id, onClick: () => onRoomSelect(room.id) })))))),
        React.createElement(CreateRoomDialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog })));
}
