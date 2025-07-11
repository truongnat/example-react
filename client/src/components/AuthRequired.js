import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, UserPlus } from 'lucide-react';
export function AuthRequired() {
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Lock, { className: "w-8 h-8 text-blue-600" }) }), _jsx(CardTitle, { className: "text-2xl", children: "Authentication Required" }), _jsx(CardDescription, { children: "You need to sign in to access this page" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Link, { to: "/login", search: { redirect: window.location.pathname }, children: _jsxs(Button, { className: "w-full flex items-center gap-2", children: [_jsx(LogIn, { className: "w-4 h-4" }), "Sign In"] }) }), _jsx(Link, { to: "/register", children: _jsxs(Button, { variant: "outline", className: "w-full flex items-center gap-2", children: [_jsx(UserPlus, { className: "w-4 h-4" }), "Create Account"] }) }), _jsx("div", { className: "text-center", children: _jsx(Link, { to: "/", className: "text-sm text-gray-600 hover:text-blue-600", children: "\u2190 Back to Home" }) })] })] }) }));
}
