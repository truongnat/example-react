import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CheckCircle, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface NavigationProps {
  title?: string
}

export function Navigation({ title = 'TanStack Todo' }: NavigationProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
          {title}
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
