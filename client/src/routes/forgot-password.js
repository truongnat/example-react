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
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative" },
        React.createElement(Link, { to: "/login", className: "absolute top-4 left-4" },
            React.createElement(Button, { variant: "ghost", size: "sm" },
                React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to Login")),
        React.createElement(Card, { className: "w-full max-w-md" },
            React.createElement(CardHeader, { className: "text-center" },
                React.createElement(CardTitle, { className: "text-2xl" }, "Forgot Password"),
                React.createElement(CardDescription, null, "Enter your email to reset your password")),
            React.createElement(CardContent, { className: "space-y-4" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, { htmlFor: "email" }, "Email"),
                    React.createElement(Input, { id: "email", type: "email", placeholder: "Enter your email", required: true })),
                React.createElement(Button, { className: "w-full" }, "Send Reset Link"),
                React.createElement("div", { className: "text-center" },
                    React.createElement(Link, { to: "/login", className: "text-sm text-blue-600 hover:underline" }, "Back to Sign In"))))));
}
