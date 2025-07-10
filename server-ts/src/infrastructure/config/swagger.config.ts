import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Example Server API',
    version: '1.0.0',
    description: 'Clean Architecture Backend with TypeScript - API Documentation',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com/api' 
        : `http://localhost:${process.env.PORT || 5000}/api`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User unique identifier',
          },
          username: {
            type: 'string',
            description: 'Username',
            example: 'johndoe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john@example.com',
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            description: 'User avatar URL',
            example: 'https://example.com/avatar.jpg',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether user is active',
            example: true,
          },
          isOnline: {
            type: 'boolean',
            description: 'Whether user is online',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'User last update timestamp',
          },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Todo unique identifier',
          },
          title: {
            type: 'string',
            description: 'Todo title',
            example: 'Complete project documentation',
          },
          content: {
            type: 'string',
            description: 'Todo content/description',
            example: 'Write comprehensive API documentation with examples',
          },
          status: {
            type: 'string',
            enum: ['initial', 'todo', 'review', 'done', 'keeping'],
            description: 'Todo status',
            example: 'todo',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the user who owns this todo',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Todo creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Todo last update timestamp',
          },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            description: 'JWT access token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            description: 'JWT refresh token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          expiresIn: {
            type: 'number',
            description: 'Token expiration time in seconds',
            example: 3600,
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the request was successful',
            example: true,
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
          message: {
            type: 'string',
            description: 'Response message',
            example: 'Operation completed successfully',
          },
          errors: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of error messages (only present on validation errors)',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          errors: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Detailed error messages',
          },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {},
            description: 'Array of items',
          },
          total: {
            type: 'number',
            description: 'Total number of items',
            example: 100,
          },
          page: {
            type: 'number',
            description: 'Current page number',
            example: 1,
          },
          limit: {
            type: 'number',
            description: 'Number of items per page',
            example: 10,
          },
          totalPages: {
            type: 'number',
            description: 'Total number of pages',
            example: 10,
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/presentation/routes/*.ts',
    './src/presentation/controllers/*.ts',
    './src/application/dtos/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
