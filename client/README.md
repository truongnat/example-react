# Todo App Client

A modern React client application built with TypeScript, TanStack Router, TanStack Query, Zustand, and TailwindCSS.

## Features

- 🔐 **Authentication**: Login, register, logout with JWT tokens
- 📝 **Todo Management**: Create, read, update, delete todos
- 🔄 **Real-time Updates**: Optimistic updates with TanStack Query
- 📱 **Responsive Design**: Mobile-first design with TailwindCSS
- 🎨 **Modern UI**: shadcn/ui components
- 🚀 **Performance**: Automatic caching and background refetching
- 🛡️ **Type Safety**: Full TypeScript support

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Zod** - Schema validation
- **Vite** - Build tool
- **Bun** - Package manager

## Getting Started

### Prerequisites

- Bun (latest version)
- Node.js 18+
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
bun install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Todo App
VITE_APP_VERSION=1.0.0
```

4. Start the development server:
```bash
bun run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation
│   └── AuthRequired.tsx # Auth guard component
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hooks
│   └── useTodos.ts     # Todo management hooks
├── lib/                # Utility libraries
│   ├── config.ts       # App configuration
│   ├── http-client.ts  # HTTP client with interceptors
│   ├── query-client.ts # TanStack Query configuration
│   ├── error-handler.ts # Global error handling
│   └── utils.ts        # Utility functions
├── routes/             # Page components
│   ├── index.tsx       # Home page
│   ├── login.tsx       # Login page
│   ├── register.tsx    # Register page
│   ├── todo.tsx        # Todo management
│   └── profile.tsx     # User profile
├── services/           # API services
│   ├── auth.service.ts # Authentication API
│   └── todo.service.ts # Todo API
├── stores/             # Zustand stores
│   └── authStore.ts    # Authentication state
├── types/              # TypeScript types
│   └── api.ts          # API types and DTOs
└── main.tsx           # App entry point
```

## API Integration

The client integrates with a TypeScript backend using clean architecture. Key features:

- **Automatic Token Refresh**: JWT tokens are automatically refreshed
- **Error Handling**: Global error handling with user-friendly messages
- **Optimistic Updates**: UI updates immediately for better UX
- **Caching**: Smart caching with TanStack Query
- **Type Safety**: Full type safety with backend DTOs

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run tests
- `bun run test:ci` - Run tests in CI mode

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Todo App` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## Authentication Flow

1. User logs in with email/password
2. Backend returns JWT access token and refresh token
3. Tokens are stored in localStorage via Zustand persist
4. HTTP client automatically adds Authorization header
5. On 401 errors, client attempts token refresh
6. If refresh fails, user is redirected to login

## Todo Features

- ✅ Create new todos with title and description
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Filter by status (all, initial, in progress, completed, cancelled)
- ✅ Sort by date, title, or status
- ✅ Real-time updates with optimistic UI
- ✅ Form validation with character limits
- ✅ Loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License
