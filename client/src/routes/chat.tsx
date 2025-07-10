import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { useAuthStore } from '@/stores/authStore'

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
  // Sample chat rooms data
  const rooms = [
    {
      id: '1',
      name: 'General Discussion',
      lastMessage: 'Hey everyone! How are you doing?',
      lastMessageTime: '2 min ago',
      unreadCount: 3,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      name: 'Project Team',
      lastMessage: 'The deadline has been moved to next week',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      name: 'Random Chat',
      lastMessage: 'Anyone up for lunch?',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      avatar: '/api/placeholder/40/40'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Chat Rooms" />
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Rooms</h1>
              <p className="text-gray-600">Connect with your team and friends</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Room
            </Button>
          </div>

        <div className="space-y-4">
          {rooms.map((room) => (
            <Link key={room.id} to={`/room/${room.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={room.avatar} />
                      <AvatarFallback>{room.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {room.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {room.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {room.lastMessage}
                      </p>
                    </div>

                    {room.unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {rooms.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No chat rooms yet</p>
                <Button>Create Your First Room</Button>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
