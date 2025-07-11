import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
export const Route = createFileRoute('/forgot-password')({
    component: ForgotPasswordPage,
});
function ForgotPasswordPage() {
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative", children: [_jsx(Link, { to: "/login", search: { redirect: '/' }, className: "absolute top-4 left-4", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back to Login"] }) }), _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl", children: "Forgot Password" }), _jsx(CardDescription, { children: "Enter your email to reset your password" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "Enter your email", required: true })] }), _jsx(Button, { className: "w-full", children: "Send Reset Link" }), _jsx("div", { className: "text-center", children: _jsx(Link, { to: "/login", search: { redirect: '/' }, className: "text-sm text-blue-600 hover:underline", children: "Back to Sign In" }) })] })] })] }));
}
