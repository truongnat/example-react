# TypeScript Backend Server 2025

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.18-lightgrey?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Clean_Architecture-✅-brightgreen" alt="Clean Architecture" />
</p>

A production-ready, scalable backend server built with **Clean Architecture** principles, featuring TypeScript, Express.js, and comprehensive database support. Designed for maintainability, testability, and enterprise-grade applications in 2025.

## 🏗️ Clean Architecture Implementation

This project strictly follows **Clean Architecture** principles with clear separation of concerns and dependency inversion:

```
src/
├── 🏢 domain/                    # Enterprise Business Rules
│   ├── entities/                # Core business entities
│   │   ├── User.ts              # User domain entity
│   │   ├── Todo.ts              # Todo domain entity
│   │   ├── ChatRoom.ts          # Chat room entity
│   │   └── Message.ts           # Message entity
│   ├── repositories/            # Repository contracts (interfaces)
│   │   ├── IUserRepository.ts   # User data access contract
│   │   ├── ITodoRepository.ts   # Todo data access contract
│   │   └── IChatRepository.ts   # Chat data access contract
│   ├── services/                # Domain services
│   │   ├── AuthDomainService.ts # Authentication business logic
│   │   ├── TodoDomainService.ts # Todo business rules
│   │   └── ChatDomainService.ts # Chat business logic
│   └── value-objects/           # Domain value objects
│       ├── Email.ts             # Email value object
│       ├── Password.ts          # Password value object
│       └── TodoStatus.ts        # Todo status enum
├── 🎯 application/               # Application Business Rules
│   ├── use-cases/               # Application-specific business rules
│   │   ├── auth/                # Authentication use cases
│   │   │   ├── LoginUseCase.ts  # User login logic
│   │   │   ├── RegisterUseCase.ts # User registration
│   │   │   └── RefreshTokenUseCase.ts # Token refresh
│   │   ├── todo/                # Todo management use cases
│   │   │   ├── CreateTodoUseCase.ts # Create todo
│   │   │   ├── UpdateTodoUseCase.ts # Update todo
│   │   │   ├── DeleteTodoUseCase.ts # Delete todo
│   │   │   └── GetTodosUseCase.ts   # Retrieve todos
│   │   └── chat/                # Chat use cases
│   │       ├── CreateRoomUseCase.ts # Create chat room
│   │       ├── SendMessageUseCase.ts # Send message
│   │       └── GetMessagesUseCase.ts # Get message history
│   ├── dtos/                    # Data Transfer Objects
│   │   ├── auth/                # Authentication DTOs
│   │   ├── todo/                # Todo DTOs
│   │   └── chat/                # Chat DTOs
│   ├── interfaces/              # Application interfaces
│   │   ├── IAuthService.ts      # Auth service interface
│   │   ├── IEmailService.ts     # Email service interface
│   │   └── IFileService.ts      # File service interface
│   └── services/                # Application services
│       ├── AuthApplicationService.ts # Auth orchestration
│       ├── TodoApplicationService.ts # Todo orchestration
│       └── ChatApplicationService.ts # Chat orchestration
├── 🔧 infrastructure/           # Frameworks & Drivers
│   ├── database/                # Database implementations
│   │   ├── sqlite/              # SQLite implementation
│   │   ├── postgres/            # PostgreSQL implementation
│   │   ├── supabase/            # Supabase implementation
│   │   └── mongodb/             # MongoDB implementation
│   ├── repositories/            # Repository implementations
│   │   ├── SqliteUserRepository.ts # SQLite user repo
│   │   ├── PostgresUserRepository.ts # Postgres user repo
│   │   └── SupabaseUserRepository.ts # Supabase user repo
│   ├── external-services/       # External service integrations
│   │   ├── EmailService.ts      # Email service implementation
│   │   ├── FileStorageService.ts # File storage service
│   │   └── WebSocketService.ts  # WebSocket implementation
│   ├── middleware/              # Infrastructure middleware
│   │   ├── DatabaseMiddleware.ts # DB connection middleware
│   │   ├── LoggingMiddleware.ts # Request logging
│   │   └── SecurityMiddleware.ts # Security headers
│   └── config/                  # Configuration management
│       ├── DatabaseConfig.ts    # Database configuration
│       ├── JwtConfig.ts         # JWT configuration
│       └── AppConfig.ts         # Application configuration
├── 🌐 presentation/             # Interface Adapters
│   ├── controllers/             # HTTP request handlers
│   │   ├── AuthController.ts    # Authentication endpoints
│   │   ├── TodoController.ts    # Todo CRUD endpoints
│   │   ├── ChatController.ts    # Chat endpoints
│   │   └── HealthController.ts  # Health check endpoints
│   ├── routes/                  # Route definitions
│   │   ├── authRoutes.ts        # Auth route mappings
│   │   ├── todoRoutes.ts        # Todo route mappings
│   │   ├── chatRoutes.ts        # Chat route mappings
│   │   └── index.ts             # Route aggregation
│   ├── middleware/              # Presentation middleware
│   │   ├── AuthMiddleware.ts    # JWT authentication
│   │   ├── ValidationMiddleware.ts # Request validation
│   │   ├── ErrorMiddleware.ts   # Error handling
│   │   └── CorsMiddleware.ts    # CORS configuration
│   └── validators/              # Request validation schemas
│       ├── AuthValidators.ts    # Auth request validation
│       ├── TodoValidators.ts    # Todo request validation
│       └── ChatValidators.ts    # Chat request validation
└── 🔄 shared/                   # Shared Utilities
    ├── constants/               # Application constants
    │   ├── HttpStatus.ts        # HTTP status codes
    │   ├── ErrorCodes.ts        # Application error codes
    │   └── DatabaseTypes.ts     # Database type constants
    ├── exceptions/              # Custom exception classes
    │   ├── BaseException.ts     # Base exception class
    │   ├── ValidationException.ts # Validation errors
    │   ├── AuthenticationException.ts # Auth errors
    │   └── DatabaseException.ts # Database errors
    ├── utils/                   # Utility functions
    │   ├── PasswordUtils.ts     # Password hashing utilities
    │   ├── JwtUtils.ts          # JWT token utilities
    │   ├── ValidationUtils.ts   # Validation helpers
    │   └── DateUtils.ts         # Date manipulation
    └── types/                   # Shared TypeScript types
        ├── ApiResponse.ts       # API response types
        ├── DatabaseTypes.ts     # Database-related types
        └── CommonTypes.ts       # Common type definitions
```

