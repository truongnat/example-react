import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CheckCircle, Zap, Shield, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          TanStack Todo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A beginner-friendly Todo App built with the full TanStack ecosystem
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">TanStack Query</p>
            <p className="text-xs text-gray-500">Smart caching</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <RefreshCw className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">TanStack Router</p>
            <p className="text-xs text-gray-500">Type-safe routing</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Zustand</p>
            <p className="text-xs text-gray-500">Auth state</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/truongnat/example-react" target="_blank">View Source</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
