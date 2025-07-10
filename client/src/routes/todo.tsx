import { createFileRoute, redirect } from '@tanstack/react-router'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Navigation } from '@/components/Navigation'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/todo')({
  beforeLoad: ({ context, location }) => {
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
  component: TodoPage,
})

function TodoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Todo App" />
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo Manager</h1>
            <p className="text-gray-600">Organize your tasks and boost productivity</p>
          </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a new task..."
                className="flex-1"
              />
              <Button>Add Task</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Sample tasks */}
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox id="task1" />
                <label htmlFor="task1" className="flex-1 text-sm">
                  Complete the project documentation
                </label>
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox id="task2" />
                <label htmlFor="task2" className="flex-1 text-sm">
                  Review code changes
                </label>
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>

              <div className="text-center py-8 text-gray-500">
                <p>No more tasks. Great job! 🎉</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
