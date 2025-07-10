import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { DatabaseConnection } from './DatabaseConnection';
import path from 'path';
import fs from 'fs';

export class SQLiteConnection extends DatabaseConnection {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  async connect(): Promise<void> {
    try {
      const dbPath = this.config.getConnectionString();
      
      // Ensure directory exists
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });

      await this.initializeTables();
      this.isConnected = true;
      console.log('SQLite database connected successfully');
    } catch (error) {
      console.error('Failed to connect to SQLite database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.isConnected = false;
      console.log('SQLite database disconnected');
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      await this.db.get('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  public getDatabase(): Database<sqlite3.Database, sqlite3.Statement> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  private async initializeTables(): Promise<void> {
    if (!this.db) return;

    // Users table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT 1,
        is_online BOOLEAN DEFAULT 0,
        otp TEXT,
        otp_expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Todos table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'initial',
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Rooms table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        avatar_url TEXT,
        author_id TEXT NOT NULL,
        last_message_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Room participants table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS room_participants (
        room_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (room_id, user_id),
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Messages table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        author_id TEXT NOT NULL,
        room_id TEXT NOT NULL,
        is_deleted BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);
      CREATE INDEX IF NOT EXISTS idx_todos_status ON todos (status);
      CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages (room_id);
      CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages (author_id);
      CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants (user_id);
    `);
  }

  public getDatabase(): Database<sqlite3.Database, sqlite3.Statement> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }
}
