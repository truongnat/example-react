
<p  align="center">

<a>

<img  src="./client/public/logo-mern.png"  width="320"  alt="Server API Logo" />

</a>

</p>

<p  align="center">Mern Stack.</p>


## Description

- Learning concept [ReactJS](https://reactjs.org/docs/getting-started.html) framework development by Facebook.

- Learning ecosystem for ReactJS, example : [react-router-dom](https://reactrouter.com/web/guides/quick-start), [redux](https://redux.js.org/), [Chakra UI](https://chakra-ui.com/).

- Implement project example with [CRA](https://create-react-app.dev/).

- Build project and implement with SPA or SSR.

- Deploy source to hosting.



## Features

### Authentication System
- ✅ **Sign in/Sign up** - Complete user authentication
- ✅ **Auto remember login** - Persistent sessions with JWT tokens
- ✅ **Forgot password** - Password recovery via email
- ✅ **Email verification** - OTP verification system
- ✅ **Profile management** - Update username, avatar, and profile information
- ✅ **Password management** - Change password functionality

### Todo Management
- ✅ **CRUD operations** - Create, read, update, delete todos
- ✅ **Quick status updates** - Dropdown select for todo status (Initial, In Progress, Completed, Cancelled)
- ✅ **Inline editing** - Click-to-edit todo titles with validation
- ✅ **Real-time updates** - Instant UI updates with optimistic updates
- ✅ **Filtering & sorting** - Filter by status and sort by various criteria

### User Interface
- ✅ **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- ✅ **Responsive design** - Mobile-friendly interface
- ✅ **Loading states** - Proper loading indicators and error handling
- ✅ **Form validation** - Client-side and server-side validation

### Technical Features
- ✅ **Server-Side Rendering (SSR)** - Full SSR implementation with Express.js
- ✅ **Real-time chat** - WebSocket-based chat system
- ✅ **API documentation** - Swagger/OpenAPI documentation
- ✅ **Type safety** - Full TypeScript implementation
- ✅ **Testing** - Unit tests for both frontend and backend

### Coming Soon
- 🔄 **Search friends** - Find and connect with other users
- 🔄 **Friend requests** - Send and manage friend requests
- 🔄 **Advanced chat features** - File sharing, message reactions

## Prerequisites

- **Node.js** >= 18.0.0 ([Download Node.js](https://nodejs.org/en/))
- **Bun** package manager ([Install Bun](https://bun.sh/))
- **Git** for version control
- **IDE**: [Visual Studio Code](https://code.visualstudio.com/) (recommended) or [WebStorm](https://www.jetbrains.com/webstorm/)

## Project Structure

```
example-react/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── routes/         # Page components and routing
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── stores/         # State management (Zustand)
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── server-ts/              # Node.js backend API
│   ├── src/
│   │   ├── application/    # Use cases and DTOs
│   │   ├── domain/         # Domain entities and repositories
│   │   ├── infrastructure/ # Database and external services
│   │   ├── presentation/   # Controllers and routes
│   │   └── shared/         # Shared utilities and types
│   └── package.json
└── package.json           # Root package.json for workspace
```



## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd example-react
```

### 2. Install dependencies
```bash
# Install all dependencies (root, client, and server)
bun install
```

### 3. Environment Setup

**Server Environment:**
```bash
cd server-ts
cp .env.example .env
# Edit .env file with your configuration
```

**Client Environment:**
```bash
cd client
cp .env.example .env
# Edit .env file with your API URL
```

### 4. Development Mode

**Option A: Run both client and server concurrently**
```bash
# From root directory
bun run dev
```

**Option B: Run separately**

*Run client only:*
```bash
cd client
bun run dev
# Client runs on http://localhost:5173
```

*Run server only:*
```bash
cd server-ts
bun run dev
# Server runs on http://localhost:3000
```

### 5. Production Build

**Build client:**
```bash
cd client
bun run build
```

**Build server:**
```bash
cd server-ts
bun run build
```

### 6. Server-Side Rendering (SSR)

To run the application with SSR:
```bash
# Build and setup SSR
./ssr.sh

# Start SSR server
cd server-ts
bun run start
# Application runs on http://localhost:8080
```

## API Documentation

When the server is running, you can access:

- **API Documentation**: http://localhost:3000/api-docs (Swagger UI)
- **Health Check**: http://localhost:3000/health
- **API Base URL**: http://localhost:3000/api

### Key API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh JWT token

**Todos:**
- `GET /api/todos` - Get user todos (with filtering and pagination)
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PUT /api/todos/:id/status` - Update todo status
- `DELETE /api/todos/:id` - Delete todo

**Chat:**
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/:id/messages` - Get room messages
- WebSocket connection for real-time messaging

## Testing

**Run client tests:**
```bash
cd client
bun run test
```

**Run server tests:**
```bash
cd server-ts
bun run test
```

## Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite** - Database
- **TypeORM** - ORM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Swagger** - API documentation
- **Jest/Vitest** - Testing

## Recent Updates

### Todo Management Improvements
- ✅ **Status dropdown**: Replaced checkbox with select dropdown for better status management
- ✅ **Inline editing**: Click-to-edit todo titles with validation
- ✅ **Real-time updates**: Optimistic updates for better UX

### Profile Management
- ✅ **Username updates**: Change username with validation
- ✅ **Avatar management**: Update profile avatar via URL
- ✅ **Form validation**: Client and server-side validation

### Server-Side Rendering
- ✅ **Full SSR support**: Complete SSR implementation
- ✅ **Build automation**: Automated build and deployment script
- ✅ **Production ready**: Optimized for production deployment

### Code Quality
- ✅ **Test coverage**: Unit tests for critical functionality
- ✅ **Code cleanup**: Removed unused development files
- ✅ **Documentation**: Updated README and API docs

## Deployment

### Frontend Deployment (Vercel)

1. **Login to Vercel**: [https://vercel.com/login](https://vercel.com/login)
2. **Create new project**: Import repository from GitHub
3. **Configure build settings**:
   - Root Directory: `./client`
   - Build Command: `bun run build`
   - Output Directory: `dist`
4. **Environment Variables**: Set the following:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_WS_URL=https://your-backend-url.com
   ```
5. **Deploy**: Vercel will automatically build and deploy

### Backend Deployment (Railway/Heroku)

**Using Railway (Recommended):**
1. **Login to Railway**: [https://railway.app](https://railway.app)
2. **Create new project**: Connect GitHub repository
3. **Configure settings**:
   - Root Directory: `./server-ts`
   - Build Command: `bun run build`
   - Start Command: `bun run start`
4. **Environment Variables**: Set production environment variables
5. **Deploy**: Railway will handle the deployment

**Using Heroku:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set buildpack for monorepo
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku config:set PROJECT_PATH=server-ts

# Deploy
git push heroku main
```

### SSR Deployment

For SSR deployment, use the provided script:
```bash
# Build and setup SSR
./ssr.sh

# Deploy the server-ts directory with build files included
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Use conventional commits

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

For questions or support, please open an issue on GitHub.
