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
  const [validationError, setValidationError] = useState('')
  const [statusFilter, setStatusFilter] = useState<TodoStatus | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'status'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // React Query hooks
  const { data: todosData, isLoading, error, refetch } = useTodos({
    status: statusFilter,
    sortBy,
    sortOrder,
    limit: 50
  })
  const createTodoMutation = useCreateTodo()
  const updateStatusMutation = useUpdateTodoStatus()
  const deleteTodoMutation = useDeleteTodo()

  const validateForm = () => {
    if (!newTodoTitle.trim()) {
      setValidationError('Title is required')
      return false
    }
    if (newTodoTitle.trim().length < 3) {
      setValidationError('Title must be at least 3 characters long')
      return false
    }
    if (newTodoTitle.trim().length > 200) {
      setValidationError('Title must be less than 200 characters')
      return false
    }
    if (newTodoContent.trim().length > 2000) {
      setValidationError('Content must be less than 2000 characters')
      return false
    }
    setValidationError('')
    return true
  }

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    createTodoMutation.mutate({
      title: newTodoTitle.trim(),
      content: newTodoContent.trim() || newTodoTitle.trim(),
    }, {
      onSuccess: () => {
        setNewTodoTitle('')
        setNewTodoContent('')
        setValidationError('')
      },
      onError: (error: any) => {
        setValidationError(error.message || 'Failed to create todo')
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
              {(validationError || createTodoMutation.error) && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {validationError || createTodoMutation.error?.message || 'Failed to create todo'}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter task title..."
                  value={newTodoTitle}
                  onChange={(e) => {
                    setNewTodoTitle(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  className="flex-1"
                  required
                  maxLength={200}
                />
                <Button type="submit" disabled={createTodoMutation.isPending || !newTodoTitle.trim()}>
                  {createTodoMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </>
                  )}
                </Button>
              </div>
              <Input
                placeholder="Enter task description (optional)..."
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                maxLength={2000}
              />
              <div className="text-xs text-gray-500">
                Title: {newTodoTitle.length}/200 characters
                {newTodoContent && ` • Description: ${newTodoContent.length}/2000 characters`}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Tasks</CardTitle>
                {todosData && (
                  <p className="text-sm text-gray-600 mt-1">
                    {todosData.total} total • {todosData.todos.filter(t => t.status === TodoStatus.COMPLETED).length} completed
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value as TodoStatus || undefined)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="">All Status</option>
                  <option value={TodoStatus.INITIAL}>Initial</option>
                  <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TodoStatus.COMPLETED}>Completed</option>
                  <option value={TodoStatus.CANCELLED}>Cancelled</option>
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                  className="px-2 py-1 border rounded"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="status-asc">Status A-Z</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading tasks..." />
            ) : error ? (
              <ErrorState
                message="Failed to load tasks"
                error={error}
                onRetry={() => refetch()}
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
