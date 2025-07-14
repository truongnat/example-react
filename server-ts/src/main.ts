// Register path mappings first
import './register-paths';

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { DependencyContainer } from '@shared/utils/DependencyContainer';
import { ErrorMiddleware } from '@infrastructure/middleware/ErrorMiddleware';
import { LoggerMiddleware } from '@infrastructure/middleware/LoggerMiddleware';
import { SwaggerMiddleware } from '@infrastructure/middleware/SwaggerMiddleware';
import { SocketService } from '@infrastructure/external-services/SocketService';
import { ApiResponse } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';

// Load environment variables from root directory
dotenv.config({ path: '../.env' });
// Fallback to local .env if root doesn't exist
dotenv.config();

class AppServer {
  private app: Application;
  private server: any;
  private io: SocketIOServer;
  private port: number;
  private container: DependencyContainer;
  private socketService: SocketService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.port = parseInt(process.env.PORT || '3000');
    this.container = DependencyContainer.getInstance();

    // Initialize Socket.IO
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: (process.env.CORS_ALLOW_ORIGINS || 'http://localhost:3000').split(','),
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      connectTimeout: 45000,
      allowEIO3: true,
    });

    this.socketService = new SocketService(this.io);
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize dependency container with socket service
      await this.container.initialize(this.socketService);

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup Socket.IO
      this.setupSocket();

      // Setup SSR if enabled (only in production or explicitly enabled)
      const shouldEnableSSR = process.env.IS_SSR === 'true' ||
                              (process.env.NODE_ENV === 'production' && process.env.IS_SSR !== 'false');

      if (shouldEnableSSR) {
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

    // Body parsing - exclude multipart/form-data for file uploads
    this.app.use((req, res, next) => {
      if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        return next();
      }
      express.json({ limit: '10mb' })(req, res, next);
    });
    this.app.use((req, res, next) => {
      if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        return next();
      }
      express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
    });

    // Static files
    this.app.use('/static', express.static(path.join(__dirname, '../public')));
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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
    this.app.use('/api/users', this.container.userRoutes.getRouter());
    this.app.use('/api/upload', this.container.uploadRoutes.getRouter());

    // Chat routes (only if available)
    if (this.container.chatRoutes) {
      this.app.use('/api/chat', this.container.chatRoutes.getRouter());
    }

    // API info
    this.app.get('/api', (req, res) => {
      const response: ApiResponse = {
        success: true,
        data: {
          name: 'Example Server API',
          version: '1.0.0',
          description: 'Clean Architecture Backend with TypeScript',
          documentation: '/api-docs',
          endpoints: {
            auth: '/api/auth',
            todos: '/api/todos',
            health: '/health',
            docs: '/api-docs',
          },
        },
        message: 'API information',
      };
      res.status(HTTP_STATUS.OK).json(response);
    });
  }

  private setupSSR(): void {
    // Serve React build files
    // In production/Docker, client files are in 'build' directory
    // In development, they might be in '../client/dist' or '../client'
    const possiblePaths = [
      path.join(__dirname, '../build'),           // Docker production
      path.join(__dirname, '../client/dist'),     // Local development
      path.join(__dirname, '../client'),          // Alternative local
    ];

    let buildPath: string = possiblePaths[0]!; // Default to Docker production path

    // Find the correct path that exists
    const fs = require('fs');
    for (const testPath of possiblePaths) {
      if (fs.existsSync(path.join(testPath, 'index.html'))) {
        buildPath = testPath;
        break;
      }
    }

    console.log(`SSR serving static files from: ${buildPath}`);
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

  private setupSocket(): void {
    this.socketService.initialize();
  }

  public async start(): Promise<void> {
    try {
      await this.initialize();

      // Check if SSR should be enabled
      const shouldEnableSSR = process.env.IS_SSR === 'true' ||
                              (process.env.NODE_ENV === 'production' && process.env.IS_SSR !== 'false');

      const server = this.server.listen(this.port, () => {
        console.log(`🚀 Server started on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 API: http://localhost:${this.port}/api`);
        console.log(`📚 API Documentation: http://localhost:${this.port}/api-docs`);

        if (shouldEnableSSR) {
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
