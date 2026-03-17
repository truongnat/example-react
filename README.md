# TanStack Todo App 🚀

> A beginner-friendly Todo App showcasing the full **TanStack** ecosystem with modern React patterns.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![TanStack](https://img.shields.io/badge/TanStack-FF4154?logo=react-query)](https://tanstack.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://peanut-example-react.vercel.app/)

## ✨ What's Inside

This project is designed to teach modern React development using the **TanStack** suite of libraries — the same tools used in production by thousands of companies.

| Library | Version | Purpose |
|---------|---------|---------|
| **TanStack Router** | v1 | File-based routing, type-safe navigation |
| **TanStack Query** | v5 | Server state management, caching, sync |
| **TanStack Form** | v1 | Form state management with validation |
| **Zustand** | v5 | Client state management |
| **React** | v19 | UI framework |
| **TypeScript** | v5 | Type safety |
| **Tailwind CSS** | v4 | Styling |
| **Vite** | v6 | Build tool |
| **Vitest** | v3 | Testing |

## 🎯 Features

- ✅ **CRUD Todo** — Create, Read, Update, Delete tasks
- 🔍 **Filter & Sort** — by status, date, title
- ⚡ **Optimistic Updates** — instant UI feedback
- 🔄 **Auto-sync** — background refetch & stale-while-revalidate
- 🧪 **Unit Tests** — with Vitest + Testing Library
- 🎨 **Responsive UI** — Radix UI + Tailwind CSS
- 🔐 **Auth** — JWT with Zustand persist

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/truongnat/example-react.git
cd example-react

# Install & run (uses custom script)
npm run setup
npm run dev
```

## 📁 Project Structure

```
client/src/
├── routes/          # TanStack Router — file-based routes
│   ├── __root.tsx   # Root layout
│   ├── index.tsx    # Home page
│   ├── todo.tsx     # Todo page
│   └── login.tsx    # Auth pages
├── hooks/           # TanStack Query hooks
│   └── useTodos.ts  # useQuery + useMutation for todos
├── stores/          # Zustand stores
│   └── authStore.ts # Auth state with persist
├── services/        # API service layer
│   └── todo.service.ts
└── components/      # Reusable UI components
```

## 🧠 Key Concepts Demonstrated

### TanStack Query — Server State
```tsx
// Fetch with caching & background sync
const { data, isLoading } = useQuery({
  queryKey: todoKeys.list(params),
  queryFn: () => todoService.getTodos(params),
  staleTime: 30 * 1000,
})

// Mutate with optimistic updates
const mutation = useMutation({
  mutationFn: todoService.createTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: todoKeys.all }),
})
```

### TanStack Router — Type-safe Routing
```tsx
// File: routes/todo.tsx
export const Route = createFileRoute('/todo')({
  beforeLoad: ({ context }) => {
    // Guard: redirect if not authenticated
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: TodoPage,
})
```

### Zustand — Client State
```tsx
const useAuthStore = create(persist(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
  }),
  { name: 'auth-storage' }
))
```

## 🧪 Testing

```bash
cd client && npm run test
```

## 📖 Learn More

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [React 19 Docs](https://react.dev)

## 🤝 Contributing

PRs welcome! See open issues for ideas.

## 📄 License

MIT © [Truong DQ](https://truongdq.com)
