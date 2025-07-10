import { createFileRoute, redirect } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Navigation } from '@/components/Navigation'
import { useAuthStore } from '@/stores/authStore'
import { useTodos, useCreateTodo, useUpdateTodoStatus, useDeleteTodo } from '@/hooks/useTodos'
import { TodoStatus } from '@/types/api'
import { Loader2, Trash2, Edit, Plus, CheckCircle } from 'lucide-react'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/loading'

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
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoContent, setNewTodoContent] = useState('')

  // React Query hooks
  const { data: todosData, isLoading, error } = useTodos()
  const createTodoMutation = useCreateTodo()
  const updateStatusMutation = useUpdateTodoStatus()
  const deleteTodoMutation = useDeleteTodo()

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoTitle.trim()) return

    createTodoMutation.mutate({
      title: newTodoTitle,
      content: newTodoContent || newTodoTitle,
    }, {
      onSuccess: () => {
        setNewTodoTitle('')
        setNewTodoContent('')
      }
    })
  }

  const handleToggleStatus = (todoId: string, currentStatus: string) => {
    const newStatus = currentStatus === TodoStatus.COMPLETED ? TodoStatus.INITIAL : TodoStatus.COMPLETED
    updateStatusMutation.mutate({ id: todoId, data: { status: newStatus } })
  }

  const handleDeleteTodo = (todoId: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodoMutation.mutate(todoId)
    }
  }

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
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter task title..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={createTodoMutation.isPending}>
                  {createTodoMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Add Task'
                  )}
                </Button>
              </div>
              <Input
                placeholder="Enter task description (optional)..."
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
              />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading tasks..." />
            ) : error ? (
              <ErrorState
                message="Failed to load tasks"
                error={error}
                onRetry={() => window.location.reload()}
              />
            ) : todosData?.todos && todosData.todos.length > 0 ? (
              <div className="space-y-3">
                {todosData.todos.map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`task-${todo.id}`}
                      checked={todo.status === TodoStatus.COMPLETED}
                      onCheckedChange={() => handleToggleStatus(todo.id, todo.status)}
                      disabled={updateStatusMutation.isPending}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`task-${todo.id}`}
                        className={`block text-sm font-medium ${
                          todo.status === TodoStatus.COMPLETED
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {todo.title}
                      </label>
                      {todo.content !== todo.title && (
                        <p className="text-xs text-gray-600 mt-1">{todo.content}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        alert('Edit functionality coming soon!')
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message="No tasks yet"
                description="Create your first task above to get started!"
                icon={<CheckCircle className="w-12 h-12 mx-auto text-gray-400" />}
              />
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
