# TanStack Full Demo

A beginner-friendly dashboard showcasing all major TanStack libraries working together in a real app.

🔗 **Live Demo:** https://example-react-6mhff4sbg-truongdqdev-9126s-projects.vercel.app

## TanStack Libraries Used

| Library | Version | Usage |
|---------|---------|-------|
| `@tanstack/react-router` | ^1.167.4 | File-based routing, type-safe navigation, SSR |
| `@tanstack/react-query` | ^5.90.21 | Data fetching, caching, `useQuery` + `useMutation` |
| `@tanstack/react-table` | ^8.21.3 | Headless table — sort, filter, pagination |
| `@tanstack/react-virtual` | ^3.13.23 | Virtualized list for large datasets |
| `@tanstack/react-form` | ^1.28.5 | Form state management with validation |
| `@tanstack/react-store` | ^0.9.2 | Global UI state (tab, view mode, search) |
| `@tanstack/react-start` | ^1.166.15 | Full-stack React framework (SSR) |

## Pages

### 🟣 `/todos` — Query + Form + Store
- `useQuery` to fetch todos with automatic caching
- `useMutation` for add / toggle / delete with **optimistic updates** (UI updates instantly, reverts on error)
- `useForm` with field-level validation (required field)
- `@tanstack/store` for global search state shared across components

### 🔵 `/posts` — Query + Table + Virtual
- `useQuery` fetches all 100 posts once, cached for 10 minutes
- `useReactTable` with sorting (click headers), global filter, and pagination
- Toggle to **Virtual List** mode — `useVirtualizer` renders only visible rows in DOM (~5-10 rows), not all 100

### 🟢 `/users` — Query + Table + Form
- Sortable, filterable table of 10 users
- Click ✏️ to open edit dialog
- `useForm` inside dialog with per-field validation
- `useMutation` patches user with optimistic update

## Key Concepts Demonstrated

- **Optimistic Updates** — UI reflects changes immediately without waiting for API
- **Cache Invalidation** — mutations cancel in-flight queries and update cache directly
- **SSR-safe hooks** — `useStore` with explicit selectors, `QueryClient` created per-request on server
- **Virtualization** — 100 rows in DOM = ~10 elements vs 100 with normal rendering
- **Headless UI** — TanStack Table/Form/Virtual are logic-only, you own the markup

## Tech Stack

- **[TanStack Start](https://tanstack.com/start)** (`@tanstack/react-start`) — SSR framework
- **[Vite](https://vitejs.dev)** + **[Nitro](https://nitro.build)** — bundler & server (Vercel preset)
- **[shadcn/ui](https://ui.shadcn.com)** — Radix UI + CVA components (Button, Card, Input, Badge, Dialog, Checkbox...)
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling with `@theme` CSS variables
- **[Lucide React](https://lucide.dev)** — icons
- **[JSONPlaceholder](https://jsonplaceholder.typicode.com)** — free fake REST API (todos, posts, users)
- **TypeScript** throughout

## Project Structure

```
src/
├── components/
│   └── ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── separator.tsx
├── lib/
│   └── utils.ts          # cn() helper (clsx + tailwind-merge)
├── store/
│   └── index.ts          # @tanstack/store global state
├── routes/
│   ├── __root.tsx        # Root layout (QueryClientProvider, Header, Outlet)
│   ├── index.tsx         # Home dashboard
│   ├── todos.tsx         # Query + Form + Store demo
│   ├── posts.tsx         # Table + Virtual demo
│   └── users.tsx         # Table + Form + Mutation demo
├── styles/
│   └── app.css           # Tailwind v4 + shadcn CSS variables
├── router.tsx            # createRouter config
└── routeTree.gen.ts      # Route tree (manually maintained)
```

## Getting Started

```bash
git clone https://github.com/truongnat/example-react
cd example-react
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

Pre-configured for Vercel — just connect the repo on [vercel.com](https://vercel.com), no extra settings needed.

Uses Nitro `vercel` preset which outputs to `.vercel/output/` format automatically.

> **Note:** JSONPlaceholder is a read-only fake API. Mutations (add/edit/delete) return correct responses but data resets on page reload.
