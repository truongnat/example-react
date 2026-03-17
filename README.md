# TanStack Start + json-server Todo App

A full-featured Todo application built with **TanStack Start** (full-stack React framework) and **json-server** as a mock REST API backend.

## ✨ Features

- ✅ Full CRUD: Create, Read, Update (toggle), Delete todos
- 🔍 Filter by All / Active / Completed
- ✏️ Inline editing (double-click a todo title to edit)
- 🗑️ Clear all completed at once
- 🎨 Beautiful UI with Tailwind CSS v4
- ⚡ SSR with TanStack Start (Vinxi)
- 🔄 Auto-refresh after mutations via `router.invalidate()`

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Bundler | [Vinxi](https://vinxi.vercel.app/) |
| API | [json-server](https://github.com/typicode/json-server) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | TypeScript |
| Runtime | Node.js |

## 📁 Project Structure

```
├── app/
│   ├── routes/
│   │   ├── __root.tsx       # Root layout (html/head/body)
│   │   └── index.tsx        # Main todo page with full CRUD
│   ├── styles.css           # Tailwind v4 entry
│   ├── client.tsx           # Client-side hydration entry
│   ├── router.tsx           # Router configuration
│   └── ssr.tsx              # SSR handler
├── db.json                  # json-server database (todos)
├── db-server.js             # Starts json-server on port 3001
├── app.config.ts            # TanStack Start / Vinxi config
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm / yarn

### Installation

```bash
npm install
```

### Development

Start both the json-server API and the TanStack Start dev server together:

```bash
npm run dev
```

This uses `concurrently` to run:
- **json-server** on `http://localhost:3001` (REST API)
- **Vinxi dev server** on `http://localhost:3000` (React app)

### Run only the API

```bash
npm run db
```

### Production Build

```bash
npm run build
npm run start
```

## 📡 API Endpoints

json-server provides a full REST API from `db.json`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/todos` | Get all todos |
| `POST` | `/todos` | Create a new todo |
| `PATCH` | `/todos/:id` | Update a todo (toggle/edit) |
| `DELETE` | `/todos/:id` | Delete a todo |

### Todo Shape

```typescript
interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string  // ISO 8601 date string
}
```

### Example API calls

```bash
# Get all todos
curl http://localhost:3001/todos

# Create a todo
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","completed":false,"createdAt":"2026-01-01T00:00:00.000Z"}'

# Toggle a todo
curl -X PATCH http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3001/todos/1
```

## 🎨 UI Features

- **Add todo**: Type in the input and press Enter or click "Add"
- **Complete todo**: Click the circle checkbox on the left
- **Edit todo**: Double-click the title text (only for incomplete todos)
- **Delete todo**: Hover over a todo and click the trash icon
- **Filter**: Use All / Active / Completed tabs
- **Clear completed**: Button appears when there are completed todos

## 📝 Notes

- Data is persisted in `db.json` — changes survive server restarts
- The TanStack Start loader fetches todos server-side on navigation
- After mutations, `router.invalidate()` triggers a fresh loader fetch
- json-server v0.17.x uses CommonJS; `db-server.js` uses ESM via `"type": "module"` with the `json-server` default export

## License

MIT
