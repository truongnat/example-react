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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
export const Route = createFileRoute("/register")({
    component: RegisterPage,
});
function RegisterPage() {
    var _a;
    const navigate = useNavigate();
    const registerMutation = useRegister();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError("");
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        registerMutation.mutate({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        }, {
            onSuccess: () => {
                navigate({ to: "/" });
            },
            onError: (error) => {
                setError(error.message || "Registration failed. Please try again.");
            },
        });
    });
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative", children: [_jsx(Link, { to: "/", className: "absolute top-4 left-4", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back to Home"] }) }), _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl", children: "Sign Up" }), _jsx(CardDescription, { children: "Create a new account to get started" })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(error || registerMutation.error) && (_jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md", children: error ||
                                            ((_a = registerMutation.error) === null || _a === void 0 ? void 0 : _a.message) ||
                                            "Registration failed. Please try again." })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", children: "Username" }), _jsx(Input, { id: "username", type: "text", placeholder: "Enter your username", value: formData.username, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { username: e.target.value })), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "Enter your email", value: formData.email, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { email: e.target.value })), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", placeholder: "Enter your password", value: formData.password, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { password: e.target.value })), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx(Input, { id: "confirmPassword", type: "password", placeholder: "Confirm your password", value: formData.confirmPassword, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { confirmPassword: e.target.value })), required: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: registerMutation.isPending, children: registerMutation.isPending ? "Creating Account..." : "Sign Up" })] }), _jsx("div", { className: "text-center", children: _jsxs("div", { className: "text-sm text-gray-600", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", search: {
                                                redirect: "/",
                                            }, children: "Sign in" })] }) })] })] })] }));
}
