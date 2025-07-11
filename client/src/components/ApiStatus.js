var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { config } from '@/lib/config';
export const ApiStatus = ({ className }) => {
    const [status, setStatus] = useState('checking');
    const [lastChecked, setLastChecked] = useState(null);
    const [serverInfo, setServerInfo] = useState(null);
    const checkApiStatus = () => __awaiter(void 0, void 0, void 0, function* () {
        setStatus('checking');
        try {
            // Health endpoint is at /health, not /api/health
            const healthUrl = config.apiBaseUrl.replace('/api', '/health');
            const response = yield fetch(healthUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = yield response.json();
                setStatus('connected');
                setServerInfo(data);
            }
            else {
                setStatus('disconnected');
                setServerInfo(null);
            }
        }
        catch (error) {
            setStatus('error');
            setServerInfo(null);
            console.error('API status check failed:', error);
        }
        setLastChecked(new Date());
    });
    useEffect(() => {
        checkApiStatus();
        // Check every 30 seconds
        const interval = setInterval(checkApiStatus, 30000);
        return () => clearInterval(interval);
    }, []);
    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return React.createElement(RefreshCw, { className: "w-5 h-5 animate-spin text-blue-500" });
            case 'connected':
                return React.createElement(CheckCircle, { className: "w-5 h-5 text-green-500" });
            case 'disconnected':
                return React.createElement(XCircle, { className: "w-5 h-5 text-red-500" });
            case 'error':
                return React.createElement(AlertCircle, { className: "w-5 h-5 text-orange-500" });
        }
    };
    const getStatusText = () => {
        switch (status) {
            case 'checking':
                return 'Checking connection...';
            case 'connected':
                return 'Connected to API';
            case 'disconnected':
                return 'API not responding';
            case 'error':
                return 'Connection error';
        }
    };
    const getStatusColor = () => {
        switch (status) {
            case 'checking':
                return 'border-blue-200 bg-blue-50';
            case 'connected':
                return 'border-green-200 bg-green-50';
            case 'disconnected':
                return 'border-red-200 bg-red-50';
            case 'error':
                return 'border-orange-200 bg-orange-50';
        }
    };
    return (React.createElement(Card, { className: `${className} ${getStatusColor()}` },
        React.createElement(CardHeader, { className: "pb-3" },
            React.createElement(CardTitle, { className: "text-sm font-medium flex items-center gap-2" },
                getStatusIcon(),
                "API Status")),
        React.createElement(CardContent, { className: "pt-0" },
            React.createElement("div", { className: "space-y-2" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("span", { className: "text-sm" }, getStatusText()),
                    React.createElement(Button, { variant: "outline", size: "sm", onClick: checkApiStatus, disabled: status === 'checking' },
                        React.createElement(RefreshCw, { className: `w-3 h-3 ${status === 'checking' ? 'animate-spin' : ''}` }))),
                React.createElement("div", { className: "text-xs text-gray-600 space-y-1" },
                    React.createElement("div", null,
                        "Endpoint: ",
                        config.apiBaseUrl),
                    lastChecked && (React.createElement("div", null,
                        "Last checked: ",
                        lastChecked.toLocaleTimeString())),
                    serverInfo && (React.createElement("div", { className: "mt-2 p-2 bg-white rounded border" },
                        React.createElement("div", { className: "font-medium" }, "Server Info:"),
                        React.createElement("div", null,
                            "Status: ",
                            serverInfo.status || 'OK'),
                        serverInfo.version && React.createElement("div", null,
                            "Version: ",
                            serverInfo.version),
                        serverInfo.timestamp && (React.createElement("div", null,
                            "Server Time: ",
                            new Date(serverInfo.timestamp).toLocaleString()))))),
                status === 'disconnected' || status === 'error' ? (React.createElement("div", { className: "mt-3 p-2 bg-white rounded border text-xs" },
                    React.createElement("div", { className: "font-medium text-red-600 mb-1" }, "Troubleshooting:"),
                    React.createElement("ul", { className: "list-disc list-inside space-y-1 text-gray-600" },
                        React.createElement("li", null, "Check if backend server is running"),
                        React.createElement("li", null, "Verify API URL in environment variables"),
                        React.createElement("li", null, "Check network connection"),
                        React.createElement("li", null, "Look for CORS issues in browser console")))) : null))));
};
