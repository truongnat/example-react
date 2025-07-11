import { createFileRoute, useParams, Link, redirect } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ChatRoom } from '@/components/chat/ChatRoom'
import { useAuthStore } from '@/stores/authStore'
import { useSocketConnection } from '@/hooks/useChat'

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
  const [message, setMessage] = useState('')

  // Sample room data
  const roomData = {
    '1': { name: 'General Discussion', memberCount: 12 },
    '2': { name: 'Project Team', memberCount: 8 },
    '3': { name: 'Random Chat', memberCount: 5 }
  }

  const room = roomData[id as keyof typeof roomData] || { name: 'Unknown Room', memberCount: 0 }

  // Sample messages
  const messages = [
    {
      id: 1,
      user: 'John Doe',
      message: 'Hey everyone! How are you doing?',
      time: '10:30 AM',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      user: 'Jane Smith',
      message: 'Good morning! Working on the new features today.',
      time: '10:32 AM',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      user: 'You',
      message: 'Sounds great! Let me know if you need any help.',
      time: '10:35 AM',
      avatar: '/api/placeholder/32/32',
      isOwn: true
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
      setMessage('')
    }
  }

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
            <div className="border-l pl-3">
              <h1 className="font-semibold text-gray-900">{room.name}</h1>
              <p className="text-sm text-gray-500">{room.memberCount} members online</p>
            </div>
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

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${msg.isOwn ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <div
                    className={`inline-block px-3 py-2 rounded-lg max-w-xs lg:max-w-md ${
                      msg.isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
