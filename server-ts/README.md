# Example Server - Clean Architecture TypeScript Backend

A modern, scalable backend built with Clean Architecture principles using TypeScript, Express.js, and multiple database options.

## 🏗️ Architecture

This project follows Clean Architecture principles with the following layers:

```
src/
├── domain/                 # Business Logic & Rules
│   ├── entities/          # Domain Entities
│   ├── repositories/      # Repository Interfaces
│   └── services/          # Domain Services
├── application/           # Application Business Rules
│   ├── use-cases/         # Application Use Cases
│   ├── dtos/              # Data Transfer Objects
│   ├── interfaces/        # Application Interfaces
│   └── services/          # Application Services
├── infrastructure/        # External Concerns
│   ├── database/          # Database Implementations
│   ├── repositories/      # Repository Implementations
│   ├── external-services/ # External Services
│   ├── middleware/        # Infrastructure Middleware
│   └── config/            # Configuration
├── presentation/          # Controllers & Routes
│   ├── controllers/       # HTTP Controllers
│   ├── routes/            # Route Definitions
│   ├── middleware/        # Presentation Middleware
│   └── validators/        # Request Validators
└── shared/                # Shared Utilities
    ├── constants/         # Application Constants
    ├── exceptions/        # Custom Exceptions
    ├── utils/             # Utility Functions
    └── types/             # Shared Types
```

## 🚀 Features

- **Clean Architecture**: Separation of concerns with clear dependency rules
- **TypeScript**: Full type safety and modern JavaScript features
- **Multiple Databases**: SQLite, PostgreSQL, Supabase, MongoDB support
- **Authentication**: JWT-based authentication with refresh tokens
- **Validation**: Request validation with express-validator
- **Error Handling**: Centralized error handling with custom exceptions
- **Logging**: Request logging and error tracking
- **Docker Support**: Containerized deployment with Docker Compose
- **SSR Support**: Serve React applications with server-side rendering
- **Health Checks**: Built-in health check endpoints

## 🗄️ Database Options

### 1. SQLite (Development)
```bash
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/database.sqlite
```

### 2. PostgreSQL (Production)
```bash
DATABASE_TYPE=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=example_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=password
```

### 3. Supabase (Cloud)
```bash
DATABASE_TYPE=supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. MongoDB (Legacy)
```bash
DATABASE_TYPE=mongodb
MONGO_URL=mongodb://localhost:27017/example-db
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)
- Git

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd server-ts
npm install
```

2. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**
```bash
# For SQLite (default)
npm run setup:db

# For PostgreSQL with Docker
DATABASE_TYPE=postgres npm run setup:db

# For Supabase (configure .env first)
DATABASE_TYPE=supabase npm run setup:db
```

4. **Start development server**
```bash
npm run dev
```

## 📜 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run setup:db        # Setup database based on DATABASE_TYPE
./scripts/setup-db.sh   # Database setup script
./scripts/start-dev.sh  # Complete development setup

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode

# Linting
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
```

## 🐳 Docker Deployment

### Development with Docker
```bash
cd docker
docker-compose up -d postgres  # Start only PostgreSQL
```

### Production Deployment
```bash
cd docker
docker-compose up -d  # Start all services
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get user todos
- `POST /api/todos` - Create todo
- `GET /api/todos/:id` - Get todo by ID
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### System
- `GET /health` - Health check
- `GET /api` - API information

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development
IS_SSR=true

# CORS
CORS_ALLOW_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Database (choose one)
DATABASE_TYPE=sqlite|supabase|postgres|mongodb

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 Development Guidelines

### Adding New Features

1. **Domain Layer**: Define entities and repository interfaces
2. **Application Layer**: Create use cases and DTOs
3. **Infrastructure Layer**: Implement repositories and services
4. **Presentation Layer**: Add controllers, routes, and validators

### Code Style

- Use TypeScript strict mode
- Follow Clean Architecture principles
- Write unit tests for use cases
- Use dependency injection
- Handle errors properly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
