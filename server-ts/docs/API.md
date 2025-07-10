# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "errors": string[] // Only present on validation errors
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (2-50 chars, alphanumeric + _ -)",
  "email": "string (valid email)",
  "password": "string (min 8 chars, must contain uppercase, lowercase, number)",
  "avatarUrl": "string (optional, valid URL)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "avatarUrl": "string",
      "isActive": true,
      "isOnline": false,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": 3600
    }
  },
  "message": "User registered successfully"
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "avatarUrl": "string",
      "isActive": true,
      "isOnline": true,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": 3600
    }
  },
  "message": "Login successful"
}
```

#### POST /auth/logout
Logout current user (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string"
  },
  "message": "User profile retrieved successfully"
}
```

### Todos

#### GET /todos
Get user's todos (requires authentication).

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 100)
- `status`: string (initial|todo|review|done|keeping)
- `sortBy`: string (createdAt|updatedAt|title|status)
- `sortOrder`: string (asc|desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": "uuid",
        "title": "string",
        "content": "string",
        "status": "initial",
        "userId": "uuid",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Todos retrieved successfully"
}
```

#### POST /todos
Create a new todo (requires authentication).

**Request Body:**
```json
{
  "title": "string (1-200 chars)",
  "content": "string (1-2000 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": "uuid",
      "title": "string",
      "content": "string",
      "status": "initial",
      "userId": "uuid",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  },
  "message": "Todo created successfully"
}
```

#### GET /todos/:id
Get a specific todo by ID (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid"
  },
  "message": "Todo retrieved successfully"
}
```

#### PUT /todos/:id
Update a todo (requires authentication).

**Request Body:**
```json
{
  "title": "string (optional, 1-200 chars)",
  "content": "string (optional, 1-2000 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "content": "string",
    "userId": "uuid"
  },
  "message": "Todo updated successfully"
}
```

#### DELETE /todos/:id
Delete a todo (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

### System

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "datetime",
    "uptime": 123.456
  },
  "message": "Server is healthy"
}
```

#### GET /api
API information.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Example Server API",
    "version": "1.0.0",
    "description": "Clean Architecture Backend with TypeScript",
    "endpoints": {
      "auth": "/api/auth",
      "todos": "/api/todos",
      "health": "/health"
    }
  },
  "message": "API information"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Username must be at least 2 characters long",
    "Invalid email format"
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```
