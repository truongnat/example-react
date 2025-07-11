import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
export const LoadingSpinner = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };
    return (React.createElement(Loader2, { className: cn('animate-spin', sizeClasses[size], className) }));
};
export const LoadingState = ({ message = 'Loading...', size = 'md', className }) => {
    return (React.createElement("div", { className: cn('flex items-center justify-center py-8', className) },
        React.createElement(LoadingSpinner, { size: size }),
        React.createElement("span", { className: "ml-2 text-gray-600" }, message)));
};
export const ErrorState = ({ message = 'Something went wrong', error, onRetry, className }) => {
    return (React.createElement("div", { className: cn('text-center py-8 text-red-600', className) },
        React.createElement("p", { className: "font-medium" }, message),
        (error === null || error === void 0 ? void 0 : error.message) && (React.createElement("p", { className: "text-sm mt-2 text-red-500" }, error.message)),
        onRetry && (React.createElement("button", { onClick: onRetry, className: "mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" }, "Try Again"))));
};
export const EmptyState = ({ message = 'No data found', description, icon, action, className }) => {
    return (React.createElement("div", { className: cn('text-center py-8 text-gray-500', className) },
        icon && React.createElement("div", { className: "mb-4" }, icon),
        React.createElement("p", { className: "font-medium" }, message),
        description && (React.createElement("p", { className: "text-sm mt-2" }, description)),
        action && (React.createElement("div", { className: "mt-4" }, action))));
};
