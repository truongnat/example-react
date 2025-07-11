import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, UserPlus } from 'lucide-react';
export function AuthRequired() {
    return (React.createElement("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center" },
        React.createElement(Card, { className: "w-full max-w-md" },
            React.createElement(CardHeader, { className: "text-center" },
                React.createElement("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" },
                    React.createElement(Lock, { className: "w-8 h-8 text-blue-600" })),
                React.createElement(CardTitle, { className: "text-2xl" }, "Authentication Required"),
                React.createElement(CardDescription, null, "You need to sign in to access this page")),
            React.createElement(CardContent, { className: "space-y-4" },
                React.createElement(Link, { to: "/login" },
                    React.createElement(Button, { className: "w-full flex items-center gap-2" },
                        React.createElement(LogIn, { className: "w-4 h-4" }),
                        "Sign In")),
                React.createElement(Link, { to: "/register" },
                    React.createElement(Button, { variant: "outline", className: "w-full flex items-center gap-2" },
                        React.createElement(UserPlus, { className: "w-4 h-4" }),
                        "Create Account")),
                React.createElement("div", { className: "text-center" },
                    React.createElement(Link, { to: "/", className: "text-sm text-gray-600 hover:text-blue-600" }, "\u2190 Back to Home"))))));
}
