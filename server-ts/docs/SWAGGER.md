# Swagger API Documentation

## Overview
This project includes comprehensive API documentation using Swagger/OpenAPI 3.0 specification.

## Accessing Documentation

### Live Documentation
- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI Spec**: http://localhost:5000/api-docs/swagger.json
- **Documentation Health**: http://localhost:5000/api-docs/health

### Quick Links
- **Redirect**: http://localhost:5000/docs → redirects to `/api-docs`

## Features

### 🎯 **Interactive Documentation**
- **Try It Out**: Test API endpoints directly from the documentation
- **Authentication**: Built-in JWT token authentication
- **Request/Response Examples**: Real examples for all endpoints
- **Schema Validation**: Complete request/response schema definitions

### 📋 **API Coverage**
- ✅ **Authentication Endpoints**
  - POST `/auth/register` - User registration
  - POST `/auth/login` - User login  
  - POST `/auth/logout` - User logout
  - GET `/auth/me` - Get current user profile

- ✅ **Todo Management**
  - GET `/todos` - Get user's todos (with pagination, filtering, sorting)
  - POST `/todos` - Create new todo
  - GET `/todos/:id` - Get specific todo
  - PUT `/todos/:id` - Update todo
  - DELETE `/todos/:id` - Delete todo

- ✅ **System Endpoints**
  - GET `/health` - Health check
  - GET `/api` - API information

### 🔐 **Security**
- **JWT Bearer Authentication**: Secure endpoints with JWT tokens
- **Authorization Testing**: Test protected endpoints directly in Swagger UI
- **Token Persistence**: Swagger UI remembers your authentication token

### 📊 **Schema Definitions**
- **User Schema**: Complete user object definition
- **Todo Schema**: Todo object with status enum
- **Auth Tokens**: JWT token response structure
- **API Response**: Standardized response format
- **Error Handling**: Comprehensive error response schemas
- **Pagination**: Paginated response structure

## Usage Guide

### 1. **Authentication Flow**
1. Open Swagger UI at http://localhost:5000/api-docs
2. Use the **POST /auth/register** or **POST /auth/login** endpoint
3. Copy the `accessToken` from the response
4. Click the **Authorize** button (🔒) at the top of the page
5. Enter: `Bearer <your-access-token>`
6. Click **Authorize**
7. Now you can test protected endpoints

### 2. **Testing Endpoints**
1. Navigate to any endpoint section
2. Click **Try it out**
3. Fill in required parameters/request body
4. Click **Execute**
5. View the response below

### 3. **Understanding Responses**
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": object,
  "message": string,
  "errors": string[] // Only on validation errors
}
```

## Configuration

### Environment Variables
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Swagger will automatically detect:
# - Development: http://localhost:5000/api
# - Production: https://your-domain.com/api
```

### Customization
The Swagger configuration is located in:
- **Config**: `src/infrastructure/config/swagger.config.ts`
- **Middleware**: `src/infrastructure/middleware/SwaggerMiddleware.ts`
- **Annotations**: Inline in route files

### Custom Styling
The Swagger UI includes custom CSS for:
- Hidden top bar
- Custom color scheme
- Improved readability
- Professional appearance

## Development

### Adding New Endpoints
1. Add Swagger annotations to your route file:
```typescript
/**
 * @swagger
 * /your-endpoint:
 *   post:
 *     summary: Your endpoint description
 *     tags: [YourTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 */
```

2. Define schemas in `swagger.config.ts` if needed
3. Rebuild and restart the server
4. Documentation will be automatically updated

### Schema Updates
To add new schemas, update the `components.schemas` section in `swagger.config.ts`:

```typescript
YourSchema: {
  type: 'object',
  properties: {
    field: {
      type: 'string',
      description: 'Field description',
      example: 'example value',
    },
  },
},
```

## Production Deployment

### Security Considerations
- **Disable in Production**: Consider disabling Swagger in production environments
- **Access Control**: Implement IP whitelisting or authentication for documentation access
- **HTTPS Only**: Ensure documentation is only served over HTTPS in production

### Environment Setup
```bash
# To disable Swagger in production
ENABLE_SWAGGER=false

# Or restrict access
SWAGGER_ACCESS_IPS=192.168.1.0/24,10.0.0.0/8
```

## Troubleshooting

### Common Issues

1. **Documentation not loading**
   - Check server is running on correct port
   - Verify `/api-docs` endpoint is accessible
   - Check browser console for errors

2. **Authentication not working**
   - Ensure JWT token is valid and not expired
   - Check token format: `Bearer <token>`
   - Verify token was copied correctly

3. **Endpoints not showing**
   - Check Swagger annotations syntax
   - Verify file paths in `swagger.config.ts`
   - Restart server after changes

4. **Schema validation errors**
   - Verify schema definitions match actual API responses
   - Check required fields are properly marked
   - Validate JSON schema syntax

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=swagger:*
```

## Benefits

### For Developers
- **Faster Development**: Test APIs without external tools
- **Better Understanding**: Clear documentation of all endpoints
- **Validation**: Immediate feedback on request/response formats
- **Integration**: Easy integration with frontend development

### For Teams
- **Collaboration**: Shared understanding of API contracts
- **Documentation**: Always up-to-date API documentation
- **Testing**: Built-in testing capabilities
- **Standards**: Enforced API design standards

### For Users
- **Self-Service**: Explore and understand APIs independently
- **Examples**: Real working examples for all endpoints
- **Interactive**: Test APIs directly in browser
- **Comprehensive**: Complete API reference in one place
