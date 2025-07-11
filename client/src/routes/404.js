import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
export const Route = createFileRoute('/404')({
    component: NotFoundPage,
});
function NotFoundPage() {
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative" },
        React.createElement(Link, { to: "/", className: "absolute top-4 left-4" },
            React.createElement(Button, { variant: "ghost", size: "sm" },
                React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to Home")),
        React.createElement("div", { className: "max-w-md mx-auto text-center" },
            React.createElement("div", { className: "mb-8" },
                React.createElement("div", { className: "text-8xl mb-4" }, "\uD83D\uDD0D"),
                React.createElement("h1", { className: "text-6xl font-bold text-gray-900 mb-4" }, "404"),
                React.createElement("h2", { className: "text-2xl font-semibold text-gray-700 mb-2" }, "Page Not Found"),
                React.createElement("p", { className: "text-gray-600 mb-8" }, "Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.")),
            React.createElement("div", { className: "space-y-4" },
                React.createElement(Link, { to: "/" },
                    React.createElement(Button, { className: "w-full" },
                        React.createElement(Home, { className: "w-4 h-4 mr-2" }),
                        "Go to Homepage")),
                React.createElement("div", { className: "flex space-x-2" },
                    React.createElement(Link, { to: "/todo", className: "flex-1" },
                        React.createElement(Button, { variant: "outline", className: "w-full" }, "Todo App")),
                    React.createElement(Link, { to: "/chat", className: "flex-1" },
                        React.createElement(Button, { variant: "outline", className: "w-full" }, "Chat Rooms")))))));
}
