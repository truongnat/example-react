import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'

interface NavigationProps {
  showBackButton?: boolean
  title?: string
  transparent?: boolean
}

export function Navigation({ showBackButton = false, title, transparent = false }: NavigationProps) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const logoutMutation = useLogout()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <nav className={`${transparent ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'} shadow-sm border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            )}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  {title || 'MERN Stack'}
                </h1>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Home className="w-4 h-4 inline mr-1" />
                Home
              </Link>
              <Link 
                to="/todo" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/todo') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Todo
              </Link>
              <Link 
                to="/chat" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/chat') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Chat
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name}
                </span>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/todo" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/todo') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Todo
          </Link>
          <Link 
            to="/chat" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/chat') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Chat
          </Link>
          <Link 
            to="/profile" 
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/profile') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
