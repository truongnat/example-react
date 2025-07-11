import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
export const Route = createFileRoute('/404')({
    component: NotFoundPage,
});
function NotFoundPage() {
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative", children: [_jsx(Link, { to: "/", className: "absolute top-4 left-4", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back to Home"] }) }), _jsxs("div", { className: "max-w-md mx-auto text-center", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "text-8xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h1", { className: "text-6xl font-bold text-gray-900 mb-4", children: "404" }), _jsx("h2", { className: "text-2xl font-semibold text-gray-700 mb-2", children: "Page Not Found" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(Link, { to: "/", children: _jsxs(Button, { className: "w-full", children: [_jsx(Home, { className: "w-4 h-4 mr-2" }), "Go to Homepage"] }) }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Link, { to: "/todo", className: "flex-1", children: _jsx(Button, { variant: "outline", className: "w-full", children: "Todo App" }) }), _jsx(Link, { to: "/chat", className: "flex-1", children: _jsx(Button, { variant: "outline", className: "w-full", children: "Chat Rooms" }) })] })] })] })] }));
}
