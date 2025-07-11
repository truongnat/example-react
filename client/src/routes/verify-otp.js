import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
export const Route = createFileRoute('/verify-otp')({
    component: VerifyOtpPage,
    validateSearch: (search) => ({
        e: search.e || '',
    }),
});
function VerifyOtpPage() {
    const search = useSearch({ from: '/verify-otp' });
    const [otp, setOtp] = useState("");
    const handleSubmit = () => {
        console.log('Verifying OTP:', otp, 'for email:', search.e);
        // Handle OTP verification logic here
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative", children: [_jsx(Link, { to: "/forgot-password", className: "absolute top-4 left-4", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"] }) }), _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl", children: "Verify OTP" }), _jsxs(CardDescription, { children: ["Enter the 6-digit code sent to ", search.e || 'your email'] })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "otp", children: "OTP Code" }), _jsx(Input, { id: "otp", type: "text", placeholder: "Enter 6-digit code", value: otp, onChange: (e) => setOtp(e.target.value), maxLength: 6, className: "text-center text-lg tracking-widest", required: true })] }), _jsx(Button, { className: "w-full", onClick: handleSubmit, disabled: otp.length !== 6, children: "Verify OTP" }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx(Link, { to: "/forgot-password", className: "text-sm text-blue-600 hover:underline", children: "Resend Code" }), _jsx("div", { children: _jsx(Link, { to: "/login", search: { redirect: '/' }, className: "text-sm text-blue-600 hover:underline", children: "Back to Sign In" }) })] })] })] })] }));
}
