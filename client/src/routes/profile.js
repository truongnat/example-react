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
        return (React.createElement("div", { className: "min-h-screen bg-gray-50" },
            React.createElement(Navigation, { title: "My Profile" }),
            React.createElement("div", { className: "py-8" },
                React.createElement("div", { className: "max-w-2xl mx-auto px-4" },
                    React.createElement("div", { className: "flex items-center justify-center py-8" },
                        React.createElement(Loader2, { className: "w-6 h-6 animate-spin" }),
                        React.createElement("span", { className: "ml-2" }, "Loading profile..."))))));
    }
    if (error) {
        return (React.createElement("div", { className: "min-h-screen bg-gray-50" },
            React.createElement(Navigation, { title: "My Profile" }),
            React.createElement("div", { className: "py-8" },
                React.createElement("div", { className: "max-w-2xl mx-auto px-4" },
                    React.createElement("div", { className: "text-center py-8 text-red-600" },
                        React.createElement("p", null, "Failed to load profile. Please try again."),
                        React.createElement("p", { className: "text-sm mt-2" }, error.message))))));
    }
    return (React.createElement("div", { className: "min-h-screen bg-gray-50" },
        React.createElement(Navigation, { title: "My Profile" }),
        React.createElement("div", { className: "py-8" },
            React.createElement("div", { className: "max-w-2xl mx-auto px-4" },
                React.createElement("div", { className: "text-center mb-8" },
                    React.createElement("h1", { className: "text-3xl font-bold text-gray-900 mb-2" }, "My Profile"),
                    React.createElement("p", { className: "text-gray-600" }, "Manage your account settings and preferences")),
                React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Profile Information")),
                    React.createElement(CardContent, { className: "space-y-6" },
                        React.createElement("div", { className: "flex flex-col items-center space-y-4" },
                            React.createElement("div", { className: "relative" },
                                React.createElement(Avatar, { className: "w-24 h-24" },
                                    React.createElement(AvatarImage, { src: profile.avatar }),
                                    React.createElement(AvatarFallback, { className: "text-lg" }, profile.name.split(' ').map(n => n[0]).join(''))),
                                React.createElement(Button, { size: "sm", variant: "outline", className: "absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0", onClick: handleAvatarChange },
                                    React.createElement(Camera, { className: "w-4 h-4" }))),
                            React.createElement(Button, { variant: "outline", onClick: handleAvatarChange }, "Change Avatar")),
                        React.createElement("div", { className: "space-y-4" },
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(Label, { htmlFor: "name" }, "Full Name"),
                                React.createElement(Input, { id: "name", value: profile.name, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { name: e.target.value })) })),
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(Label, { htmlFor: "email" }, "Email"),
                                React.createElement(Input, { id: "email", type: "email", value: profile.email, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { email: e.target.value })) })),
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement(Label, { htmlFor: "bio" }, "Bio"),
                                React.createElement("textarea", { id: "bio", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", value: profile.bio, onChange: (e) => setProfile(Object.assign(Object.assign({}, profile), { bio: e.target.value })), placeholder: "Tell us about yourself..." }))),
                        React.createElement("div", { className: "flex justify-end pt-4" },
                            React.createElement(Button, { onClick: handleSave, className: "flex items-center gap-2" },
                                React.createElement(Save, { className: "w-4 h-4" }),
                                "Save Changes")))),
                React.createElement(Card, { className: "mt-6" },
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Account Settings")),
                    React.createElement(CardContent, { className: "space-y-4" },
                        React.createElement(Button, { variant: "outline", className: "w-full" }, "Change Password"),
                        React.createElement(Button, { variant: "outline", className: "w-full" }, "Privacy Settings"),
                        React.createElement(Button, { variant: "outline", className: "w-full flex items-center gap-2", onClick: handleLogout, disabled: logoutMutation.isPending },
                            logoutMutation.isPending ? (React.createElement(Loader2, { className: "w-4 h-4 animate-spin" })) : (React.createElement(LogOut, { className: "w-4 h-4" })),
                            "Sign Out"),
                        React.createElement(Button, { variant: "destructive", className: "w-full" }, "Delete Account")))))));
}
