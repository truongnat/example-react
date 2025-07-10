import { Database } from 'sqlite';
import { Message } from '@domain/entities/Message';
import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';

export class SQLiteMessageRepository implements IMessageRepository {
  constructor(private readonly db: Database) {}

  async create(message: Message): Promise<Message> {
    const messageData = message.toJSON();
    
    await this.db.run(
      `INSERT INTO messages (id, content, author_id, room_id, is_deleted, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        messageData.id,
        messageData.content,
        messageData.authorId,
        messageData.roomId,
        messageData.isDeleted ? 1 : 0,
        messageData.createdAt.toISOString(),
        messageData.updatedAt.toISOString(),
      ]
    );

    return message;
  }

  async findById(id: UUID): Promise<Message | null> {
    const row = await this.db.get(
      'SELECT * FROM messages WHERE id = ?',
      [id]
    );

    if (!row) {
      return null;
    }

    return Message.fromPersistence({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      roomId: row.room_id,
      isDeleted: !!row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findByRoomId(roomId: UUID, options: PaginationOptions = { page: 1, limit: 50 }): Promise<PaginatedResult<Message>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT * FROM messages 
       WHERE room_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [roomId, options.limit, offset]
    );

    const total = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE room_id = ?',
      [roomId]
    );

    const messages = rows.map((row: any) => Message.fromPersistence({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      roomId: row.room_id,
      isDeleted: !!row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return {
      data: messages,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async findByAuthorId(authorId: UUID, options: PaginationOptions = { page: 1, limit: 50 }): Promise<PaginatedResult<Message>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT * FROM messages 
       WHERE author_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [authorId, options.limit, offset]
    );

    const total = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE author_id = ?',
      [authorId]
    );

    const messages = rows.map((row: any) => Message.fromPersistence({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      roomId: row.room_id,
      isDeleted: !!row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return {
      data: messages,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async findByRoomIdAndAuthorId(roomId: UUID, authorId: UUID, options: PaginationOptions = { page: 1, limit: 50 }): Promise<PaginatedResult<Message>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT * FROM messages 
       WHERE room_id = ? AND author_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [roomId, authorId, options.limit, offset]
    );

    const total = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE room_id = ? AND author_id = ?',
      [roomId, authorId]
    );

    const messages = rows.map((row: any) => Message.fromPersistence({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      roomId: row.room_id,
      isDeleted: !!row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return {
      data: messages,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async findVisibleByRoomId(roomId: UUID, options: PaginationOptions = { page: 1, limit: 50 }): Promise<PaginatedResult<Message>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT * FROM messages 
       WHERE room_id = ? AND is_deleted = 0 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [roomId, options.limit, offset]
    );

    const total = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE room_id = ? AND is_deleted = 0',
      [roomId]
    );

    const messages = rows.map((row: any) => Message.fromPersistence({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      roomId: row.room_id,
      isDeleted: !!row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return {
      data: messages,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async findLatestByRoomId(roomId: UUID): Promise<Message | null> {
    const row = await this.db.get(
      `SELECT * FROM messages 
       WHERE room_id = ? AND is_deleted = 0 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [roomId]
    );

    if (!row) {
      return null;
    }

    return Message.fromPersistence({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      roomId: row.room_id,
      isDeleted: !!row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async update(message: Message): Promise<Message> {
    const messageData = message.toJSON();
    
    await this.db.run(
      `UPDATE messages 
       SET content = ?, is_deleted = ?, updated_at = ?
       WHERE id = ?`,
      [
        messageData.content,
        messageData.isDeleted ? 1 : 0,
        messageData.updatedAt.toISOString(),
        messageData.id,
      ]
    );

    return message;
  }

  async markAsDeleted(id: UUID): Promise<void> {
    await this.db.run(
      'UPDATE messages SET is_deleted = 1, updated_at = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  async restore(id: UUID): Promise<void> {
    await this.db.run(
      'UPDATE messages SET is_deleted = 0, updated_at = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  async delete(id: UUID): Promise<void> {
    await this.db.run('DELETE FROM messages WHERE id = ?', [id]);
  }

  async exists(id: UUID): Promise<boolean> {
    const row = await this.db.get('SELECT 1 FROM messages WHERE id = ?', [id]);
    return !!row;
  }

  async count(): Promise<number> {
    const row = await this.db.get('SELECT COUNT(*) as count FROM messages');
    return row.count;
  }

  async countByRoomId(roomId: UUID): Promise<number> {
    const row = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE room_id = ?',
      [roomId]
    );
    return row.count;
  }

  async countByAuthorId(authorId: UUID): Promise<number> {
    const row = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE author_id = ?',
      [authorId]
    );
    return row.count;
  }

  async countVisibleByRoomId(roomId: UUID): Promise<number> {
    const row = await this.db.get(
      'SELECT COUNT(*) as count FROM messages WHERE room_id = ? AND is_deleted = 0',
      [roomId]
    );
    return row.count;
  }
}
