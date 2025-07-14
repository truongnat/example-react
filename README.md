
# MERN Stack Monorepo 2025

<p align="center">
  <img src="./client/public/logo-mern.png" width="320" alt="MERN Stack Logo" />
</p>

<p align="center">
  <strong>Modern Full-Stack Application with TypeScript, Clean Architecture & Real-time Features</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.18-lightgrey?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License" />
</p>

## 🚀 Overview

A production-ready MERN stack monorepo featuring modern development practices, clean architecture, and comprehensive tooling. Built with TypeScript throughout, this project demonstrates best practices for full-stack development in 2025.

### ✨ Key Features

**🔐 Authentication & Security**
- JWT-based authentication with refresh tokens
- Password recovery and email verification
- Profile management with avatar uploads
- Rate limiting and security middleware

**📝 Todo Management**
- Full CRUD operations with real-time updates
- Advanced filtering and sorting
- Status management (initial, in-progress, completed, cancelled)
- Optimistic UI updates

**💬 Real-time Chat**
- WebSocket-based messaging with Socket.io
- Multiple chat rooms support
- Emoji support and file sharing
- Message history and real-time notifications

**🏗️ Architecture & Development**
- Clean Architecture principles
- Monorepo structure with shared tooling
- Comprehensive testing suite
- Docker containerization
- Cross-platform development scripts

## 🛠️ Technology Stack

**Frontend (Client)**
- **React 19** with TypeScript
- **TanStack Router** for type-safe routing
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Tailwind CSS** + **shadcn/ui** for styling
- **Vite** for fast development and building

**Backend (Server)**
- **Node.js** + **Express** with TypeScript
- **Clean Architecture** with dependency injection
- **Multiple Database Support** (SQLite, PostgreSQL, Supabase, MongoDB)
- **Socket.io** for real-time communication
- **Swagger/OpenAPI** for API documentation
- **Jest** for comprehensive testing

**DevOps & Tooling**
- **Docker** & **Docker Compose** for containerization
- **Cross-platform JavaScript scripts** for development
- **ESLint** + **Prettier** for code quality
- **GitHub Actions** ready CI/CD setup

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **Package Manager**: Bun (recommended), npm, or yarn
- **Git** for version control
- **Docker** (optional, for containerized development)

## 🚀 Quick Start

### 1. Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd example-react

# Install all dependencies
npm run setup
# or with bun
bun run setup
```

### 2. Environment Configuration
```bash
# Create server environment file
cat > server-ts/.env << EOF
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2025
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-2025
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/database.sqlite
CORS_ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000
EOF
```

### 3. Start Development
```bash
# Start both client and server
npm run dev
# or with bun
bun run dev
```

**Access Points:**
- 🌐 **Client**: http://localhost:5173
- 🔧 **Server**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/api-docs
- 🏥 **Health Check**: http://localhost:3000/health

## 📁 Project Structure

```
example-react/
├── 📱 client/                    # React Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── Navigation.tsx   # Main navigation
│   │   │   └── AuthRequired.tsx # Auth guard component
│   │   ├── routes/              # Page components & routing
│   │   │   ├── index.tsx        # Home page
│   │   │   ├── login.tsx        # Authentication pages
│   │   │   ├── todo.tsx         # Todo management
│   │   │   ├── chat.tsx         # Real-time chat
│   │   │   └── profile.tsx      # User profile
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer
│   │   ├── stores/              # Zustand state stores
│   │   ├── lib/                 # Utility libraries
│   │   └── types/               # TypeScript definitions
│   ├── public/                  # Static assets
│   ├── tests/                   # Frontend tests
│   └── package.json
├── 🔧 server-ts/                # Express Backend (Clean Architecture)
│   ├── src/
│   │   ├── domain/              # Business Logic & Entities
│   │   │   ├── entities/        # Domain entities
│   │   │   ├── repositories/    # Repository interfaces
│   │   │   └── services/        # Domain services
│   │   ├── application/         # Application Business Rules
│   │   │   ├── use-cases/       # Application use cases
│   │   │   ├── dtos/            # Data transfer objects
│   │   │   └── interfaces/      # Application interfaces
│   │   ├── infrastructure/      # External Concerns
│   │   │   ├── database/        # Database implementations
│   │   │   ├── repositories/    # Repository implementations
│   │   │   ├── external-services/ # External services
│   │   │   └── config/          # Configuration
│   │   ├── presentation/        # Controllers & Routes
│   │   │   ├── controllers/     # HTTP controllers
│   │   │   ├── routes/          # Route definitions
│   │   │   ├── middleware/      # Presentation middleware
│   │   │   └── validators/      # Request validators
│   │   └── shared/              # Shared utilities
│   ├── tests/                   # Backend tests
│   │   ├── unit/                # Unit tests
│   │   ├── integration/         # Integration tests
│   │   └── e2e/                 # End-to-end tests
│   ├── data/                    # Database files (SQLite)
│   ├── uploads/                 # File uploads
│   └── package.json
├── 🛠️ scripts/                  # Cross-platform build scripts
│   ├── install.js               # Dependency installation
│   ├── dev.js                   # Development server
│   ├── test.js                  # Test runner
│   ├── build.js                 # Production build
│   ├── deploy.js                # Deployment pipeline
│   ├── clean.js                 # Cleanup utilities
│   └── package-manager.js       # Package manager switching
├── 🐳 Docker files              # Containerization
│   ├── Dockerfile               # Multi-stage Docker build
│   ├── docker-compose.dev.yml   # Development environment
│   ├── docker-compose.prod.yml  # Production environment
│   └── docker-compose.test.yml  # Testing environment
└── 📄 Configuration files
    ├── package.json             # Root workspace configuration
    ├── nginx.conf               # Nginx configuration
    └── Makefile                 # Make commands
