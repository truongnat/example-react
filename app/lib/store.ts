export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

// Module-level in-memory store
// On Vercel, this persists within a warm function instance
export const store = {
  todos: [
    { id: 1, title: 'Learn TanStack Start', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Deploy to Vercel', completed: false, createdAt: new Date().toISOString() },
    { id: 3, title: 'Build something awesome', completed: true, createdAt: new Date().toISOString() },
  ] as Todo[],
  nextId: 4,
}
