import { Pool, PoolClient } from 'pg';
import { DatabaseConnection } from './DatabaseConnection';

export class PostgreSQLConnection extends DatabaseConnection {
  private pool: Pool | null = null;

  async connect(): Promise<void> {
    try {
      const config = this.config.getConfig();
      
      if (!config.postgres) {
        throw new Error('PostgreSQL configuration is missing');
      }

      this.pool = new Pool({
        host: config.postgres.host,
        port: config.postgres.port,
        database: config.postgres.database,
        user: config.postgres.username,
        password: config.postgres.password,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      await this.initializeTables();
      this.isConnected = true;
      console.log('PostgreSQL database connected successfully');
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      console.log('PostgreSQL database disconnected');
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.pool) return false;
    
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch {
      return false;
    }
  }

  public getPool(): Pool {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not connected');
    }
    return this.pool;
  }

  private async initializeTables(): Promise<void> {
    if (!this.pool) return;

    const client = await this.pool.connect();
    
    try {
      // Enable UUID extension
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          avatar_url TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          is_online BOOLEAN DEFAULT FALSE,
          token_version INTEGER DEFAULT 1,
          otp VARCHAR(10),
          otp_expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add token_version column if it doesn't exist (for existing databases)
      try {
        await client.query(`ALTER TABLE users ADD COLUMN token_version INTEGER DEFAULT 1`);
      } catch (error) {
        // Column already exists, ignore error
      }

      // Todos table
      await client.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(500) NOT NULL,
          content TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'initial',
          user_id UUID NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Rooms table
      await client.query(`
        CREATE TABLE IF NOT EXISTS rooms (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL UNIQUE,
          avatar_url TEXT,
          author_id UUID NOT NULL,
          last_message_id UUID,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Room participants table
      await client.query(`
        CREATE TABLE IF NOT EXISTS room_participants (
          room_id UUID NOT NULL,
          user_id UUID NOT NULL,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (room_id, user_id),
          FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          content TEXT NOT NULL,
          author_id UUID NOT NULL,
          room_id UUID NOT NULL,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
        )
      `);

      // Create indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);
        CREATE INDEX IF NOT EXISTS idx_todos_status ON todos (status);
        CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages (room_id);
        CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages (author_id);
        CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants (user_id);
      `);

    } finally {
      client.release();
    }
  }
}
