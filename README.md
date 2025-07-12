
# MERN Stack Monorepo

<p align="center">
  <img src="./client/public/logo-mern.png" width="320" alt="MERN Stack Logo" />
</p>

<p align="center">Modern MERN Stack application with TypeScript</p>

## Description

A full-stack MERN application featuring a React frontend and Express.js backend with clean architecture.

**Tech Stack:**
- **Frontend**: React 19 + TypeScript + Vite + TanStack Router + TailwindCSS
- **Backend**: Node.js + Express + TypeScript + SQLite + TypeORM
- **Package Manager**: Bun for fast dependency management
- **Testing**: Jest + Vitest
- **Deployment**: Docker + Docker Compose

## Features

### Authentication System
- ✅ User registration and login
- ✅ JWT-based authentication with refresh tokens
- ✅ Password recovery and email verification
- ✅ Profile management (username, avatar updates)

### Todo Management
- ✅ Full CRUD operations for todos
- ✅ Status management (Initial, In Progress, Completed, Cancelled)
- ✅ Inline editing with validation
- ✅ Real-time updates with optimistic UI

### Technical Features
- ✅ Server-Side Rendering (SSR)
- ✅ Real-time chat with WebSocket
- ✅ API documentation with Swagger
- ✅ Full TypeScript implementation
- ✅ Comprehensive test coverage

## Prerequisites

- **Node.js** >= 18.0.0
- **Bun** package manager ([Install Bun](https://bun.sh/))
- **Git** for version control

## 🚀 Quick Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd example-react

# 2. Install dependencies
bun run setup

# 3. Create environment file
cat > server-ts/.env << EOF
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
DATABASE_URL=sqlite:./data/database.sqlite
EOF

# 4. Start development
bun run dev
```

## Project Structure

```
example-react/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── routes/         # Page routing
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── stores/         # State management
│   └── package.json
├── server-ts/              # Express backend
│   ├── src/
│   │   ├── application/    # Use cases
│   │   ├── domain/         # Entities
│   │   ├── infrastructure/ # Database
│   │   └── presentation/   # Controllers
│   └── package.json
├── scripts/                # Build scripts
└── package.json           # Root workspace
```

## Development

### Start Development Servers
```bash
bun run dev
```
- Client: http://localhost:5173
- Server: http://localhost:3000

### Run Tests
```bash
bun run test
```

### Build for Production
```bash
bun run build
```

### Start Production Server
```bash
bun run start
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Setup** | `bun run setup` | Install all dependencies |
| **Development** | `bun run dev` | Start development servers |
| **Test** | `bun run test` | Run all tests |
| **Build** | `bun run build` | Build for production |
| **Start** | `bun run start` | Start production server |
| **Deploy** | `bun run deploy` | Build and test for deployment |
| **Clean** | `bun run clean` | Clean build artifacts |

## API Documentation

When the server is running:
- **API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

**Todos:**
- `GET /api/todos` - Get todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

**Chat:**
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/rooms` - Create room
- WebSocket for real-time messaging

## Testing

```bash
# Run all tests
bun run test

# Individual package tests
cd client && bun run test
cd server-ts && bun run test

# Watch mode
cd client && bun run test --watch
cd server-ts && bun run test:watch
```

## Technology Stack

**Frontend:**
- React 19 + TypeScript
- TanStack Router + Query
- Zustand (state management)
- Tailwind CSS + shadcn/ui
- Vite (build tool)

**Backend:**
- Node.js + Express + TypeScript
- SQLite + TypeORM
- JWT authentication
- Socket.io (real-time)
- Swagger (API docs)

## Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up --build
```

### Manual Deployment
```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Use conventional commits

## License

This project is licensed under the MIT License.

## Support

If you find this project helpful, please give it a ⭐ on GitHub!

For questions or support, please open an issue.
