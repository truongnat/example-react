import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore, ChatMessage } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { useUpdateMessage, useDeleteMessage } from '@/hooks/useChat';
import { MessageActions } from './MessageActions';

interface MessageListProps {
  roomId: string;
  messages: ChatMessage[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

interface MessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

function MessageItem({ message, isOwn, showAvatar, onEdit, onDelete }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const handleEditMessage = (messageId: string) => {
    setIsEditing(true);
  };

  const handleDeleteMessage = (messageId: string) => {
    onDelete(messageId);
  };

  return (
    <div className={`flex gap-3 p-3 hover:bg-gray-50 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      {showAvatar && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.author.avatarUrl} />
          <AvatarFallback>
            {message.author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex-1 min-w-0 ${isOwn ? 'text-right' : ''}`}>
        {showAvatar && (
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
            <span className="text-sm font-medium text-gray-900">
              {message.author.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>
        )}

        <div className={`relative ${isOwn ? 'ml-8' : 'mr-8'}`}>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={Math.min(editContent.split('\n').length, 5)}
                autoFocus
              />
              <div className="flex gap-2 text-xs">
                <Button size="sm" onClick={handleEdit}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`inline-block max-w-full p-3 rounded-lg text-sm break-words ${isOwn
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
                } ${message.error ? 'bg-red-100 border border-red-300' : ''
                }`}
            >
              {message.content}
              {message.error && (
                <div className="mt-1 text-xs text-red-600">
                  Failed to send: {message.error}
                </div>
              )}
            </div>
          )}

          {/* Message actions */}
          {!isEditing && (
            <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}`}>
              <MessageActions
                message={message}
                isOwner={isOwn}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MessageList({ roomId, messages, isLoading, hasNextPage, onLoadMore }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const { user } = useAuthStore();
  const { typingUsersByRoom } = useChatStore();

  const updateMessageMutation = useUpdateMessage(roomId);
  const deleteMessageMutation = useDeleteMessage(roomId);

  const typingUsers = typingUsersByRoom[roomId] || [];

  // Handle scroll to detect if user is at bottom and show scroll to top button
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isAtBottom);

    // Show scroll to top button when scrolled down more than 300px
    const shouldShow = window.scrollY > 300;
    setShowScrollToTop(shouldShow);

    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [hasNextPage, onLoadMore]);

  const handleEditMessage = (messageId: string, content: string) => {
    updateMessageMutation.mutate({ messageId, data: { content } });
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {hasNextPage && (
          <div className="p-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load more messages'}
            </Button>
          </div>
        )}

        <div className="space-y-1">
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isOwn = message.author.id === user?.id;
            const showAvatar = !prevMessage ||
              prevMessage.author.id !== message.author.id ||
              new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000; // 5 minutes

            return (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            );
          })}
        </div>

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="p-3 text-sm text-gray-500">
            {typingUsers.length === 1 ? (
              <span>{typingUsers[0].username} is typing...</span>
            ) : (
              <span>{typingUsers.map(u => u.username).join(', ')} are typing...</span>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollToTop && (
        <div className="fixed bottom-24 right-6 z-50">
          <Button
            onClick={scrollToTop}
            size="sm"
            className="rounded-full w-12 h-12 p-0 shadow-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            title="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
