import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { store } from '~/lib/store'

export const APIRoute = createAPIFileRoute('/api/todos')({
  GET: async () => {
    const sorted = [...store.todos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return json(sorted)
  },
  POST: async ({ request }) => {
    const body = await request.json() as { title: string }
    const todo = {
      id: store.nextId++,
      title: body.title,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    store.todos.push(todo)
    return json(todo, { status: 201 })
  },
})
