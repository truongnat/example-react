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
    return (React.createElement("div", { className: `flex gap-3 p-3 hover:bg-gray-50 group ${isOwn ? 'flex-row-reverse' : ''}` },
        showAvatar && (React.createElement(Avatar, { className: "w-8 h-8 flex-shrink-0" },
            React.createElement(AvatarImage, { src: message.author.avatarUrl }),
            React.createElement(AvatarFallback, null, message.author.username.charAt(0).toUpperCase()))),
        React.createElement("div", { className: `flex-1 min-w-0 ${isOwn ? 'text-right' : ''}` },
            showAvatar && (React.createElement("div", { className: `flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}` },
                React.createElement("span", { className: "text-sm font-medium text-gray-900" }, message.author.username),
                React.createElement("span", { className: "text-xs text-gray-500" }, formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })))),
            React.createElement("div", { className: `relative ${isOwn ? 'ml-8' : 'mr-8'}` },
                isEditing ? (React.createElement("div", { className: "space-y-2" },
                    React.createElement("textarea", { value: editContent, onChange: (e) => setEditContent(e.target.value), onKeyDown: handleKeyDown, className: "w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500", rows: Math.min(editContent.split('\n').length, 5), autoFocus: true }),
                    React.createElement("div", { className: "flex gap-2 text-xs" },
                        React.createElement(Button, { size: "sm", onClick: handleEdit }, "Save"),
                        React.createElement(Button, { size: "sm", variant: "outline", onClick: () => setIsEditing(false) }, "Cancel")))) : (React.createElement("div", { className: `inline-block max-w-full p-3 rounded-lg text-sm break-words ${isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'} ${message.isOptimistic ? 'opacity-70' : ''} ${message.error ? 'bg-red-100 border border-red-300' : ''}` },
                    message.content,
                    message.error && (React.createElement("div", { className: "mt-1 text-xs text-red-600" },
                        "Failed to send: ",
                        message.error)))),
                !isEditing && !message.isOptimistic && (React.createElement("div", { className: `absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity` },
                    React.createElement("div", { className: "relative" },
                        React.createElement(Button, { size: "sm", variant: "ghost", className: "h-6 w-6 p-0", onClick: () => setShowMenu(!showMenu) },
                            React.createElement(MoreVertical, { className: "w-3 h-3" })),
                        showMenu && (React.createElement("div", { className: `absolute top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 ${isOwn ? 'right-0' : 'left-0'}` },
                            React.createElement("button", { onClick: copyMessage, className: "flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 w-full text-left" },
                                React.createElement(Copy, { className: "w-3 h-3" }),
                                "Copy"),
                            isOwn && (React.createElement(React.Fragment, null,
                                React.createElement("button", { onClick: () => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }, className: "flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 w-full text-left" },
                                    React.createElement(Edit2, { className: "w-3 h-3" }),
                                    "Edit"),
                                React.createElement("button", { onClick: () => {
                                        onDelete(message.id);
                                        setShowMenu(false);
                                    }, className: "flex items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100 text-red-600 w-full text-left" },
                                    React.createElement(Trash2, { className: "w-3 h-3" }),
                                    "Delete"))))))))))));
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
        return (React.createElement("div", { className: "flex-1 flex items-center justify-center" },
            React.createElement("div", { className: "text-gray-500" }, "Loading messages...")));
    }
    return (React.createElement("div", { className: "flex-1 flex flex-col" },
        React.createElement("div", { ref: messagesContainerRef, onScroll: handleScroll, className: "flex-1 overflow-y-auto" },
            hasNextPage && (React.createElement("div", { className: "p-4 text-center" },
                React.createElement(Button, { variant: "outline", size: "sm", onClick: onLoadMore, disabled: isLoading }, isLoading ? 'Loading...' : 'Load more messages'))),
            React.createElement("div", { className: "space-y-1" }, messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const isOwn = message.author.id === (user === null || user === void 0 ? void 0 : user.id);
                const showAvatar = !prevMessage ||
                    prevMessage.author.id !== message.author.id ||
                    new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000; // 5 minutes
                return (React.createElement(MessageItem, { key: message.id, message: message, isOwn: isOwn, showAvatar: showAvatar, onEdit: handleEditMessage, onDelete: handleDeleteMessage }));
            })),
            typingUsers.length > 0 && (React.createElement("div", { className: "p-3 text-sm text-gray-500" }, typingUsers.length === 1 ? (React.createElement("span", null,
                typingUsers[0].username,
                " is typing...")) : (React.createElement("span", null,
                typingUsers.map(u => u.username).join(', '),
                " are typing...")))),
            React.createElement("div", { ref: messagesEndRef }))));
}
