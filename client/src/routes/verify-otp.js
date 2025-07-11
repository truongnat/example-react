import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import React, { useState } from 'react';
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
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative" },
        React.createElement(Link, { to: "/forgot-password", className: "absolute top-4 left-4" },
            React.createElement(Button, { variant: "ghost", size: "sm" },
                React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back")),
        React.createElement(Card, { className: "w-full max-w-md" },
            React.createElement(CardHeader, { className: "text-center" },
                React.createElement(CardTitle, { className: "text-2xl" }, "Verify OTP"),
                React.createElement(CardDescription, null,
                    "Enter the 6-digit code sent to ",
                    search.e || 'your email')),
            React.createElement(CardContent, { className: "space-y-4" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, { htmlFor: "otp" }, "OTP Code"),
                    React.createElement(Input, { id: "otp", type: "text", placeholder: "Enter 6-digit code", value: otp, onChange: (e) => setOtp(e.target.value), maxLength: 6, className: "text-center text-lg tracking-widest", required: true })),
                React.createElement(Button, { className: "w-full", onClick: handleSubmit, disabled: otp.length !== 6 }, "Verify OTP"),
                React.createElement("div", { className: "text-center space-y-2" },
                    React.createElement(Link, { to: "/forgot-password", className: "text-sm text-blue-600 hover:underline" }, "Resend Code"),
                    React.createElement("div", null,
                        React.createElement(Link, { to: "/login", className: "text-sm text-blue-600 hover:underline" }, "Back to Sign In")))))));
}
