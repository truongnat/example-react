import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { ChatRoomList } from '@/components/chat/ChatRoomList'
import { ChatRoom } from '@/components/chat/ChatRoom'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { useSocketConnection } from '@/hooks/useChat'

export const Route = createFileRoute('/chat')({
  beforeLoad: ({ location }) => {
    // Check if user is authenticated
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: ChatPage,
})

function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const navigate = useNavigate()

  // Initialize socket connection
  useSocketConnection()

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
    // Update URL to include room ID
    navigate({
      to: '/room/$id',
      params: { id: roomId },
    }).catch(() => {
      // If navigation fails, just set the selected room
      setSelectedRoomId(roomId)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Chat" />
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Room list sidebar */}
        <div className="w-80 flex-shrink-0">
          <ChatRoomList
            onRoomSelect={handleRoomSelect}
            selectedRoomId={selectedRoomId}
          />
        </div>

        {/* Chat area */}
        <div className="flex-1">
          {selectedRoomId ? (
            <ChatRoom roomId={selectedRoomId} />
          ) : (
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Select a room to start chatting</h3>
                <p className="text-sm">Choose a room from the sidebar to begin your conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
