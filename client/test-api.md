# API Testing Guide

This guide helps you test the API integration between the client and server.

## Prerequisites

1. Make sure the backend server is running on `http://localhost:5000`
2. The client should be running on `http://localhost:5173`

## Testing Authentication

### 1. Register a New User

**Endpoint**: `POST /api/auth/register`

**Test Data**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123456",
  "avatarUrl": "https://via.placeholder.com/120"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "test@example.com",
      "avatarUrl": "https://via.placeholder.com/120",
      "isActive": true,
      "isOnline": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token",
      "expiresIn": 3600
    }
  },
  "message": "User registered successfully"
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Test Data**:
```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

### 3. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**: `Authorization: Bearer <access-token>`

### 4. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer <access-token>`

## Testing Todos

### 1. Get All Todos

**Endpoint**: `GET /api/todos`

**Headers**: `Authorization: Bearer <access-token>`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (initial, in_progress, completed, cancelled)
- `sortBy` (optional): Sort field (createdAt, updatedAt, title, status)
- `sortOrder` (optional): Sort order (asc, desc)

**Example**: `GET /api/todos?page=1&limit=10&status=initial&sortBy=createdAt&sortOrder=desc`

### 2. Create Todo

**Endpoint**: `POST /api/todos`

**Headers**: `Authorization: Bearer <access-token>`

**Test Data**:
```json
{
  "title": "Complete project documentation",
  "content": "Write comprehensive documentation for the todo app including API endpoints and usage examples"
}
```

### 3. Get Todo by ID

**Endpoint**: `GET /api/todos/:id`

**Headers**: `Authorization: Bearer <access-token>`

### 4. Update Todo

**Endpoint**: `PUT /api/todos/:id`

**Headers**: `Authorization: Bearer <access-token>`

**Test Data**:
```json
{
  "title": "Updated todo title",
  "content": "Updated todo content"
}
```

### 5. Delete Todo

**Endpoint**: `DELETE /api/todos/:id`

**Headers**: `Authorization: Bearer <access-token>`

## Testing with Client UI

### 1. Registration Flow

1. Go to `http://localhost:5173/register`
2. Fill in the form with test data
3. Submit and verify redirect to home page
4. Check that user is logged in (navigation shows user info)

### 2. Login Flow

1. Go to `http://localhost:5173/login`
2. Use the test credentials
3. Verify successful login and redirect

### 3. Todo Management

1. Go to `http://localhost:5173/todo`
2. Create a new todo
3. Verify it appears in the list
4. Toggle completion status
5. Delete a todo
6. Test filtering and sorting

### 4. Profile Management

1. Go to `http://localhost:5173/profile`
2. Verify user information is displayed
3. Test logout functionality

## Common Issues and Solutions

### 1. CORS Errors

If you see CORS errors, make sure the backend has proper CORS configuration:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
```

### 2. 401 Unauthorized

- Check that the JWT token is being sent in the Authorization header
- Verify token hasn't expired
- Check that the backend JWT secret matches

### 3. Network Errors

- Verify backend is running on the correct port
- Check `VITE_API_BASE_URL` in `.env` file
- Ensure no firewall blocking the connection

### 4. Token Refresh Issues

- Check that refresh token endpoint is working
- Verify refresh token is stored correctly
- Check token expiration times

## Manual Testing Checklist

- [ ] User can register successfully
- [ ] User can login successfully
- [ ] User can logout successfully
- [ ] Protected routes redirect to login when not authenticated
- [ ] User can create todos
- [ ] User can view todos with pagination
- [ ] User can update todo status
- [ ] User can delete todos
- [ ] Filtering by status works
- [ ] Sorting works correctly
- [ ] Error messages are displayed properly
- [ ] Loading states are shown
- [ ] Optimistic updates work
- [ ] Token refresh works automatically
- [ ] Profile page shows user information

## Performance Testing

1. Create multiple todos (50+) to test pagination
2. Test rapid status changes to verify optimistic updates
3. Test network interruption scenarios
4. Verify caching behavior with React Query DevTools