```

## 🚀 Development Workflow

### Essential Commands

```bash
# 🔧 Setup & Installation
npm run setup                    # Install all dependencies
npm run pm:switch bun           # Switch to Bun package manager

# 🚀 Development
npm run dev                     # Start both client & server
npm run test                    # Run all tests
npm run test:watch             # Run tests in watch mode

# 🏗️ Production
npm run build                   # Build for production
npm run start                   # Start production server
npm run deploy                  # Full deployment pipeline

# 🧹 Maintenance
npm run clean                   # Clean build artifacts
npm run seed                    # Seed demo data
npm run seed:force             # Force seed with fresh data
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **🔧 Setup** | `npm run setup` | Install dependencies for all packages |
| **🚀 Development** | `npm run dev` | Start development servers concurrently |
| **🧪 Testing** | `npm run test` | Run comprehensive test suite |
| **🏗️ Build** | `npm run build` | Build all packages for production |
| **▶️ Start** | `npm run start` | Start production server |
| **🚀 Deploy** | `npm run deploy` | Complete deployment pipeline |
| **🧹 Clean** | `npm run clean` | Remove build artifacts and caches |
| **📦 Package Manager** | `npm run pm:switch <manager>` | Switch between npm/yarn/bun |
| **🌱 Seed Data** | `npm run seed` | Create demo data for development |

## 📚 API Documentation

### Interactive Documentation
When the server is running, access comprehensive API documentation:

- **📖 Swagger UI**: http://localhost:3000/api-docs
- **🔍 OpenAPI Spec**: http://localhost:3000/api-docs/swagger.json
- **🏥 Health Check**: http://localhost:3000/health
- **ℹ️ API Info**: http://localhost:3000/api

### 🔑 Key API Endpoints

**Authentication & User Management**
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user profile
PUT    /api/auth/profile      # Update user profile
POST   /api/auth/upload       # Upload profile avatar
```

**Todo Management**
```
GET    /api/todos             # Get todos (with filtering & pagination)
POST   /api/todos             # Create new todo
GET    /api/todos/:id         # Get specific todo
PUT    /api/todos/:id         # Update todo
DELETE /api/todos/:id         # Delete todo
```

**Real-time Chat**
```
GET    /api/chat/rooms        # Get available chat rooms
POST   /api/chat/rooms        # Create new chat room
GET    /api/chat/rooms/:id    # Get room details
WebSocket /socket.io          # Real-time messaging
```

## 🧪 Testing Strategy

### Comprehensive Test Suite
```bash
# Run all tests across the monorepo
npm run test

# Individual package testing
cd client && npm run test        # Frontend tests
cd server-ts && npm run test     # Backend tests

# Watch mode for development
cd client && npm run test:watch
cd server-ts && npm run test:watch

# Coverage reports
cd client && npm run test:coverage
cd server-ts && npm run test:coverage
```

### Test Types
- **Unit Tests**: Individual component/function testing
- **Integration Tests**: API endpoint and database testing
- **E2E Tests**: Full user workflow testing
- **Component Tests**: React component testing with Testing Library

## 🐳 Deployment Options

### 1. Docker Deployment (Recommended)

**Development Environment**
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

**Production Environment**
```bash
# Build and deploy production environment
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

**Testing Environment**
```bash
# Run tests in containerized environment
docker-compose -f docker-compose.test.yml up --build
```

### 2. Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start

# Or use PM2 for process management
pm2 start ecosystem.config.js
```

### 3. Cloud Deployment

**Frontend (Vercel/Netlify)**
- Build command: `npm run build`
- Output directory: `client/dist`
- Environment variables: Set `VITE_API_BASE_URL`

**Backend (Railway/Render/Heroku)**
- Build command: `cd server-ts && npm run build`
- Start command: `cd server-ts && npm run start`
- Environment variables: Configure database and JWT secrets

## Requirements docs:

- Docs for concept React JS.
- What is [JSX](https://reactjs.org/docs/introducing-jsx.html) ?
- How [rendering](https://reactjs.org/docs/rendering-elements.html)  with React ?
- How to create [Component React and Props](https://reactjs.org/docs/components-and-props.html) ?
- [React State ? LifeCycle ?](https://reactjs.org/docs/state-and-lifecycle.html)
- How to [handle event](https://reactjs.org/docs/handling-events.html) React JS ?
- [Condition Rendering ?](https://reactjs.org/docs/conditional-rendering.html)
- [Lists and Keys?](https://reactjs.org/docs/lists-and-keys.html)
- Difference between Class Component and Functional Components. ( [Link docs](https://reactjs.org/docs/react-component.html#render) | [Link dev](https://dev.to/mehmehmehlol/class-components-vs-functional-components-in-react-4hd3) )
- State management with [redux](https://redux.js.org/)
- Middleware for client [redux saga](https://redux-saga.js.org/)
- Config and structure project - see more [github](#github).

## Running the app
*We are split two folder: client and server*

`Run only client`

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

$ npm run start:dev | yarn start:dev

# production mode

$ npm run start | yarn start


```

## Run SSR

*Run script in root folder*

```bash

# bash script

$ ./ssr.sh

```

## Github


[GitHub - truongdq2001/example-react](https://github.com/truongnat/example-react)

## Stay in touch


- Author - [Peanut201](https://www.facebook.com/truongdq2001/)

- Website - [Portfolio](https://portfolio-peanut.netlify.app/)

- Twitter - [@Peanut201](https://twitter.com/truong20013)

- Telegram - [@Peanut201](https://t.me/peanut201)

## License

This project is licensed under the MIT License.

## Support

If you find this project helpful, please give it a ⭐ on GitHub!

For questions or support, please open an issue.
