import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { store } from '../lib/store'

export const APIRoute = createAPIFileRoute('/api/todos/$id')({
  PATCH: async ({ params, request }) => {
    const id = Number(params.id)
    const body = await request.json() as Partial<{ title: string; completed: boolean }>
    const idx = store.todos.findIndex((t) => t.id === id)
    if (idx === -1) return json({ error: 'Not found' }, { status: 404 })
    store.todos[idx] = { ...store.todos[idx], ...body }
    return json(store.todos[idx])
  },
  DELETE: async ({ params }) => {
    const id = Number(params.id)
    const idx = store.todos.findIndex((t) => t.id === id)
    if (idx === -1) return json({ error: 'Not found' }, { status: 404 })
    store.todos.splice(idx, 1)
    return json({})
  },
})
