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
    return (React.createElement("div", { className: "min-h-screen bg-gray-50" },
        React.createElement("div", { className: "bg-white border-b px-4 py-3 sticky top-0 z-50" },
            React.createElement("div", { className: "max-w-4xl mx-auto flex items-center justify-between" },
                React.createElement("div", { className: "flex items-center space-x-3" },
                    React.createElement(Link, { to: "/chat" },
                        React.createElement(Button, { variant: "ghost", size: "sm" },
                            React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                            "Back to Chat"))),
                React.createElement("div", { className: "flex items-center space-x-2" },
                    React.createElement(Link, { to: "/" },
                        React.createElement(Button, { variant: "outline", size: "sm" }, "Home"))))),
        React.createElement("div", { className: "h-[calc(100vh-4rem)]" },
            React.createElement(ChatRoom, { roomId: id }))));
}
