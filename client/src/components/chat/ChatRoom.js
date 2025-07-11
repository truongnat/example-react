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
        return (React.createElement("div", { className: "h-full flex items-center justify-center" },
            React.createElement("div", { className: "text-center" },
                React.createElement("p", { className: "text-red-600 mb-2" }, "Failed to load room"),
                React.createElement(Button, { variant: "outline", onClick: () => window.location.reload() }, "Retry"))));
    }
    if (roomLoading) {
        return (React.createElement("div", { className: "h-full flex items-center justify-center" },
            React.createElement("div", { className: "text-gray-500" }, "Loading room...")));
    }
    if (!room) {
        return (React.createElement("div", { className: "h-full flex items-center justify-center" },
            React.createElement("div", { className: "text-gray-500" }, "Room not found")));
    }
    const typingUsers = typingUsersByRoom[roomId] || [];
    return (React.createElement("div", { className: "h-full flex flex-col bg-white" },
        React.createElement("div", { className: "flex items-center justify-between p-4 border-b bg-gray-50" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(Avatar, { className: "w-10 h-10" },
                    React.createElement(AvatarImage, { src: room.avatarUrl }),
                    React.createElement(AvatarFallback, null, room.name.charAt(0).toUpperCase())),
                React.createElement("div", null,
                    React.createElement("h1", { className: "font-semibold text-gray-900" }, room.name),
                    React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-500" },
                        React.createElement(Users, { className: "w-4 h-4" }),
                        React.createElement("span", null,
                            room.participants.length,
                            " members"),
                        !connected && (React.createElement(Badge, { variant: "destructive", className: "text-xs" }, "Disconnected")),
                        connected && (React.createElement(Badge, { variant: "secondary", className: "text-xs" }, "Online"))))),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0" },
                    React.createElement(Phone, { className: "w-4 h-4" })),
                React.createElement(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0" },
                    React.createElement(Video, { className: "w-4 h-4" })),
                React.createElement(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0" },
                    React.createElement(Settings, { className: "w-4 h-4" })))),
        !connected && (React.createElement("div", { className: "bg-yellow-50 border-b border-yellow-200 px-4 py-2" },
            React.createElement("div", { className: "flex items-center gap-2 text-sm text-yellow-800" },
                React.createElement("div", { className: "w-2 h-2 bg-yellow-500 rounded-full animate-pulse" }),
                React.createElement("span", null, "Reconnecting to chat...")))),
        React.createElement(MessageList, { roomId: roomId, messages: combinedMessages, isLoading: messagesLoading || isFetchingNextPage, hasNextPage: hasNextPage, onLoadMore: () => fetchNextPage() }),
        React.createElement(MessageInput, { roomId: roomId, disabled: !connected, placeholder: connected
                ? "Type a message..."
                : "Connecting to chat..." })));
}
