import { createFileRoute, useParams, Link, redirect } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ChatRoom } from '@/components/chat/ChatRoom'
import { useAuthStore } from '@/stores/authStore'


export const Route = createFileRoute('/room/$id')({
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
  component: RoomPage,
})

function RoomPage() {
  const { id } = useParams({ from: '/room/$id' })

  // Socket connection is now managed by SocketProvider

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/chat">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Room */}
      <div className="h-[calc(100vh-4rem)]">
        <ChatRoom roomId={id} />
      </div>
    </div>
  )
}
