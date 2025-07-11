import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { httpClient } from '@/lib/http-client';
export const AuthDebug = () => {
    var _a;
    const { user, isAuthenticated, tokens } = useAuthStore();
    const [storageData, setStorageData] = React.useState(null);
    React.useEffect(() => {
        try {
            const authData = localStorage.getItem('auth-storage');
            if (authData) {
                setStorageData(JSON.parse(authData));
            }
        }
        catch (error) {
            console.error('Failed to parse auth storage:', error);
        }
    }, []);
    const handleReloadTokens = () => {
        httpClient.reloadTokens();
        // Force re-render by updating storage data
        try {
            const authData = localStorage.getItem('auth-storage');
            if (authData) {
                setStorageData(JSON.parse(authData));
            }
        }
        catch (error) {
            console.error('Failed to parse auth storage:', error);
        }
    };
    return (React.createElement(Card, { className: "mt-4" },
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, { className: "text-sm" }, "Auth Debug Info")),
        React.createElement(CardContent, { className: "text-xs space-y-2" },
            React.createElement("div", null,
                React.createElement("strong", null, "Auth Store:"),
                React.createElement("pre", { className: "bg-gray-100 p-2 rounded mt-1 overflow-auto" }, JSON.stringify({
                    isAuthenticated,
                    user: user ? { id: user.id, name: user.name, email: user.email } : null,
                    hasTokens: !!tokens,
                    tokens: tokens ? {
                        hasAccessToken: !!tokens.accessToken,
                        hasRefreshToken: !!tokens.refreshToken,
                        accessTokenLength: ((_a = tokens.accessToken) === null || _a === void 0 ? void 0 : _a.length) || 0
                    } : null
                }, null, 2))),
            React.createElement("div", null,
                React.createElement("strong", null, "LocalStorage:"),
                React.createElement("pre", { className: "bg-gray-100 p-2 rounded mt-1 overflow-auto" }, storageData ? JSON.stringify(storageData, null, 2) : 'No data')),
            React.createElement("button", { onClick: handleReloadTokens, className: "px-3 py-1 bg-blue-500 text-white rounded text-xs" }, "Reload Tokens"))));
};
