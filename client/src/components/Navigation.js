import React from 'react';
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
    return (React.createElement("nav", { className: `${transparent ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'} shadow-sm border-b sticky top-0 z-50` },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "flex justify-between items-center h-16" },
                React.createElement("div", { className: "flex items-center" },
                    showBackButton && (React.createElement(Link, { to: "/", className: "mr-4" },
                        React.createElement(Button, { variant: "ghost", size: "sm" },
                            React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                            "Back"))),
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "flex-shrink-0" },
                            React.createElement("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" },
                                React.createElement("span", { className: "text-white font-bold text-sm" }, "MS"))),
                        React.createElement("div", { className: "ml-3" },
                            React.createElement("h1", { className: "text-xl font-semibold text-gray-900" }, title || 'MERN Stack')))),
                React.createElement("div", { className: "hidden md:block" },
                    React.createElement("div", { className: "ml-10 flex items-baseline space-x-4" },
                        React.createElement(Link, { to: "/", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}` },
                            React.createElement(Home, { className: "w-4 h-4 inline mr-1" }),
                            "Home"),
                        React.createElement(Link, { to: "/todo", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/todo')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}` }, "Todo"),
                        React.createElement(Link, { to: "/chat", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/chat')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}` }, "Chat"),
                        React.createElement(Link, { to: "/profile", className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-blue-600'}` }, "Profile"))),
                React.createElement("div", { className: "flex items-center space-x-4" }, isAuthenticated ? (React.createElement("div", { className: "flex items-center space-x-3" },
                    React.createElement("span", { className: "text-sm text-gray-600" },
                        "Welcome, ", user === null || user === void 0 ? void 0 :
                        user.name),
                    React.createElement(Link, { to: "/profile" },
                        React.createElement(Button, { variant: "outline", size: "sm" },
                            React.createElement(User, { className: "w-4 h-4 mr-2" }),
                            "Profile")),
                    React.createElement(Button, { variant: "outline", size: "sm", onClick: handleLogout, disabled: logoutMutation.isPending },
                        React.createElement(LogOut, { className: "w-4 h-4 mr-2" }),
                        logoutMutation.isPending ? 'Signing Out...' : 'Sign Out'))) : (React.createElement(React.Fragment, null,
                    React.createElement(Link, { to: "/login" },
                        React.createElement(Button, { variant: "outline", size: "sm" }, "Sign In")),
                    React.createElement(Link, { to: "/register" },
                        React.createElement(Button, { size: "sm" }, "Get Started"))))))),
        React.createElement("div", { className: "md:hidden" },
            React.createElement("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t" },
                React.createElement(Link, { to: "/", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600'}` }, "Home"),
                React.createElement(Link, { to: "/todo", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/todo')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600'}` }, "Todo"),
                React.createElement(Link, { to: "/chat", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/chat')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600'}` }, "Chat"),
                React.createElement(Link, { to: "/profile", className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/profile')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600'}` }, "Profile")))));
}
