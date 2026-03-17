# ✅ TanStack Todo App

A modern full-stack Todo app built with TanStack Start, shadcn/ui, and Tailwind CSS v4.

🔗 **Live Demo:** https://example-react-af6p083fg-truongdqdev-9126s-projects.vercel.app

## Stack

- **[TanStack Start](https://tanstack.com/start)** — full-stack React framework (SSR)
- **[Vite](https://vitejs.dev)** + **[Nitro](https://nitro.build)** — bundler & server engine
- **[shadcn/ui](https://ui.shadcn.com)** — accessible UI components (Radix UI + CVA)
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling
- **[Lucide React](https://lucide.dev)** — icons
- **[JSONPlaceholder](https://jsonplaceholder.typicode.com)** — mock REST API
- **TypeScript** — type safety throughout

## Features

- ✅ Add, toggle complete, inline-edit (double-click), delete todos
- 🔍 Filter: All / Active / Done
- 📊 Progress bar showing completion ratio
- 🧹 Clear all completed at once
- ⚡ Optimistic UI — instant feedback without waiting for API
- 🚀 SSR with TanStack Router
- 🎨 Beautiful violet/indigo design system

## Getting Started

```bash
git clone https://github.com/truongnat/example-react
cd example-react
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   └── ui/          # shadcn/ui components (Button, Card, Input, Badge, ...)
├── lib/
│   ├── store.ts     # (unused — data from JSONPlaceholder)
│   └── utils.ts     # cn() helper
├── routes/
│   ├── __root.tsx   # Root layout (html/head/body)
│   ├── index.tsx    # Todo page
│   └── api/         # API routes
├── styles/
│   └── app.css      # Tailwind v4 + shadcn CSS variables
└── router.tsx       # Router config
```

## Deploy

Configured for Vercel via Nitro `vercel` preset — just connect the repo on [vercel.com](https://vercel.com).

> Note: JSONPlaceholder is a read-only fake API — mutations return correct responses but data resets on reload.
