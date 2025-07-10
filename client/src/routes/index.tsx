import { createFileRoute, Link } from '@tanstack/react-router'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code, Database, Globe, Zap, Users, MessageCircle, CheckSquare, Lock } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Modern Tech Stack",
      description: "Built with React, TypeScript, TanStack Router, and TailwindCSS",
      color: "bg-blue-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Full Stack Ready",
      description: "Complete MERN stack with MongoDB, Express, React, and Node.js",
      color: "bg-green-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High Performance",
      description: "Optimized for speed with modern bundling and state management",
      color: "bg-yellow-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Responsive Design",
      description: "Beautiful UI that works perfectly on all devices",
      color: "bg-purple-500"
    }
  ]

  const apps = [
    {
      title: "Todo Manager",
      description: "Organize your tasks efficiently with our intuitive todo application",
      icon: <CheckSquare className="w-6 h-6" />,
      link: "/todo",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Chat Rooms",
      description: "Connect with others in real-time chat rooms",
      icon: <MessageCircle className="w-6 h-6" />,
      link: "/chat",
      color: "from-green-500 to-green-600"
    },
    {
      title: "User Profile",
      description: "Manage your account settings and preferences",
      icon: <Users className="w-6 h-6" />,
      link: "/profile",
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation transparent />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Modern Full Stack Application
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MERN Stack
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modern, full-featured web application built with the latest technologies. 
              Experience the power of React, TanStack Router, shadcn/ui, and TailwindCSS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/todo">
                    <Button size="lg" className="w-full sm:w-auto">
                      Try Todo App
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Join Chat Rooms
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="w-full sm:w-auto">
                      Sign In to Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Create Account
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {!isAuthenticated && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center gap-2 text-blue-800">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Authentication Required</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Sign in to access Todo Manager, Chat Rooms, and Profile features.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our application leverages the latest and greatest technologies to provide 
              you with the best possible experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-white mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Our Applications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful applications we've built to showcase the capabilities 
              of our modern tech stack.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {apps.map((app, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${app.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {app.icon}
                  </div>
                  <CardTitle className="text-xl">{app.title}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isAuthenticated ? (
                    <Link to={app.link}>
                      <Button className="w-full">
                        Try it now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        <Lock className="w-4 h-4 mr-2" />
                        Sign in to access
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
                <span className="ml-3 text-xl font-semibold">MERN Stack</span>
              </div>
              <p className="text-gray-400 mb-4">
                A modern full-stack application showcasing the power of React, 
                TanStack Router, and modern web technologies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Applications</h3>
              <ul className="space-y-2">
                <li><Link to="/todo" className="text-gray-400 hover:text-white">Todo Manager</Link></li>
                <li><Link to="/chat" className="text-gray-400 hover:text-white">Chat Rooms</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white">User Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                <li><Link to="/forgot-password" className="text-gray-400 hover:text-white">Forgot Password</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MERN Stack App. Built with ❤️ using modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
