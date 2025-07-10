import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { DependencyContainer } from '@shared/utils/DependencyContainer';
import { ErrorMiddleware } from '@infrastructure/middleware/ErrorMiddleware';
import { LoggerMiddleware } from '@infrastructure/middleware/LoggerMiddleware';
import { SwaggerMiddleware } from '@infrastructure/middleware/SwaggerMiddleware';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';

// Load environment variables
dotenv.config();

class AppServer {
  private app: Application;
  private port: number;
  private container: DependencyContainer;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000');
    this.container = DependencyContainer.getInstance();
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize dependency container
      await this.container.initialize();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup SSR if enabled
      if (process.env.IS_SSR === 'true') {
        this.setupSSR();
      }

      // Setup error handling
      this.setupErrorHandling();

      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  private setupMiddleware(): void {
    // Request logging and ID
    this.app.use(LoggerMiddleware.requestId);
    this.app.use(LoggerMiddleware.log);

    // CORS
    const corsOptions = {
      origin: (process.env.CORS_ALLOW_ORIGINS || 'http://localhost:3000').split(','),
      methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files
    this.app.use('/static', express.static(path.join(__dirname, '../public')));
  }

  private setupRoutes(): void {
    // Swagger documentation
    this.app.use('/api-docs', SwaggerMiddleware.serve, SwaggerMiddleware.setup);
    this.app.get('/api-docs/swagger.json', SwaggerMiddleware.serveSpec);
    this.app.get('/api-docs/health', SwaggerMiddleware.healthCheck);
    this.app.get('/docs', SwaggerMiddleware.redirectToDocs);

    // Health check
    this.app.get('/health', (req, res) => {
      const response: ApiResponse = {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          documentation: '/api-docs',
        },
        message: 'Server is healthy',
      };
      res.status(HTTP_STATUS.OK).json(response);
    });

    // API routes
    this.app.use('/api/auth', this.container.authRoutes.getRouter());
    this.app.use('/api/todos', this.container.todoRoutes.getRouter());

    // API info
    this.app.get('/api', (req, res) => {
      const response: ApiResponse = {
        success: true,
        data: {
          name: 'Example Server API',
          version: '1.0.0',
          description: 'Clean Architecture Backend with TypeScript',
          endpoints: {
            auth: '/api/auth',
            todos: '/api/todos',
            health: '/health',
          },
        },
        message: 'API information',
      };
      res.status(HTTP_STATUS.OK).json(response);
    });
  }

  private setupSSR(): void {
    // Serve React build files
    const buildPath = path.join(__dirname, '../build');
    this.app.use(express.static(buildPath));

    // Handle React routing
    this.app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return;
      }
      
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }

  private setupErrorHandling(): void {
    // 404 handler for API routes
    this.app.use('/api/*', ErrorMiddleware.notFound);
    
    // Global error handler
    this.app.use(ErrorMiddleware.handle);
  }

  public async start(): Promise<void> {
    try {
      await this.initialize();
      
      const server = this.app.listen(this.port, () => {
        console.log(`🚀 Server started on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 API: http://localhost:${this.port}/api`);
        
        if (process.env.IS_SSR === 'true') {
          console.log(`🌐 SSR: http://localhost:${this.port}`);
        }
      });

      // Graceful shutdown
      process.on('SIGTERM', async () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(async () => {
          await this.container.cleanup();
          process.exit(0);
        });
      });

      process.on('SIGINT', async () => {
        console.log('SIGINT received, shutting down gracefully');
        server.close(async () => {
          await this.container.cleanup();
          process.exit(0);
        });
      });

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new AppServer();
app.start().catch((error) => {
  console.error('Application startup failed:', error);
  process.exit(1);
});
