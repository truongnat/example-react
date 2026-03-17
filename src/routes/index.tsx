import { createFileRoute, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { PlusIcon, Trash2Icon, ListTodoIcon, SunIcon, LoaderIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardFooter } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'

const API = 'https://jsonplaceholder.typicode.com'

export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const res = await fetch(`${API}/todos?_limit=20`)
    if (!res.ok) throw new Error('Failed to fetch todos')
    return res.json() as Promise<Todo[]>
  },
  component: TodoPage,
})

type FilterType = 'all' | 'active' | 'completed'

function TodoPage() {
  const initialTodos = Route.useLoaderData()
  const router = useRouter()

  const [todos, setTodos] = React.useState<Todo[]>(initialTodos)
  const [newTitle, setNewTitle] = React.useState('')
  const [isAdding, setIsAdding] = React.useState(false)
  const [filter, setFilter] = React.useState<FilterType>('all')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => { setTodos(initialTodos) }, [initialTodos])

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
    try {
      const res = await fetch(`${API}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false, userId: 1 }),
      })
      const created: Todo = await res.json()
      setTodos(prev => [{ ...created, id: Date.now() }, ...prev])
      setNewTitle('')
      inputRef.current?.focus()
    } finally {
      setIsAdding(false)
    }
  }

  async function handleToggle(todo: Todo) {
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t))
    await fetch(`${API}/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    }).catch(() => {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t))
    })
  }

  async function handleDelete(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' }).catch(() => router.invalidate())
  }

  async function handleClearCompleted() {
    const completed = todos.filter(t => t.completed)
    setTodos(prev => prev.filter(t => !t.completed))
    await Promise.all(completed.map(t => fetch(`${API}/todos/${t.id}`, { method: 'DELETE' }))).catch(() => router.invalidate())
  }

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Done' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-xl space-y-4">

        {/* Header */}
        <div className="text-center space-y-1 pb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
            <ListTodoIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Todos</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount === 0 ? '🎉 All done!' : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>

        {/* Add Todo Card */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="flex gap-2">
              <Input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new task..."
                disabled={isAdding}
                className="flex-1 h-10"
              />
              <Button type="submit" disabled={isAdding || !newTitle.trim()} size="default" className="h-10 px-4 shrink-0">
                {isAdding ? (
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{isAdding ? 'Adding...' : 'Add'}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Todos Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {filters.map(f => (
                  <Button
                    key={f.value}
                    variant={filter === f.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(f.value)}
                    className="h-7 px-3 text-xs"
                  >
                    {f.label}
                    {f.value === 'all' && (
                      <Badge variant={filter === 'all' ? 'secondary' : 'outline'} className="ml-1 h-4 px-1 text-[10px]">
                        {todos.length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              {completedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCompleted}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="w-3 h-3 mr-1" />
                  Clear done
                </Button>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            {filteredTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <SunIcon className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {filter === 'completed' ? 'No completed tasks yet' : filter === 'active' ? 'No active tasks — all done!' : 'No tasks yet. Add one above!'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filteredTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdate={(id, title) => setTodos(prev => prev.map(t => t.id === id ? { ...t, title } : t))}
                  />
                ))}
              </ul>
            )}
          </CardContent>

          {todos.length > 0 && (
            <>
              <Separator />
              <CardFooter className="py-3 px-4">
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {todos.length} completed
                </p>
                <div className="ml-auto h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%` }}
                  />
                </div>
              </CardFooter>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground/60">
          Data from{' '}
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            JSONPlaceholder
          </a>
        </p>
      </div>
    </div>
  )
}

interface TodoItemProps {
  todo: Todo
  index: number
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, title: string) => void
}

function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(todo.title)
  const [isSaving, setIsSaving] = React.useState(false)

  async function handleEditSave() {
    const title = editValue.trim()
    if (!title || title === todo.title) { setIsEditing(false); setEditValue(todo.title); return }
    setIsSaving(true)
    try {
      await fetch(`${API}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      onUpdate(todo.id, title)
      setIsEditing(false)
    } catch {
      setEditValue(todo.title)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <li className={cn(
      'group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30',
      todo.completed && 'opacity-60'
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo)}
        className="shrink-0"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave()
              if (e.key === 'Escape') { setEditValue(todo.title); setIsEditing(false) }
            }}
            disabled={isSaving}
            className="w-full text-sm bg-transparent border-b border-primary outline-none pb-px"
          />
        ) : (
          <span
            className={cn(
              'text-sm truncate block cursor-text select-none',
              todo.completed && 'line-through text-muted-foreground'
            )}
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
            title={todo.completed ? undefined : 'Double-click to edit'}
          >
            {todo.title}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="shrink-0 h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
      >
        <Trash2Icon className="w-3.5 h-3.5" />
      </Button>
    </li>
  )
}
