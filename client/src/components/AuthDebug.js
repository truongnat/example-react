import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Card, { className: "mt-4", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Auth Debug Info" }) }), _jsxs(CardContent, { className: "text-xs space-y-2", children: [_jsxs("div", { children: [_jsx("strong", { children: "Auth Store:" }), _jsx("pre", { className: "bg-gray-100 p-2 rounded mt-1 overflow-auto", children: JSON.stringify({
                                    isAuthenticated,
                                    user: user ? { id: user.id, name: user.name, email: user.email } : null,
                                    hasTokens: !!tokens,
                                    tokens: tokens ? {
                                        hasAccessToken: !!tokens.accessToken,
                                        hasRefreshToken: !!tokens.refreshToken,
                                        accessTokenLength: ((_a = tokens.accessToken) === null || _a === void 0 ? void 0 : _a.length) || 0
                                    } : null
                                }, null, 2) })] }), _jsxs("div", { children: [_jsx("strong", { children: "LocalStorage:" }), _jsx("pre", { className: "bg-gray-100 p-2 rounded mt-1 overflow-auto", children: storageData ? JSON.stringify(storageData, null, 2) : 'No data' })] }), _jsx("button", { onClick: handleReloadTokens, className: "px-3 py-1 bg-blue-500 text-white rounded text-xs", children: "Reload Tokens" })] })] }));
};
