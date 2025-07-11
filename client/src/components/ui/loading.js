import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
export const LoadingSpinner = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };
    return (_jsx(Loader2, { className: cn('animate-spin', sizeClasses[size], className) }));
};
export const LoadingState = ({ message = 'Loading...', size = 'md', className }) => {
    return (_jsxs("div", { className: cn('flex items-center justify-center py-8', className), children: [_jsx(LoadingSpinner, { size: size }), _jsx("span", { className: "ml-2 text-gray-600", children: message })] }));
};
export const ErrorState = ({ message = 'Something went wrong', error, onRetry, className }) => {
    return (_jsxs("div", { className: cn('text-center py-8 text-red-600', className), children: [_jsx("p", { className: "font-medium", children: message }), (error === null || error === void 0 ? void 0 : error.message) && (_jsx("p", { className: "text-sm mt-2 text-red-500", children: error.message })), onRetry && (_jsx("button", { onClick: onRetry, className: "mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors", children: "Try Again" }))] }));
};
export const EmptyState = ({ message = 'No data found', description, icon, action, className }) => {
    return (_jsxs("div", { className: cn('text-center py-8 text-gray-500', className), children: [icon && _jsx("div", { className: "mb-4", children: icon }), _jsx("p", { className: "font-medium", children: message }), description && (_jsx("p", { className: "text-sm mt-2", children: description })), action && (_jsx("div", { className: "mt-4", children: action }))] }));
};
