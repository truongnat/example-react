import express, { Express } from 'express';
import cors from 'cors';
import { DependencyContainer } from '@shared/utils/DependencyContainer';
import { ErrorMiddleware } from '@infrastructure/middleware/ErrorMiddleware';
import { LoggerMiddleware } from '@infrastructure/middleware/LoggerMiddleware';
import { SocketService } from '@infrastructure/external-services/SocketService';

// Mock database for testing
const mockDatabase = {
  users: new Map(),
  todos: new Map(),
  rooms: new Map(),
  messages: new Map(),
};

export const setupTestApp = async (): Promise<Express> => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(LoggerMiddleware.log);

  // Create mock SocketService for testing
  const mockIo = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
    on: jest.fn(),
    use: jest.fn(),
  } as any;

  const mockSocketService = new SocketService(mockIo);

  // Mock additional methods that might be called
  mockSocketService.broadcastUserOfflineToRoom = jest.fn();
  mockSocketService.disconnectUser = jest.fn();
  mockSocketService.setChatController = jest.fn();

  // Initialize dependency container
  const container = DependencyContainer.getInstance();
  await container.initialize(mockSocketService);

  // Reset database after initialization
  await resetTestDatabase();

  // Routes
  app.use('/api/auth', container.authRoutes.getRouter());
  app.use('/api/todos', container.todoRoutes.getRouter());
  app.use('/api/chat', container.chatRoutes.getRouter());
  app.use('/api/users', container.userRoutes.getRouter());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(ErrorMiddleware.handle);

  return app;
};

export const resetTestDatabase = async (): Promise<void> => {
  try {
    // Get the database connection from container
    const container = DependencyContainer.getInstance();
    const db = container.databaseConnection;

    if (db && 'getDatabase' in db) {
      const sqliteDb = (db as any).getDatabase();

      // Clear all tables in correct order (respecting foreign key constraints)
      await sqliteDb.run('DELETE FROM messages');
      await sqliteDb.run('DELETE FROM rooms');
      await sqliteDb.run('DELETE FROM todos');
      await sqliteDb.run('DELETE FROM users');

      // Reset auto-increment counters only if the table exists
      try {
        await sqliteDb.run('DELETE FROM sqlite_sequence WHERE name IN ("users", "todos", "rooms", "messages")');
      } catch (error: any) {
        // Ignore error if sqlite_sequence table doesn't exist
        if (!error?.message?.includes('no such table: sqlite_sequence')) {
          throw error;
        }
      }

      // Ensure all operations are committed
      await sqliteDb.run('PRAGMA synchronous = FULL');
    }

    // Also clear mock database for consistency
    mockDatabase.users.clear();
    mockDatabase.todos.clear();
    mockDatabase.rooms.clear();
    mockDatabase.messages.clear();

    // Add a small delay to ensure database operations complete
    await new Promise(resolve => setTimeout(resolve, 10));
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
};

export const seedTestData = async () => {
  // Add any seed data needed for tests
  return {
    users: [],
    todos: [],
    rooms: [],
    messages: [],
  };
};
