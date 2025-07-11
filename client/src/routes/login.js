var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';
export const Route = createFileRoute('/login')({
    validateSearch: (search) => ({
        redirect: search.redirect || '/',
    }),
    component: LoginPage,
});
function LoginPage() {
    const navigate = useNavigate();
    const search = useSearch({ from: '/login' });
    const loginMutation = useLogin();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        loginMutation.mutate(formData, {
            onSuccess: () => {
                navigate({ to: search.redirect });
            },
            onError: (error) => {
                console.error('Login error:', error);
            }
        });
    });
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative" },
        React.createElement(Link, { to: "/", className: "absolute top-4 left-4" },
            React.createElement(Button, { variant: "ghost", size: "sm" },
                React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to Home")),
        React.createElement("div", { className: "space-y-6" },
            React.createElement(Card, { className: "w-full max-w-md bg-blue-50 border-blue-200" },
                React.createElement(CardContent, { className: "p-4" },
                    React.createElement("div", { className: "text-center" },
                        React.createElement("h3", { className: "font-semibold text-blue-900 mb-2" }, "Demo Account"),
                        React.createElement("p", { className: "text-sm text-blue-700 mb-3" }, "Use these credentials to test the application:"),
                        React.createElement("div", { className: "bg-white p-3 rounded border text-left" },
                            React.createElement("p", { className: "text-sm" },
                                React.createElement("strong", null, "Email:"),
                                " demo@example.com"),
                            React.createElement("p", { className: "text-sm" },
                                React.createElement("strong", null, "Password:"),
                                " password"))))),
            React.createElement(Card, { className: "w-full max-w-md" },
                React.createElement(CardHeader, { className: "text-center" },
                    React.createElement(CardTitle, { className: "text-2xl" }, "Sign In"),
                    React.createElement(CardDescription, null, "Sign in to your account to continue")),
                React.createElement(CardContent, null,
                    React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                        loginMutation.error && (React.createElement("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md" }, loginMutation.error.message || 'Login failed. Please try again.')),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(Label, { htmlFor: "email" }, "Email"),
                            React.createElement(Input, { id: "email", type: "email", placeholder: "demo@example.com", value: formData.email, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { email: e.target.value })), required: true })),
                        React.createElement("div", { className: "space-y-2" },
                            React.createElement(Label, { htmlFor: "password" }, "Password"),
                            React.createElement(Input, { id: "password", type: "password", placeholder: "password", value: formData.password, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { password: e.target.value })), required: true })),
                        React.createElement(Button, { type: "submit", className: "w-full", disabled: loginMutation.isPending }, loginMutation.isPending ? 'Signing In...' : 'Sign In')),
                    React.createElement("div", { className: "text-center space-y-2" },
                        React.createElement(Link, { to: "/forgot-password", className: "text-sm text-blue-600 hover:underline" }, "Forgot password?"),
                        React.createElement("div", { className: "text-sm text-gray-600" },
                            "Don't have an account?",
                            ' ',
                            React.createElement(Link, { to: "/register", className: "text-blue-600 hover:underline" }, "Sign up"))))))));
}
