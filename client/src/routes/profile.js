import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, redirect } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, LogOut, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
export const Route = createFileRoute('/profile')({
    beforeLoad: ({ context, location }) => {
        // Check if user is authenticated
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: MyProfilePage,
});
function MyProfilePage() {
    const { user } = useAuthStore();
    const { data: currentUser, isLoading, error } = useCurrentUser();
    const logoutMutation = useLogout();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: 'Software developer passionate about creating amazing user experiences.',
        avatar: ''
    });
    // Update profile state when user data is loaded
    React.useEffect(() => {
        if (currentUser) {
            setProfile({
                name: currentUser.username || '',
                email: currentUser.email || '',
                bio: 'Software developer passionate about creating amazing user experiences.',
                avatar: currentUser.avatarUrl || '/api/placeholder/120/120'
            });
        }
    }, [currentUser]);
    const handleSave = () => {
        console.log('Saving profile:', profile);
        // TODO: Implement profile update API call
        alert('Profile update functionality coming soon!');
    };
    const handleAvatarChange = () => {
        console.log('Change avatar clicked');
        // TODO: Implement avatar upload
        alert('Avatar upload functionality coming soon!');
    };
    const handleLogout = () => {
        logoutMutation.mutate();
    };
    if (isLoading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navigation, { title: "My Profile" }), _jsx("div", { className: "py-8", children: _jsx("div", { className: "max-w-2xl mx-auto px-4", children: _jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin" }), _jsx("span", { className: "ml-2", children: "Loading profile..." })] }) }) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navigation, { title: "My Profile" }), _jsx("div", { className: "py-8", children: _jsx("div", { className: "max-w-2xl mx-auto px-4", children: _jsxs("div", { className: "text-center py-8 text-red-600", children: [_jsx("p", { children: "Failed to load profile. Please try again." }), _jsx("p", { className: "text-sm mt-2", children: error.message })] }) }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navigation, { title: "My Profile" }), _jsx("div", { className: "py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "My Profile" }), _jsx("p", { className: "text-gray-600", children: "Manage your account settings and preferences" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Profile Information" }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsxs(Avatar, { className: "w-24 h-24", children: [_jsx(AvatarImage, { src: profile.avatar }), _jsx(AvatarFallback, { className: "text-lg", children: profile.name.split(' ').map(n => n[0]).join('') })] }), _jsx(Button, { size: "sm", variant: "outline", className: "absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0", onClick: handleAvatarChange, children: _jsx(Camera, { className: "w-4 h-4" }) })] }), _jsx(Button, { variant: "outline", onClick: handleAvatarChange, children: "Change Avatar" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Full Name" }), _jsx(Input, { id: "name", value: profile.name, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { name: e.target.value })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: profile.email, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { email: e.target.value })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "bio", children: "Bio" }), _jsx("textarea", { id: "bio", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", value: profile.bio, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { bio: e.target.value })), placeholder: "Tell us about yourself..." })] })] }), _jsx("div", { className: "flex justify-end pt-4", children: _jsxs(Button, { onClick: handleSave, className: "flex items-center gap-2", children: [_jsx(Save, { className: "w-4 h-4" }), "Save Changes"] }) })] })] }), _jsxs(Card, { className: "mt-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Account Settings" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Button, { variant: "outline", className: "w-full", children: "Change Password" }), _jsx(Button, { variant: "outline", className: "w-full", children: "Privacy Settings" }), _jsxs(Button, { variant: "outline", className: "w-full flex items-center gap-2", onClick: handleLogout, disabled: logoutMutation.isPending, children: [logoutMutation.isPending ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(LogOut, { className: "w-4 h-4" })), "Sign Out"] }), _jsx(Button, { variant: "destructive", className: "w-full", children: "Delete Account" })] })] })] }) })] }));
}
