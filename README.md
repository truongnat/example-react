# TanStack Todo App

A full-stack Todo app built with TanStack Start (new API), Tailwind CSS v4, and in-memory storage.

## Stack

- **TanStack Start** (`@tanstack/react-start`) — full-stack React framework
- **Vite** — bundler
- **Nitro** — server engine (Vercel preset)
- **Tailwind CSS v4** — styling
- **TypeScript** — type safety

## Features

- ✅ Add, toggle, inline-edit (double-click), delete todos
- 🔍 Filter: All / Active / Completed
- 🧹 Clear completed
- 🚀 SSR with TanStack Router
- ⚡ API routes at `/api/todos`

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Configured for Vercel via Nitro `vercel` preset.

> Note: In-memory storage resets on serverless cold starts.
