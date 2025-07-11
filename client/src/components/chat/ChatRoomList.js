import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { onClick: onClick, className: `flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-100 ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`, children: [_jsxs("div", { className: "relative", children: [_jsxs(Avatar, { className: "w-10 h-10", children: [_jsx(AvatarImage, { src: room.avatarUrl }), _jsx(AvatarFallback, { children: _jsx(Hash, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium text-gray-900 truncate", children: room.name }), _jsxs("div", { className: "flex items-center gap-1", children: [room.unreadCount && room.unreadCount > 0 && (_jsx(Badge, { variant: "destructive", className: "text-xs", children: room.unreadCount > 99 ? '99+' : room.unreadCount })), room.lastActivity && (_jsx("span", { className: "text-xs text-gray-500", children: formatDistanceToNow(new Date(room.lastActivity), { addSuffix: true }) }))] })] }), _jsxs("div", { className: "flex items-center justify-between mt-1", children: [_jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [_jsx(Users, { className: "w-3 h-3" }), _jsxs("span", { children: [room.participants.length, " members"] })] }), !room.participants.includes('current-user-id') && (_jsx(Button, { size: "sm", variant: "outline", onClick: handleJoinRoom, disabled: joinRoomMutation.isPending, className: "h-6 px-2 text-xs", children: joinRoomMutation.isPending ? 'Joining...' : 'Join' }))] })] })] }));
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
        return (_jsx("div", { className: "h-full flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-red-600 mb-2", children: "Failed to load rooms" }), _jsx(Button, { variant: "outline", onClick: () => window.location.reload(), children: "Retry" })] }) }));
    }
    return (_jsxs("div", { className: "h-full flex flex-col bg-white border-r", children: [_jsxs("div", { className: "p-4 border-b", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Chat Rooms" }), _jsx(Button, { size: "sm", onClick: () => setShowCreateDialog(true), className: "h-8 w-8 p-0", children: _jsx(Plus, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search rooms...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? (_jsx("div", { className: "p-4 text-center text-gray-500", children: "Loading rooms..." })) : sortedRooms.length === 0 ? (_jsxs("div", { className: "p-4 text-center text-gray-500", children: [searchQuery ? 'No rooms found' : 'No rooms available', !searchQuery && (_jsx("div", { className: "mt-2", children: _jsx(Button, { variant: "outline", size: "sm", onClick: () => setShowCreateDialog(true), children: "Create your first room" }) }))] })) : (_jsx("div", { className: "divide-y", children: sortedRooms.map((room) => (_jsx(RoomItem, { room: room, isSelected: selectedRoomId === room.id, onClick: () => onRoomSelect(room.id) }, room.id))) })) }), _jsx(CreateRoomDialog, { open: showCreateDialog, onOpenChange: setShowCreateDialog })] }));
}
