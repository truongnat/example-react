#!/usr/bin/env node

/**
 * Migration script to convert data from old MongoDB backend to new TypeScript backend
 */

const mongoose = require('mongoose');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Configuration
const OLD_MONGO_URL = process.env.OLD_MONGO_URL || 'mongodb://localhost:27017/example-db';
const NEW_SQLITE_PATH = process.env.NEW_SQLITE_PATH || './data/database.sqlite';

// Old MongoDB schemas (simplified)
const oldUserSchema = new mongoose.Schema({
  _id: String,
  username: String,
  password: String,
  avatarUrl: String,
  email: String,
  otp: String,
  active: Boolean,
  isOnline: Boolean,
}, { timestamps: true });

const oldTodoSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: String,
  userId: String,
  status: String,
}, { timestamps: true });

const oldRoomSchema = new mongoose.Schema({
  _id: String,
  name: String,
  avatarUrl: String,
  author: String,
  lastMessage: String,
  participants: Array,
  messages: Array,
}, { timestamps: true });

const oldMessageSchema = new mongoose.Schema({
  _id: String,
  chatRoomId: String,
  content: String,
  author: String,
  room: String,
  isDeleted: Boolean,
}, { timestamps: true });

async function connectToOldDatabase() {
  console.log('🔌 Connecting to old MongoDB database...');
  await mongoose.connect(OLD_MONGO_URL);
  
  return {
    User: mongoose.model('user', oldUserSchema),
    Todo: mongoose.model('todo', oldTodoSchema),
    Room: mongoose.model('room', oldRoomSchema),
    Message: mongoose.model('message', oldMessageSchema),
  };
}

async function connectToNewDatabase() {
  console.log('🔌 Connecting to new SQLite database...');
  
  // Ensure directory exists
  const dir = path.dirname(NEW_SQLITE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = await open({
    filename: NEW_SQLITE_PATH,
    driver: sqlite3.Database,
  });

  // Initialize tables (same as in SQLiteConnection.ts)
  await db.exec(`
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

  await db.exec(`
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

  await db.exec(`
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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS room_participants (
      room_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (room_id, user_id),
      FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
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

  return db;
}

async function migrateUsers(oldModels, newDb) {
  console.log('👥 Migrating users...');
  
  const oldUsers = await oldModels.User.find({});
  console.log(`Found ${oldUsers.length} users to migrate`);

  for (const oldUser of oldUsers) {
    try {
      await newDb.run(`
        INSERT OR REPLACE INTO users (
          id, username, email, password, avatar_url, is_active, is_online, 
          otp, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        oldUser._id,
        oldUser.username,
        oldUser.email,
        oldUser.password,
        oldUser.avatarUrl,
        oldUser.active ? 1 : 0,
        oldUser.isOnline ? 1 : 0,
        oldUser.otp,
        oldUser.createdAt?.toISOString() || new Date().toISOString(),
        oldUser.updatedAt?.toISOString() || new Date().toISOString()
      ]);
    } catch (error) {
      console.error(`Error migrating user ${oldUser._id}:`, error.message);
    }
  }

  console.log('✅ Users migration completed');
}

async function migrateTodos(oldModels, newDb) {
  console.log('📝 Migrating todos...');
  
  const oldTodos = await oldModels.Todo.find({});
  console.log(`Found ${oldTodos.length} todos to migrate`);

  for (const oldTodo of oldTodos) {
    try {
      await newDb.run(`
        INSERT OR REPLACE INTO todos (
          id, title, content, status, user_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        oldTodo._id,
        oldTodo.title,
        oldTodo.content,
        oldTodo.status || 'initial',
        oldTodo.userId,
        oldTodo.createdAt?.toISOString() || new Date().toISOString(),
        oldTodo.updatedAt?.toISOString() || new Date().toISOString()
      ]);
    } catch (error) {
      console.error(`Error migrating todo ${oldTodo._id}:`, error.message);
    }
  }

  console.log('✅ Todos migration completed');
}

async function migrateRooms(oldModels, newDb) {
  console.log('💬 Migrating rooms...');
  
  const oldRooms = await oldModels.Room.find({});
  console.log(`Found ${oldRooms.length} rooms to migrate`);

  for (const oldRoom of oldRooms) {
    try {
      // Insert room
      await newDb.run(`
        INSERT OR REPLACE INTO rooms (
          id, name, avatar_url, author_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        oldRoom._id,
        oldRoom.name,
        oldRoom.avatarUrl,
        oldRoom.author,
        oldRoom.createdAt?.toISOString() || new Date().toISOString(),
        oldRoom.updatedAt?.toISOString() || new Date().toISOString()
      ]);

      // Insert participants
      if (oldRoom.participants && Array.isArray(oldRoom.participants)) {
        for (const participantId of oldRoom.participants) {
          try {
            await newDb.run(`
              INSERT OR REPLACE INTO room_participants (room_id, user_id)
              VALUES (?, ?)
            `, [oldRoom._id, participantId]);
          } catch (error) {
            console.error(`Error adding participant ${participantId} to room ${oldRoom._id}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(`Error migrating room ${oldRoom._id}:`, error.message);
    }
  }

  console.log('✅ Rooms migration completed');
}

async function migrateMessages(oldModels, newDb) {
  console.log('💌 Migrating messages...');
  
  const oldMessages = await oldModels.Message.find({});
  console.log(`Found ${oldMessages.length} messages to migrate`);

  for (const oldMessage of oldMessages) {
    try {
      await newDb.run(`
        INSERT OR REPLACE INTO messages (
          id, content, author_id, room_id, is_deleted, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        oldMessage._id,
        oldMessage.content,
        oldMessage.author,
        oldMessage.chatRoomId || oldMessage.room,
        oldMessage.isDeleted ? 1 : 0,
        oldMessage.createdAt?.toISOString() || new Date().toISOString(),
        oldMessage.updatedAt?.toISOString() || new Date().toISOString()
      ]);
    } catch (error) {
      console.error(`Error migrating message ${oldMessage._id}:`, error.message);
    }
  }

  console.log('✅ Messages migration completed');
}

async function main() {
  console.log('🚀 Starting migration from old MongoDB to new SQLite backend...');
  console.log(`Source: ${OLD_MONGO_URL}`);
  console.log(`Target: ${NEW_SQLITE_PATH}`);
  console.log('');

  try {
    // Connect to databases
    const oldModels = await connectToOldDatabase();
    const newDb = await connectToNewDatabase();

    // Run migrations
    await migrateUsers(oldModels, newDb);
    await migrateTodos(oldModels, newDb);
    await migrateRooms(oldModels, newDb);
    await migrateMessages(oldModels, newDb);

    // Close connections
    await mongoose.disconnect();
    await newDb.close();

    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('You can now start the new TypeScript backend.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
