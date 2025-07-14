
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
