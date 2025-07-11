import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chatStore';
import { EmojiPicker } from './EmojiPicker';

interface MessageInputProps {
  roomId: string;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ roomId, disabled = false, placeholder = "Type a message..." }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  const { sendMessage, setTyping } = useChatStore();

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.slice(0, start) + emoji + message.slice(end);

    setMessage(newMessage);

    // Trigger input change logic for typing indicator
    handleInputChange({ target: { value: newMessage } } as React.ChangeEvent<HTMLTextAreaElement>);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
    
    // Handle typing indicator with debounce
    const now = Date.now();

    if (value.trim()) {
      // Start typing indicator if not already typing
      if (!isTyping) {
        setIsTyping(true);
        setTyping(roomId, true);
        lastTypingTimeRef.current = now;
      } else {
        // Debounce: only send typing update if it's been more than 1 second since last update
        if (now - lastTypingTimeRef.current > 1000) {
          setTyping(roomId, true);
          lastTypingTimeRef.current = now;
        }
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after user stops typing
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
        setTyping(roomId, false);
      }, 3000); // ✅ Stop typing after 3 seconds of inactivity
    } else if (isTyping) {
      // Stop typing immediately if input is empty
      setIsTyping(false);
      setTyping(roomId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
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

  return (
    <div className="sticky bottom-0 z-10 border-t bg-white p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            rows={1}
          />
          
          {/* Emoji picker */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} disabled={disabled} />
          </div>
        </div>
        
        <Button
          type="submit"
          size="sm"
          disabled={!message.trim() || disabled}
          className="h-10 px-3"
        >
          <Send className="w-4 h-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      
      {/* Character count (optional) */}
      {message.length > 1800 && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {message.length}/2000
        </div>
      )}
    </div>
  );
}
