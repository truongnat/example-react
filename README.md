# TanStack Full Demo

A beginner-friendly dashboard demonstrating all major TanStack libraries working together.

🔗 **Live Demo:** https://example-react-af6p083fg-truongdqdev-9126s-projects.vercel.app

## TanStack Libraries

| Library | Usage |
|---------|-------|
| `@tanstack/react-router` | File-based routing, type-safe navigation |
| `@tanstack/react-query` | Data fetching, caching, `useQuery` + `useMutation` |
| `@tanstack/react-table` | Headless table with sort, filter, pagination |
| `@tanstack/react-virtual` | Virtualized list for 100+ rows |
| `@tanstack/react-form` | Form state management with validation |
| `@tanstack/store` | Global UI state (active tab, view mode, search) |

## Pages

- **/** — Home dashboard with library overview
- **/todos** — Query + Form + Store: fetch todos, add with form validation, global search
- **/posts** — Query + Table + Virtual: sort/filter table OR virtual list view (toggle)
- **/users** — Query + Table + Form: sortable table, inline edit via dialog form

## Stack

- TanStack Start (`@tanstack/react-start`) + Vite + Nitro
- shadcn/ui + Tailwind CSS v4 + Radix UI
- JSONPlaceholder API (mock data)
- TypeScript + Vercel deployment

## Run locally

```bash
npm install && npm run dev
```
