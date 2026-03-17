export interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

// In-memory store — resets on cold start / new serverless instance
export const store = {
  todos: [
    {
      id: 1,
      title: 'Learn TanStack Start',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Deploy to Vercel',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Build something awesome',
      completed: true,
      createdAt: new Date().toISOString(),
    },
  ] as Todo[],
  nextId: 4,
}
