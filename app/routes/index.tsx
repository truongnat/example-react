import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useRef } from 'react'

const API_BASE = ''

export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos')
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    }),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}

async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
}

async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete todo')
}

export const Route = createFileRoute('/')({
  loader: () => fetchTodos(),
  component: TodoPage,
})

function TodoPage() {
  const todos = Route.useLoaderData()
  const router = useRouter()

  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.filter((t) => !t.completed).length

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    setIsAdding(true)
    setError(null)
    try {
      await createTodo(title)
      setNewTitle('')
      await router.invalidate()
      inputRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo')
    } finally {
      setIsAdding(false)
    }
  }

  async function handleToggle(todo: Todo) {
    setError(null)
    try {
      await toggleTodo(todo.id, !todo.completed)
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
    }
  }

  async function handleDelete(id: number) {
    setError(null)
    try {
      await deleteTodo(id)
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
    }
  }

  async function handleClearCompleted() {
    setError(null)
    try {
      const completedTodos = todos.filter((t) => t.completed)
      await Promise.all(completedTodos.map((t) => deleteTodo(t.id)))
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-2">
            ✅ Todo App
          </h1>
          <p className="text-gray-500 text-sm">
            Powered by TanStack Start + json-server
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add Todo Form */}
        <form
          onSubmit={handleAdd}
          className="mb-6 flex gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={isAdding}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isAdding || !newTitle.trim()}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold shadow-sm hover:from-violet-600 hover:to-indigo-600 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? '...' : 'Add'}
          </button>
        </form>

        {/* Stats Bar */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-violet-600">{activeCount}</span>{' '}
              {activeCount === 1 ? 'item' : 'items'} left
            </span>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    filter === f
                      ? 'bg-violet-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-violet-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-sm text-gray-400 hover:text-red-500 transition"
              >
                Clear completed ({completedCount})
              </button>
            )}
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">
                {filter === 'completed' ? '🎉' : filter === 'active' ? '🌟' : '📝'}
              </div>
              <p className="text-gray-400 text-lg">
                {filter === 'completed'
                  ? 'No completed todos yet'
                  : filter === 'active'
                  ? 'No active todos — great job!'
                  : 'No todos yet. Add one above!'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400">
          <p>
            {todos.length} total todo{todos.length !== 1 ? 's' : ''} •{' '}
            {completedCount} completed
          </p>
          <p className="mt-1">
            Built with{' '}
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noreferrer"
              className="text-violet-500 hover:underline"
            >
              TanStack Start
            </a>{' '}
            &{' '}
            <a
              href="https://github.com/typicode/json-server"
              target="_blank"
              rel="noreferrer"
              className="text-violet-500 hover:underline"
            >
              json-server
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  async function handleEditSave() {
    const title = editValue.trim()
    if (!title || title === todo.title) {
      setIsEditing(false)
      setEditValue(todo.title)
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setIsEditing(false)
      await router.invalidate()
    } catch {
      // revert
      setEditValue(todo.title)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const createdDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${
        todo.completed ? 'border-gray-100 opacity-75' : 'border-gray-100'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-gradient-to-r from-violet-500 to-indigo-500 border-transparent'
            : 'border-gray-300 hover:border-violet-400'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title / Edit */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave()
              if (e.key === 'Escape') {
                setEditValue(todo.title)
                setIsEditing(false)
              }
            }}
            disabled={isSaving}
            className="w-full text-gray-800 font-medium bg-gray-50 border border-violet-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
          />
        ) : (
          <span
            className={`text-gray-800 font-medium cursor-pointer truncate block ${
              todo.completed ? 'line-through text-gray-400' : ''
            }`}
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
        <span className="text-xs text-gray-400">{createdDate}</span>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        aria-label="Delete todo"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