### 🎯 Architecture Benefits

- **🔄 Dependency Inversion**: High-level modules don't depend on low-level modules
- **🧪 Testability**: Easy to unit test business logic in isolation
- **🔧 Maintainability**: Clear separation of concerns and responsibilities
- **🔄 Flexibility**: Easy to swap implementations (databases, external services)
- **📈 Scalability**: Modular structure supports team scaling and feature growth

## ✨ Enterprise Features

### 🔐 **Security & Authentication**
- **JWT Authentication**: Access tokens + refresh token rotation
- **Password Security**: Bcrypt hashing with configurable rounds
- **Rate Limiting**: Configurable rate limits per endpoint
- **CORS Protection**: Flexible CORS configuration
- **Input Validation**: Comprehensive request validation with express-validator
- **SQL Injection Prevention**: Parameterized queries and ORM protection
- **XSS Protection**: Input sanitization and output encoding

### 🗄️ **Multi-Database Support**
- **SQLite**: Lightweight development database
- **PostgreSQL**: Production-ready relational database
- **Supabase**: Cloud-native PostgreSQL with real-time features
- **MongoDB**: NoSQL document database support
- **Database Abstraction**: Repository pattern for database independence
- **Migration Support**: Database schema versioning and migrations

### 🚀 **Performance & Scalability**
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Redis integration for session and data caching
- **Async/Await**: Non-blocking I/O operations throughout
- **Compression**: Gzip compression for API responses
- **Static File Serving**: Optimized static asset delivery
- **Health Monitoring**: Comprehensive health check endpoints

### 🔄 **Real-time Communication**
- **WebSocket Support**: Socket.io integration for real-time features
- **Chat System**: Multi-room chat with message persistence
- **Live Updates**: Real-time todo updates across clients
- **Presence System**: User online/offline status tracking
- **Event Broadcasting**: Efficient event distribution

### 📚 **Developer Experience**
- **API Documentation**: Interactive Swagger/OpenAPI 3.0 documentation
- **Type Safety**: End-to-end TypeScript with strict mode
- **Hot Reload**: Development server with automatic restart
- **Error Handling**: Centralized error handling with detailed logging
- **Testing Suite**: Comprehensive unit, integration, and E2E tests
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

