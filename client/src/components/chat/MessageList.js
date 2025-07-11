import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { useUpdateMessage, useDeleteMessage } from '@/hooks/useChat';
function MessageItem({ message, isOwn, showAvatar, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [showMenu, setShowMenu] = useState(false);
    const handleEdit = () => {
        if (editContent.trim() && editContent !== message.content) {
            onEdit(message.id, editContent.trim());
        }
        setIsEditing(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEdit();
        }
        else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditContent(message.content);
        }
    };
    const copyMessage = () => {
        navigator.clipboard.writeText(message.content);
        setShowMenu(false);
    };
    return (_jsxs("div", { className: `flex gap-3 p-3 hover:bg-gray-50 group ${isOwn ? 'flex-row-reverse' : ''}`, children: [showAvatar && (_jsxs(Avatar, { className: "w-8 h-8 flex-shrink-0", children: [_jsx(AvatarImage, { src: message.author.avatarUrl }), _jsx(AvatarFallback, { children: message.author.username.charAt(0).toUpperCase() })] })), _jsxs("div", { className: `flex-1 min-w-0 ${isOwn ? 'text-right' : ''}`, children: [showAvatar && (_jsxs("div", { className: `flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`, children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: message.author.username }), _jsx("span", { className: "text-xs text-gray-500", children: formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) })] })), _jsxs("div", { className: `relative ${isOwn ? 'ml-8' : 'mr-8'}`, children: [isEditing ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: editContent, onChange: (e) => setEditContent(e.target.value), onKeyDown: handleKeyDown, className: "w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500", rows: Math.min(editContent.split('\n').length, 5), autoFocus: true }), _jsxs("div", { className: "flex gap-2 text-xs", children: [_jsx(Button, { size: "sm", onClick: handleEdit, children: "Save" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setIsEditing(false), children: "Cancel" })] })] })) : (_jsxs("div", { className: `inline-block max-w-full p-3 rounded-lg text-sm break-words ${isOwn
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'} ${message.isOptimistic ? 'opacity-70' : ''} ${message.error ? 'bg-red-100 border border-red-300' : ''}`, children: [message.content, message.error && (_jsxs("div", { className: "mt-1 text-xs text-red-600", children: ["Failed to send: ", message.error] }))] })), !isEditing && !message.isOptimistic && (_jsx("div", { className: `absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity`, children: _jsxs("div", { className: "relative", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "h-6 w-6 p-0", onClick: () => setShowMenu(!showMenu), children: _jsx(MoreVertical, { className: "w-3 h-3" }) }), showMenu && (_jsxs("div", { className: `absolute top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 ${isOwn ? 'right-0' : 'left-0'}`, children: [_jsxs("button", { onClick: copyMessage, className: "flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 w-full text-left", children: [_jsx(Copy, { className: "w-3 h-3" }), "Copy"] }), isOwn && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => {
                                                                setIsEditing(true);
                                                                setShowMenu(false);
                                                            }, className: "flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 w-full text-left", children: [_jsx(Edit2, { className: "w-3 h-3" }), "Edit"] }), _jsxs("button", { onClick: () => {
                                                                onDelete(message.id);
                                                                setShowMenu(false);
                                                            }, className: "flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 text-red-600 w-full text-left", children: [_jsx(Trash2, { className: "w-3 h-3" }), "Delete"] })] }))] }))] }) }))] })] })] }));
}
export function MessageList({ roomId, messages, isLoading, hasNextPage, onLoadMore }) {
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const { user } = useAuthStore();
    const { typingUsersByRoom } = useChatStore();
    const updateMessageMutation = useUpdateMessage(roomId);
    const deleteMessageMutation = useDeleteMessage(roomId);
    const typingUsers = typingUsersByRoom[roomId] || [];
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (shouldAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, shouldAutoScroll]);
    // Handle scroll to detect if user is at bottom
    const handleScroll = () => {
        if (!messagesContainerRef.current)
            return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShouldAutoScroll(isAtBottom);
        // Load more messages when scrolled to top
        if (scrollTop === 0 && hasNextPage && onLoadMore) {
            onLoadMore();
        }
    };
    const handleEditMessage = (messageId, content) => {
        updateMessageMutation.mutate({ messageId, data: { content } });
    };
    const handleDeleteMessage = (messageId) => {
        deleteMessageMutation.mutate(messageId);
    };
    if (isLoading && messages.length === 0) {
        return (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx("div", { className: "text-gray-500", children: "Loading messages..." }) }));
    }
    return (_jsx("div", { className: "flex-1 flex flex-col", children: _jsxs("div", { ref: messagesContainerRef, onScroll: handleScroll, className: "flex-1 overflow-y-auto", children: [hasNextPage && (_jsx("div", { className: "p-4 text-center", children: _jsx(Button, { variant: "outline", size: "sm", onClick: onLoadMore, disabled: isLoading, children: isLoading ? 'Loading...' : 'Load more messages' }) })), _jsx("div", { className: "space-y-1", children: messages.map((message, index) => {
                        const prevMessage = messages[index - 1];
                        const isOwn = message.author.id === (user === null || user === void 0 ? void 0 : user.id);
                        const showAvatar = !prevMessage ||
                            prevMessage.author.id !== message.author.id ||
                            new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000; // 5 minutes
                        return (_jsx(MessageItem, { message: message, isOwn: isOwn, showAvatar: showAvatar, onEdit: handleEditMessage, onDelete: handleDeleteMessage }, message.id));
                    }) }), typingUsers.length > 0 && (_jsx("div", { className: "p-3 text-sm text-gray-500", children: typingUsers.length === 1 ? (_jsxs("span", { children: [typingUsers[0].username, " is typing..."] })) : (_jsxs("span", { children: [typingUsers.map(u => u.username).join(', '), " are typing..."] })) })), _jsx("div", { ref: messagesEndRef })] }) }));
}
