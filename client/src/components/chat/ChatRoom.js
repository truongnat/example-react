import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Users, Settings, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChatStore } from '@/stores/chatStore';
import { useRoom, useInfiniteMessages, useRealTimeMessages, useSocketConnection } from '@/hooks/useChat';
export function ChatRoom({ roomId }) {
    const { setCurrentRoom, joinRoom, messagesByRoom, typingUsersByRoom, isConnected } = useChatStore();
    const { connected } = useSocketConnection();
    // Fetch room data
    const { data: room, isLoading: roomLoading, error: roomError } = useRoom(roomId);
    // Fetch messages with infinite scroll
    const { data: messagesData, isLoading: messagesLoading, hasNextPage, fetchNextPage, isFetchingNextPage, } = useInfiniteMessages(roomId);
    // Setup real-time message updates
    useRealTimeMessages(roomId);
    // Get messages from store (real-time updates)
    const storeMessages = messagesByRoom[roomId] || [];
    // Combine server messages with store messages
    const allMessages = (messagesData === null || messagesData === void 0 ? void 0 : messagesData.pages.flatMap(page => page.messages)) || [];
    const combinedMessages = [...storeMessages, ...allMessages]
        .filter((message, index, arr) => arr.findIndex(m => m.id === message.id) === index)
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
        return (_jsx("div", { className: "h-full flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-red-600 mb-2", children: "Failed to load room" }), _jsx(Button, { variant: "outline", onClick: () => window.location.reload(), children: "Retry" })] }) }));
    }
    if (roomLoading) {
        return (_jsx("div", { className: "h-full flex items-center justify-center", children: _jsx("div", { className: "text-gray-500", children: "Loading room..." }) }));
    }
    if (!room) {
        return (_jsx("div", { className: "h-full flex items-center justify-center", children: _jsx("div", { className: "text-gray-500", children: "Room not found" }) }));
    }
    const typingUsers = typingUsersByRoom[roomId] || [];
    return (_jsxs("div", { className: "h-full flex flex-col bg-white", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b bg-gray-50", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Avatar, { className: "w-10 h-10", children: [_jsx(AvatarImage, { src: room.avatarUrl }), _jsx(AvatarFallback, { children: room.name.charAt(0).toUpperCase() })] }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold text-gray-900", children: room.name }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Users, { className: "w-4 h-4" }), _jsxs("span", { children: [room.participants.length, " members"] }), !connected && (_jsx(Badge, { variant: "destructive", className: "text-xs", children: "Disconnected" })), connected && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Online" }))] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Phone, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Video, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: _jsx(Settings, { className: "w-4 h-4" }) })] })] }), !connected && (_jsx("div", { className: "bg-yellow-50 border-b border-yellow-200 px-4 py-2", children: _jsxs("div", { className: "flex items-center gap-2 text-sm text-yellow-800", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full animate-pulse" }), _jsx("span", { children: "Reconnecting to chat..." })] }) })), _jsx(MessageList, { roomId: roomId, messages: combinedMessages, isLoading: messagesLoading || isFetchingNextPage, hasNextPage: hasNextPage, onLoadMore: () => fetchNextPage() }), _jsx(MessageInput, { roomId: roomId, disabled: !connected, placeholder: connected
                    ? "Type a message..."
                    : "Connecting to chat..." })] }));
}
