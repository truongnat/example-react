import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chatStore';
export function MessageInput({ roomId, disabled = false, placeholder = "Type a message..." }) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { sendMessage, setTyping } = useChatStore();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || disabled)
            return;
        // Send message
        sendMessage(roomId, message.trim());
        // Clear input
        setMessage('');
        // Stop typing indicator
        if (isTyping) {
            setTyping(roomId, false);
            setIsTyping(false);
        }
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
        // Handle typing indicator
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            setTyping(roomId, true);
        }
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        // Set new timeout to stop typing
        if (value.trim()) {
            typingTimeoutRef.current = window.setTimeout(() => {
                setIsTyping(false);
                setTyping(roomId, false);
            }, 1000);
        }
        else if (isTyping) {
            setIsTyping(false);
            setTyping(roomId, false);
        }
    };
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (isTyping) {
                setTyping(roomId, false);
            }
        };
    }, [roomId, isTyping, setTyping]);
    return (_jsxs("div", { className: "border-t bg-white p-4", children: [_jsxs("form", { onSubmit: handleSubmit, className: "flex items-end gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("textarea", { ref: textareaRef, value: message, onChange: handleInputChange, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, className: "w-full resize-none rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed", style: { minHeight: '40px', maxHeight: '120px' }, rows: 1 }), _jsx("button", { type: "button", className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors", disabled: disabled, children: _jsx(Smile, { className: "w-4 h-4" }) })] }), _jsxs(Button, { type: "submit", size: "sm", disabled: !message.trim() || disabled, className: "h-10 px-3", children: [_jsx(Send, { className: "w-4 h-4" }), _jsx("span", { className: "sr-only", children: "Send message" })] })] }), message.length > 1800 && (_jsxs("div", { className: "mt-1 text-xs text-gray-500 text-right", children: [message.length, "/2000"] }))] }));
}
