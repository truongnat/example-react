import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, useParams, Link, redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { useAuthStore } from '@/stores/authStore';
import { useSocketConnection } from '@/hooks/useChat';
export const Route = createFileRoute('/room/$id')({
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
    component: RoomPage,
});
function RoomPage() {
    const { id } = useParams({ from: '/room/$id' });
    // Initialize socket connection
    useSocketConnection();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b px-4 py-3 sticky top-0 z-50", children: _jsxs("div", { className: "max-w-4xl mx-auto flex items-center justify-between", children: [_jsx("div", { className: "flex items-center space-x-3", children: _jsx(Link, { to: "/chat", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back to Chat"] }) }) }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx(Link, { to: "/", children: _jsx(Button, { variant: "outline", size: "sm", children: "Home" }) }) })] }) }), _jsx("div", { className: "h-[calc(100vh-4rem)]", children: _jsx(ChatRoom, { roomId: id }) })] }));
}
