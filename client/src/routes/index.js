import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Database, Globe, Zap, Users, MessageCircle, CheckSquare, Lock } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useAuthStore } from '@/stores/authStore';
export const Route = createFileRoute('/')({
    component: HomePage,
});
function HomePage() {
    const { isAuthenticated } = useAuthStore();
    const features = [
        {
            icon: _jsx(Code, { className: "w-8 h-8" }),
            title: "Modern Tech Stack",
            description: "Built with React, TypeScript, TanStack Router, and TailwindCSS",
            color: "bg-blue-500"
        },
        {
            icon: _jsx(Database, { className: "w-8 h-8" }),
            title: "Full Stack Ready",
            description: "Complete MERN stack with MongoDB, Express, React, and Node.js",
            color: "bg-green-500"
        },
        {
            icon: _jsx(Zap, { className: "w-8 h-8" }),
            title: "High Performance",
            description: "Optimized for speed with modern bundling and state management",
            color: "bg-yellow-500"
        },
        {
            icon: _jsx(Globe, { className: "w-8 h-8" }),
            title: "Responsive Design",
            description: "Beautiful UI that works perfectly on all devices",
            color: "bg-purple-500"
        }
    ];
    const apps = [
        {
            title: "Todo Manager",
            description: "Organize your tasks efficiently with our intuitive todo application",
            icon: _jsx(CheckSquare, { className: "w-6 h-6" }),
            link: "/todo",
            color: "from-blue-500 to-blue-600"
        },
        {
            title: "Chat Rooms",
            description: "Connect with others in real-time chat rooms",
            icon: _jsx(MessageCircle, { className: "w-6 h-6" }),
            link: "/chat",
            color: "from-green-500 to-green-600"
        },
        {
            title: "User Profile",
            description: "Manage your account settings and preferences",
            icon: _jsx(Users, { className: "w-6 h-6" }),
            link: "/profile",
            color: "from-purple-500 to-purple-600"
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [_jsx(Navigation, { transparent: true }), _jsx("div", { className: "relative overflow-hidden", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24", children: _jsxs("div", { className: "text-center", children: [_jsx(Badge, { variant: "secondary", className: "mb-4", children: "\uD83D\uDE80 Modern Full Stack Application" }), _jsxs("h1", { className: "text-4xl md:text-6xl font-bold text-gray-900 mb-6", children: ["Welcome to", ' ', _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "MERN Stack" })] }), _jsx("p", { className: "text-xl text-gray-600 mb-8 max-w-3xl mx-auto", children: "A modern, full-featured web application built with the latest technologies. Experience the power of React, TanStack Router, shadcn/ui, and TailwindCSS." }), _jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/todo", children: _jsxs(Button, { size: "lg", className: "w-full sm:w-auto", children: ["Try Todo App", _jsx(ArrowRight, { className: "ml-2 w-4 h-4" })] }) }), _jsx(Link, { to: "/chat", children: _jsx(Button, { variant: "outline", size: "lg", className: "w-full sm:w-auto", children: "Join Chat Rooms" }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { search: { redirect: '/todo' }, to: "/login", children: _jsxs(Button, { size: "lg", className: "w-full sm:w-auto", children: ["Sign In to Get Started", _jsx(ArrowRight, { className: "ml-2 w-4 h-4" })] }) }), _jsx(Link, { to: "/register", children: _jsx(Button, { variant: "outline", size: "lg", className: "w-full sm:w-auto", children: "Create Account" }) })] })) }), !isAuthenticated && (_jsxs("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto", children: [_jsxs("div", { className: "flex items-center gap-2 text-blue-800", children: [_jsx(Lock, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "Authentication Required" })] }), _jsx("p", { className: "text-sm text-blue-700 mt-1", children: "Sign in to access Todo Manager, Chat Rooms, and Profile features." })] }))] }) }) }), _jsx("div", { className: "py-24 bg-white", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Built with Modern Technologies" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Our application leverages the latest and greatest technologies to provide you with the best possible experience." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: features.map((feature, index) => (_jsxs(Card, { className: "text-center hover:shadow-lg transition-shadow", children: [_jsxs(CardHeader, { children: [_jsx("div", { className: `w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-white mx-auto mb-4`, children: feature.icon }), _jsx(CardTitle, { className: "text-lg", children: feature.title })] }), _jsx(CardContent, { children: _jsx(CardDescription, { children: feature.description }) })] }, index))) })] }) }), _jsx("div", { className: "py-24 bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Explore Our Applications" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Discover the powerful applications we've built to showcase the capabilities of our modern tech stack." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: apps.map((app, index) => (_jsxs(Card, { className: "hover:shadow-lg transition-all duration-300 hover:-translate-y-1", children: [_jsxs(CardHeader, { children: [_jsx("div", { className: `w-12 h-12 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center text-white mb-4`, children: app.icon }), _jsx(CardTitle, { className: "text-xl", children: app.title }), _jsx(CardDescription, { children: app.description })] }), _jsx(CardContent, { children: isAuthenticated ? (_jsx(Link, { to: app.link, children: _jsxs(Button, { className: "w-full", children: ["Try it now", _jsx(ArrowRight, { className: "ml-2 w-4 h-4" })] }) })) : (_jsx(Link, { search: { redirect: app.link }, to: "/login", children: _jsxs(Button, { variant: "outline", className: "w-full", children: [_jsx(Lock, { className: "w-4 h-4 mr-2" }), "Sign in to access"] }) })) })] }, index))) })] }) }), _jsx("footer", { className: "bg-gray-900 text-white py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsxs("div", { className: "col-span-1 md:col-span-2", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "MS" }) }), _jsx("span", { className: "ml-3 text-xl font-semibold", children: "MERN Stack" })] }), _jsx("p", { className: "text-gray-400 mb-4", children: "A modern full-stack application showcasing the power of React, TanStack Router, and modern web technologies." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Applications" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx(Link, { to: "/todo", className: "text-gray-400 hover:text-white", children: "Todo Manager" }) }), _jsx("li", { children: _jsx(Link, { to: "/chat", className: "text-gray-400 hover:text-white", children: "Chat Rooms" }) }), _jsx("li", { children: _jsx(Link, { to: "/profile", className: "text-gray-400 hover:text-white", children: "User Profile" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Account" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx(Link, { to: "/login", className: "text-gray-400 hover:text-white", search: { redirect: '/todo' }, children: "Sign In" }) }), _jsx("li", { children: _jsx(Link, { to: "/register", className: "text-gray-400 hover:text-white", children: "Sign Up" }) }), _jsx("li", { children: _jsx(Link, { to: "/forgot-password", className: "text-gray-400 hover:text-white", children: "Forgot Password" }) })] })] })] }), _jsx("div", { className: "border-t border-gray-800 mt-8 pt-8 text-center", children: _jsx("p", { className: "text-gray-400", children: "\u00A9 2025 MERN Stack App. Built with \u2764\uFE0F using modern web technologies." }) })] }) })] }));
}
