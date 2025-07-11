var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
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
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 relative" },
        React.createElement(Link, { to: "/", className: "absolute top-4 left-4" },
            React.createElement(Button, { variant: "ghost", size: "sm" },
                React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Back to Home")),
        React.createElement(Card, { className: "w-full max-w-md" },
            React.createElement(CardHeader, { className: "text-center" },
                React.createElement(CardTitle, { className: "text-2xl" }, "Sign Up"),
                React.createElement(CardDescription, null, "Create a new account to get started")),
            React.createElement(CardContent, null,
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
                    (error || registerMutation.error) && (React.createElement("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md" }, error ||
                        ((_a = registerMutation.error) === null || _a === void 0 ? void 0 : _a.message) ||
                        "Registration failed. Please try again.")),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "username" }, "Username"),
                        React.createElement(Input, { id: "username", type: "text", placeholder: "Enter your username", value: formData.username, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { username: e.target.value })), required: true })),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "email" }, "Email"),
                        React.createElement(Input, { id: "email", type: "email", placeholder: "Enter your email", value: formData.email, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { email: e.target.value })), required: true })),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "password" }, "Password"),
                        React.createElement(Input, { id: "password", type: "password", placeholder: "Enter your password", value: formData.password, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { password: e.target.value })), required: true })),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "confirmPassword" }, "Confirm Password"),
                        React.createElement(Input, { id: "confirmPassword", type: "password", placeholder: "Confirm your password", value: formData.confirmPassword, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { confirmPassword: e.target.value })), required: true })),
                    React.createElement(Button, { type: "submit", className: "w-full", disabled: registerMutation.isPending }, registerMutation.isPending ? "Creating Account..." : "Sign Up")),
                React.createElement("div", { className: "text-center" },
                    React.createElement("div", { className: "text-sm text-gray-600" },
                        "Already have an account?",
                        " ",
                        React.createElement(Link, { to: "/login", className: "text-blue-600 hover:underline", search: {
                                redirect: "/",
                            } }, "Sign in")))))));
}
