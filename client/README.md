# React Frontend Client 2025

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-teal?logo=tailwindcss" alt="Tailwind CSS" />
</p>

A cutting-edge React frontend application showcasing modern development practices with TypeScript, advanced state management, and real-time capabilities. Built for 2025 with the latest React 19 features and best-in-class developer experience.

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with automatic token refresh
- Secure login, registration, and logout flows
- Protected routes with authentication guards
- Profile management with avatar uploads
- Persistent authentication state

### 📝 **Todo Management**
- Full CRUD operations with optimistic updates
- Advanced filtering (all, initial, in-progress, completed, cancelled)
- Real-time synchronization across browser tabs
- Drag-and-drop reordering (coming soon)
- Bulk operations and batch updates

### 💬 **Real-time Chat**
- WebSocket-based instant messaging
- Multiple chat rooms support
- Emoji picker integration
- File sharing capabilities
- Message history and notifications

### 🎨 **Modern UI/UX**
- Responsive design with mobile-first approach
- Dark/light theme support with system preference detection
- Accessible components following WCAG guidelines
- Smooth animations and micro-interactions
- Loading states and error boundaries

### 🚀 **Performance & Developer Experience**
- Automatic code splitting and lazy loading
- Optimistic UI updates for instant feedback
- Background data synchronization
- Comprehensive error handling
- Hot module replacement for fast development

## 🛠️ Technology Stack

### **Core Framework**
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Advanced type safety and IntelliSense
- **Vite 6.0** - Lightning-fast build tool and dev server

### **Routing & State Management**
- **TanStack Router** - Type-safe routing with search params
- **TanStack Query** - Powerful server state management
- **Zustand** - Lightweight client state management
- **React Hook Form** - Performant form handling

### **Styling & UI**
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, customizable icons
- **next-themes** - Theme switching with system preference

### **Development & Testing**
- **Vitest** - Fast unit testing framework
- **Testing Library** - Simple and complete testing utilities
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript strict mode** - Maximum type safety

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Package Manager**: Bun (recommended), npm, or yarn
- **Backend Server**: Running on `http://localhost:3000`

### Quick Setup

1. **Install dependencies**:
```bash
# Using Bun (recommended)
bun install

# Using npm
npm install

# Using yarn
yarn install
```

2. **Environment configuration**:
```bash
# Copy environment template
cp .env.example .env
```

3. **Configure environment variables**:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000

# Application Settings
VITE_APP_NAME=React Todo & Chat App
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern React application with real-time features

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

4. **Start development server**:
```bash
# Using Bun
bun run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

5. **Access the application**:
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/api-docs

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
