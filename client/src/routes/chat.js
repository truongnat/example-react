import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { useAuthStore } from '@/stores/authStore';
import { useSocketConnection } from '@/hooks/useChat';
export const Route = createFileRoute('/chat')({
    beforeLoad: ({ location }) => {
        // Check if user is authenticated
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: ChatPage,
});
function ChatPage() {
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const navigate = useNavigate();
    // Initialize socket connection
    useSocketConnection();
    const handleRoomSelect = (roomId) => {
        setSelectedRoomId(roomId);
        // Update URL to include room ID
        navigate({
            to: '/room/$id',
            params: { id: roomId },
        }).catch(() => {
            // If navigation fails, just set the selected room
            setSelectedRoomId(roomId);
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navigation, { title: "Chat" }), _jsxs("div", { className: "h-[calc(100vh-4rem)] flex", children: [_jsx("div", { className: "w-80 flex-shrink-0", children: _jsx(ChatRoomList, { onRoomSelect: handleRoomSelect, selectedRoomId: selectedRoomId || undefined }) }), _jsx("div", { className: "flex-1", children: selectedRoomId ? (_jsx(ChatRoom, { roomId: selectedRoomId })) : (_jsx("div", { className: "h-full flex items-center justify-center bg-white", children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "Select a room to start chatting" }), _jsx("p", { className: "text-sm", children: "Choose a room from the sidebar to begin your conversation" })] }) })) })] })] }));
}
