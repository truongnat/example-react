import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useForm } from '@tanstack/react-form'
import * as React from 'react'
import { PlusIcon, Trash2Icon, LoaderIcon, CheckSquareIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { appStore, setSearchQuery } from '~/store'
import { cn } from '~/lib/utils'

const API = 'https://jsonplaceholder.typicode.com'

interface Todo { id: number; userId: number; title: string; completed: boolean }

// ── TanStack Query: fetch todos ──────────────────────────────────────────────
const todosQuery = {
  queryKey: ['todos'],
  queryFn: async (): Promise<Todo[]> => {
    const res = await fetch(`${API}/todos?_limit=20`)
    return res.json()
  },
}

export const Route = createFileRoute('/todos')({
  loader: () => todosQuery,   // prefetch hint
  component: TodosPage,
})

type FilterType = 'all' | 'active' | 'completed'

function TodosPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = React.useState<FilterType>('all')
  // ── TanStack Store: global search ────────────────────────────────────────
  const { searchQuery } = useStore(appStore)

  // ── TanStack Query: useQuery ─────────────────────────────────────────────
  const { data: todos = [], isLoading, isError } = useQuery(todosQuery)

  // ── TanStack Query: useMutation (toggle) ─────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      await fetch(`${API}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      return todo
    },
    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const prev = queryClient.getQueryData<Todo[]>(['todos'])
      queryClient.setQueryData<Todo[]>(['todos'], old =>
        old?.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
      )
      return { prev }
    },
    onError: (_err, _todo, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos'], ctx.prev)
    },
  })

  // ── TanStack Query: useMutation (delete) ─────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API}/todos/${id}`, { method: 'DELETE' })
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const prev = queryClient.getQueryData<Todo[]>(['todos'])
      queryClient.setQueryData<Todo[]>(['todos'], old => old?.filter(t => t.id !== id))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos'], ctx.prev)
    },
  })

  // ── TanStack Query: useMutation (add) ────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(`${API}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false, userId: 1 }),
      })
      return res.json() as Promise<Todo>
    },
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const prev = queryClient.getQueryData<Todo[]>(['todos'])
      const optimistic: Todo = { id: Date.now(), userId: 1, title, completed: false }
      queryClient.setQueryData<Todo[]>(['todos'], old => [optimistic, ...(old ?? [])])
      return { prev }
    },
    onError: (_err, _title, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos'], ctx.prev)
    },
  })

  // ── TanStack Form ────────────────────────────────────────────────────────
  const form = useForm({
    defaultValues: { title: '' },
    onSubmit: async ({ value, formApi }) => {
      if (!value.title.trim()) return
      addMutation.mutate(value.title.trim())
      formApi.reset()
    },
  })

  const filtered = todos.filter(t => {
    const matchFilter = filter === 'all' || (filter === 'active' ? !t.completed : t.completed)
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFilter && matchSearch
  })

  const completedCount = todos.filter(t => t.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckSquareIcon className="w-6 h-6 text-primary" /> Todos
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="text-primary font-medium">@tanstack/react-query</span> · <span className="text-primary font-medium">@tanstack/react-form</span> · <span className="text-primary font-medium">@tanstack/store</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{activeCount} active</Badge>
          <Badge variant="success">{completedCount} done</Badge>
        </div>
      </div>

      {/* Add form — TanStack Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add Todo <Badge variant="outline" className="ml-2 font-mono text-xs">@tanstack/react-form</Badge></CardTitle>
          <CardDescription>useForm with validation and onSubmit</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="flex gap-2">
            <form.Field name="title" validators={{ onChange: ({ value }) => !value.trim() ? 'Title is required' : undefined }}>
              {(field) => (
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Add a new task..."
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={cn(field.state.meta.errors.length > 0 && field.state.meta.isTouched && 'border-destructive')}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">{field.state.meta.errors[0]?.toString()}</p>
                  )}
                </div>
              )}
            </form.Field>
            <Button type="submit" disabled={addMutation.isPending} className="shrink-0">
              {addMutation.isPending ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Todo list — TanStack Query */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Todo List <Badge variant="outline" className="ml-2 font-mono text-xs">@tanstack/react-query</Badge></CardTitle>
              <CardDescription>useQuery + useMutation with optimistic updates</CardDescription>
            </div>
            <div className="flex gap-1">
              {(['all','active','completed'] as FilterType[]).map(f => (
                <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(f)} className="h-7 px-2 text-xs capitalize">{f}</Button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <Input placeholder="Search todos... (TanStack Store)" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-xs" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <LoaderIcon className="w-4 h-4 animate-spin" /> Loading...
            </div>
          )}
          {isError && <div className="text-center py-8 text-destructive text-sm">Failed to load todos</div>}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No todos found</div>
          )}
          <ul className="divide-y">
            {filtered.map(todo => (
              <li key={todo.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleMutation.mutate(todo)}
                  disabled={toggleMutation.isPending}
                />
                <span className={cn('flex-1 text-sm', todo.completed && 'line-through text-muted-foreground')}>
                  {todo.title}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteMutation.mutate(todo.id)}>
                  <Trash2Icon className="w-3.5 h-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
        <Separator />
        <CardFooter className="py-3 px-4 gap-3">
          <span className="text-xs text-muted-foreground">{completedCount}/{todos.length} completed</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%` }} />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
