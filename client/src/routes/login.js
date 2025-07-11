var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
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
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative", children: [_jsx(Link, { to: "/", className: "absolute top-4 left-4", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back to Home"] }) }), _jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "w-full max-w-md bg-blue-50 border-blue-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "Demo Account" }), _jsx("p", { className: "text-sm text-blue-700 mb-3", children: "Use these credentials to test the application:" }), _jsxs("div", { className: "bg-white p-3 rounded border text-left", children: [_jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: "Email:" }), " demo@example.com"] }), _jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: "Password:" }), " password"] })] })] }) }) }), _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl", children: "Sign In" }), _jsx(CardDescription, { children: "Sign in to your account to continue" })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [loginMutation.error && (_jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md", children: loginMutation.error.message || 'Login failed. Please try again.' })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "demo@example.com", value: formData.email, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { email: e.target.value })), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", placeholder: "password", value: formData.password, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { password: e.target.value })), required: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: loginMutation.isPending, children: loginMutation.isPending ? 'Signing In...' : 'Sign In' })] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx(Link, { to: "/forgot-password", className: "text-sm text-blue-600 hover:underline", children: "Forgot password?" }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-blue-600 hover:underline", children: "Sign up" })] })] })] })] })] })] }));
}
