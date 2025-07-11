import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useAuth';
export function Navigation({ showBackButton = false, title, transparent = false }) {
    const location = useLocation();
    const { isAuthenticated, user } = useAuthStore();
    const logoutMutation = useLogout();
    const isActive = (path) => {
        return location.pathname === path;
    };
    const handleLogout = () => {
        logoutMutation.mutate();
    };
    return (_jsxs("nav", { className: `${transparent ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'} shadow-sm border-b sticky top-0 z-50`, children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [showBackButton && (_jsx(Link, { to: "/", className: "mr-4", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"] }) })), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "MS" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("h1", { className: "text-xl font-semibold text-gray-900", children: title || 'MERN Stack' }) })] })] }), _jsx("div", { className: "hidden md:block", children: _jsxs("div", { className: "ml-10 flex items-baseline space-x-4", children: [_jsxs(Link, { to: "/", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600'}`, children: [_jsx(Home, { className: "w-4 h-4 inline mr-1" }), "Home"] }), _jsx(Link, { to: "/todo", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/todo')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600'}`, children: "Todo" }), _jsx(Link, { to: "/chat", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/chat')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600'}`, children: "Chat" }), _jsx(Link, { to: "/profile", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600'}`, children: "Profile" })] }) }), _jsx("div", { className: "flex items-center space-x-4", children: isAuthenticated ? (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["Welcome, ", user === null || user === void 0 ? void 0 : user.name] }), _jsx(Link, { to: "/profile", children: _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), "Profile"] }) }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleLogout, disabled: logoutMutation.isPending, children: [_jsx(LogOut, { className: "w-4 h-4 mr-2" }), logoutMutation.isPending ? 'Signing Out...' : 'Sign Out'] })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", search: { redirect: '/' }, children: _jsx(Button, { variant: "outline", size: "sm", children: "Sign In" }) }), _jsx(Link, { to: "/register", children: _jsx(Button, { size: "sm", children: "Get Started" }) })] })) })] }) }), _jsx("div", { className: "md:hidden", children: _jsxs("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t", children: [_jsx(Link, { to: "/", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}`, children: "Home" }), _jsx(Link, { to: "/todo", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/todo')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}`, children: "Todo" }), _jsx(Link, { to: "/chat", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/chat')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}`, children: "Chat" }), _jsx(Link, { to: "/profile", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/profile')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}`, children: "Profile" })] }) })] }));
}
