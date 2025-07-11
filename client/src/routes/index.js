import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
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
            icon: React.createElement(Code, { className: "w-8 h-8" }),
            title: "Modern Tech Stack",
            description: "Built with React, TypeScript, TanStack Router, and TailwindCSS",
            color: "bg-blue-500"
        },
        {
            icon: React.createElement(Database, { className: "w-8 h-8" }),
            title: "Full Stack Ready",
            description: "Complete MERN stack with MongoDB, Express, React, and Node.js",
            color: "bg-green-500"
        },
        {
            icon: React.createElement(Zap, { className: "w-8 h-8" }),
            title: "High Performance",
            description: "Optimized for speed with modern bundling and state management",
            color: "bg-yellow-500"
        },
        {
            icon: React.createElement(Globe, { className: "w-8 h-8" }),
            title: "Responsive Design",
            description: "Beautiful UI that works perfectly on all devices",
            color: "bg-purple-500"
        }
    ];
    const apps = [
        {
            title: "Todo Manager",
            description: "Organize your tasks efficiently with our intuitive todo application",
            icon: React.createElement(CheckSquare, { className: "w-6 h-6" }),
            link: "/todo",
            color: "from-blue-500 to-blue-600"
        },
        {
            title: "Chat Rooms",
            description: "Connect with others in real-time chat rooms",
            icon: React.createElement(MessageCircle, { className: "w-6 h-6" }),
            link: "/chat",
            color: "from-green-500 to-green-600"
        },
        {
            title: "User Profile",
            description: "Manage your account settings and preferences",
            icon: React.createElement(Users, { className: "w-6 h-6" }),
            link: "/profile",
            color: "from-purple-500 to-purple-600"
        }
    ];
    return (React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" },
        React.createElement(Navigation, { transparent: true }),
        React.createElement("div", { className: "relative overflow-hidden" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" },
                React.createElement("div", { className: "text-center" },
                    React.createElement(Badge, { variant: "secondary", className: "mb-4" }, "\uD83D\uDE80 Modern Full Stack Application"),
                    React.createElement("h1", { className: "text-4xl md:text-6xl font-bold text-gray-900 mb-6" },
                        "Welcome to",
                        ' ',
                        React.createElement("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" }, "MERN Stack")),
                    React.createElement("p", { className: "text-xl text-gray-600 mb-8 max-w-3xl mx-auto" }, "A modern, full-featured web application built with the latest technologies. Experience the power of React, TanStack Router, shadcn/ui, and TailwindCSS."),
                    React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 justify-center" }, isAuthenticated ? (React.createElement(React.Fragment, null,
                        React.createElement(Link, { to: "/todo" },
                            React.createElement(Button, { size: "lg", className: "w-full sm:w-auto" },
                                "Try Todo App",
                                React.createElement(ArrowRight, { className: "ml-2 w-4 h-4" }))),
                        React.createElement(Link, { to: "/chat" },
                            React.createElement(Button, { variant: "outline", size: "lg", className: "w-full sm:w-auto" }, "Join Chat Rooms")))) : (React.createElement(React.Fragment, null,
                        React.createElement(Link, { search: { redirect: '/todo' }, to: "/login" },
                            React.createElement(Button, { size: "lg", className: "w-full sm:w-auto" },
                                "Sign In to Get Started",
                                React.createElement(ArrowRight, { className: "ml-2 w-4 h-4" }))),
                        React.createElement(Link, { to: "/register" },
                            React.createElement(Button, { variant: "outline", size: "lg", className: "w-full sm:w-auto" }, "Create Account"))))),
                    !isAuthenticated && (React.createElement("div", { className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto" },
                        React.createElement("div", { className: "flex items-center gap-2 text-blue-800" },
                            React.createElement(Lock, { className: "w-4 h-4" }),
                            React.createElement("span", { className: "text-sm font-medium" }, "Authentication Required")),
                        React.createElement("p", { className: "text-sm text-blue-700 mt-1" }, "Sign in to access Todo Manager, Chat Rooms, and Profile features.")))))),
        React.createElement("div", { className: "py-24 bg-white" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "text-center mb-16" },
                    React.createElement("h2", { className: "text-3xl font-bold text-gray-900 mb-4" }, "Built with Modern Technologies"),
                    React.createElement("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto" }, "Our application leverages the latest and greatest technologies to provide you with the best possible experience.")),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" }, features.map((feature, index) => (React.createElement(Card, { key: index, className: "text-center hover:shadow-lg transition-shadow" },
                    React.createElement(CardHeader, null,
                        React.createElement("div", { className: `w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-white mx-auto mb-4` }, feature.icon),
                        React.createElement(CardTitle, { className: "text-lg" }, feature.title)),
                    React.createElement(CardContent, null,
                        React.createElement(CardDescription, null, feature.description)))))))),
        React.createElement("div", { className: "py-24 bg-gray-50" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "text-center mb-16" },
                    React.createElement("h2", { className: "text-3xl font-bold text-gray-900 mb-4" }, "Explore Our Applications"),
                    React.createElement("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto" }, "Discover the powerful applications we've built to showcase the capabilities of our modern tech stack.")),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, apps.map((app, index) => (React.createElement(Card, { key: index, className: "hover:shadow-lg transition-all duration-300 hover:-translate-y-1" },
                    React.createElement(CardHeader, null,
                        React.createElement("div", { className: `w-12 h-12 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center text-white mb-4` }, app.icon),
                        React.createElement(CardTitle, { className: "text-xl" }, app.title),
                        React.createElement(CardDescription, null, app.description)),
                    React.createElement(CardContent, null, isAuthenticated ? (React.createElement(Link, { to: app.link },
                        React.createElement(Button, { className: "w-full" },
                            "Try it now",
                            React.createElement(ArrowRight, { className: "ml-2 w-4 h-4" })))) : (React.createElement(Link, { search: { redirect: app.link }, to: "/login" },
                        React.createElement(Button, { variant: "outline", className: "w-full" },
                            React.createElement(Lock, { className: "w-4 h-4 mr-2" }),
                            "Sign in to access")))))))))),
        React.createElement("footer", { className: "bg-gray-900 text-white py-12" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8" },
                    React.createElement("div", { className: "col-span-1 md:col-span-2" },
                        React.createElement("div", { className: "flex items-center mb-4" },
                            React.createElement("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" },
                                React.createElement("span", { className: "text-white font-bold text-sm" }, "MS")),
                            React.createElement("span", { className: "ml-3 text-xl font-semibold" }, "MERN Stack")),
                        React.createElement("p", { className: "text-gray-400 mb-4" }, "A modern full-stack application showcasing the power of React, TanStack Router, and modern web technologies.")),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Applications"),
                        React.createElement("ul", { className: "space-y-2" },
                            React.createElement("li", null,
                                React.createElement(Link, { to: "/todo", className: "text-gray-400 hover:text-white" }, "Todo Manager")),
                            React.createElement("li", null,
                                React.createElement(Link, { to: "/chat", className: "text-gray-400 hover:text-white" }, "Chat Rooms")),
                            React.createElement("li", null,
                                React.createElement(Link, { to: "/profile", className: "text-gray-400 hover:text-white" }, "User Profile")))),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Account"),
                        React.createElement("ul", { className: "space-y-2" },
                            React.createElement("li", null,
                                React.createElement(Link, { to: "/login", className: "text-gray-400 hover:text-white", search: { redirect: '/todo' } }, "Sign In")),
                            React.createElement("li", null,
                                React.createElement(Link, { to: "/register", className: "text-gray-400 hover:text-white" }, "Sign Up")),
                            React.createElement("li", null,
                                React.createElement(Link, { to: "/forgot-password", className: "text-gray-400 hover:text-white" }, "Forgot Password"))))),
                React.createElement("div", { className: "border-t border-gray-800 mt-8 pt-8 text-center" },
                    React.createElement("p", { className: "text-gray-400" }, "\u00A9 2025 MERN Stack App. Built with \u2764\uFE0F using modern web technologies."))))));
}