### 🐳 **DevOps & Deployment**
- **Docker Support**: Multi-stage Dockerfile with optimization
- **Docker Compose**: Development, testing, and production environments
- **Environment Management**: Flexible configuration for different environments
- **Process Management**: PM2 integration for production deployment
- **Logging**: Structured logging with different levels and outputs
- **Monitoring**: Health checks and application metrics

## 🗄️ Database Configuration

The server supports multiple database backends with seamless switching via environment configuration:

### 1. 🗃️ SQLite (Development & Testing)
**Perfect for**: Local development, testing, prototyping
```bash
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/database.sqlite
```
**Features**:
- Zero configuration setup
- File-based storage
- ACID compliance
- Perfect for development and testing

### 2. 🐘 PostgreSQL (Production Recommended)
**Perfect for**: Production deployments, complex queries, scalability
```bash
DATABASE_TYPE=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=example_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_SSL=false
POSTGRES_MAX_CONNECTIONS=20
```
**Features**:
- ACID compliance with advanced features
- JSON/JSONB support for flexible schemas
- Full-text search capabilities
- Excellent performance and scalability
- Rich ecosystem and tooling

### 3. ☁️ Supabase (Cloud-Native)
**Perfect for**: Rapid deployment, real-time features, managed infrastructure
```bash
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
**Features**:
- Managed PostgreSQL with real-time subscriptions
- Built-in authentication and authorization
- Auto-generated APIs
- Edge functions and storage
- Real-time database changes

### 4. 🍃 MongoDB (Document Store)
**Perfect for**: Flexible schemas, rapid prototyping, document-heavy applications
```bash
DATABASE_TYPE=mongodb
MONGO_URL=mongodb://localhost:27017/example-db
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_AUTH_SOURCE=admin
```
**Features**:
- Flexible document schemas
- Horizontal scaling capabilities
- Rich query language
- GridFS for file storage
- Aggregation pipeline for complex operations

### 🔄 Database Switching
Switch between databases without code changes:
```bash
# Development with SQLite
npm run dev

# Production with PostgreSQL
DATABASE_TYPE=postgres npm run start

# Cloud deployment with Supabase
DATABASE_TYPE=supabase npm run start
```

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **Package Manager**: npm, yarn, or bun
- **Docker** (optional, for PostgreSQL)
- **Git** for version control

### 1. Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd server-ts

# Install dependencies
npm install
# or
yarn install
# or
bun install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env  # or your preferred editor
```

**Essential Environment Variables:**
```env
# Server Configuration
NODE_ENV=development
PORT=3000
IS_SSR=true

# Database (choose one)
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/database.sqlite

# JWT Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2025
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-2025
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Database Setup

```bash
# SQLite (default - no additional setup required)
npm run setup:db

# PostgreSQL with Docker
docker-compose -f docker/docker-compose.yml up -d postgres
DATABASE_TYPE=postgres npm run setup:db

# Supabase (configure .env with Supabase credentials first)
DATABASE_TYPE=supabase npm run setup:db

# MongoDB (ensure MongoDB is running)
DATABASE_TYPE=mongodb npm run setup:db
```

### 4. Start Development

```bash
# Start development server with hot reload
npm run dev

# Or use the full development setup script
npm run dev:full
```

**Server will be available at:**
- 🌐 **API Server**: http://localhost:3000
- 📚 **API Documentation**: http://localhost:3000/api-docs
- 🏥 **Health Check**: http://localhost:3000/health

### 5. Seed Demo Data (Optional)

```bash
# Create demo user and sample todos
npm run seed:demo

# Force recreate demo data
npm run seed:demo:force
```

**Demo Credentials:**
- **Email**: demo@example.com
- **Password**: Demo123!
- **Features**: Pre-populated todos and chat rooms

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

### 📚 **API Documentation**
- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI Spec**: http://localhost:5000/api-docs/swagger.json
- **Quick Access**: http://localhost:5000/docs

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get user todos (with pagination, filtering, sorting)
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

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI Spec**: http://localhost:5000/api-docs/swagger.json
- **Quick Access**: http://localhost:5000/docs

### Testing APIs
```bash
# 1. Start the server
npm run dev

# 2. Open Swagger UI in browser
open http://localhost:5000/api-docs

# 3. Test authentication flow:
#    - Use POST /auth/register or /auth/login
#    - Copy the accessToken from response
#    - Click "Authorize" button (🔒) in Swagger UI
#    - Enter: Bearer <your-access-token>
#    - Now test any protected endpoint

# 4. Or use PowerShell script
powershell -ExecutionPolicy Bypass -File test-api.ps1
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
