import { Database } from 'sqlite';
import { Room } from '@domain/entities/Room';
import { IRoomRepository } from '@domain/repositories/IRoomRepository';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';

export class SQLiteRoomRepository implements IRoomRepository {
  constructor(private readonly db: Database) {}

  async create(room: Room): Promise<Room> {
    const roomData = room.toJSON();
    
    await this.db.run(
      `INSERT INTO rooms (id, name, avatar_url, author_id, last_message_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        roomData.id,
        roomData.name,
        roomData.avatarUrl,
        roomData.authorId,
        roomData.lastMessageId,
        roomData.createdAt.toISOString(),
        roomData.updatedAt.toISOString(),
      ]
    );

    // Add author as participant
    await this.addParticipant(roomData.id, roomData.authorId);

    return room;
  }

  async findById(id: UUID): Promise<Room | null> {
    const row = await this.db.get(
      'SELECT * FROM rooms WHERE id = ?',
      [id]
    );

    if (!row) {
      return null;
    }

    // Get participants
    const participants = await this.getParticipants(id);

    return Room.fromPersistence({
      id: row.id,
      name: row.name,
      avatarUrl: row.avatar_url,
      authorId: row.author_id,
      lastMessageId: row.last_message_id,
      participants,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findByAuthorId(authorId: UUID, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<Room>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT * FROM rooms WHERE author_id = ? 
       ORDER BY updated_at DESC 
       LIMIT ? OFFSET ?`,
      [authorId, options.limit, offset]
    );

    const total = await this.db.get(
      'SELECT COUNT(*) as count FROM rooms WHERE author_id = ?',
      [authorId]
    );

    const rooms = await Promise.all(
      rows.map(async (row: any) => {
        const participants = await this.getParticipants(row.id);
        return Room.fromPersistence({
          id: row.id,
          name: row.name,
          avatarUrl: row.avatar_url,
          authorId: row.author_id,
          lastMessageId: row.last_message_id,
          participants,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        });
      })
    );

    return {
      data: rooms,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async findByParticipant(userId: UUID, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<Room>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT r.* FROM rooms r
       INNER JOIN room_participants rp ON r.id = rp.room_id
       WHERE rp.user_id = ?
       ORDER BY r.updated_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, options.limit, offset]
    );

    const total = await this.db.get(
      `SELECT COUNT(*) as count FROM rooms r
       INNER JOIN room_participants rp ON r.id = rp.room_id
       WHERE rp.user_id = ?`,
      [userId]
    );

    const rooms = await Promise.all(
      rows.map(async (row: any) => {
        const participants = await this.getParticipants(row.id);
        return Room.fromPersistence({
          id: row.id,
          name: row.name,
          avatarUrl: row.avatar_url,
          authorId: row.author_id,
          lastMessageId: row.last_message_id,
          participants,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        });
      })
    );

    return {
      data: rooms,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async findAll(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<Room>> {
    const offset = (options.page - 1) * options.limit;
    
    const rows = await this.db.all(
      `SELECT * FROM rooms 
       ORDER BY updated_at DESC 
       LIMIT ? OFFSET ?`,
      [options.limit, offset]
    );

    const total = await this.db.get('SELECT COUNT(*) as count FROM rooms');

    const rooms = await Promise.all(
      rows.map(async (row: any) => {
        const participants = await this.getParticipants(row.id);
        return Room.fromPersistence({
          id: row.id,
          name: row.name,
          avatarUrl: row.avatar_url,
          authorId: row.author_id,
          lastMessageId: row.last_message_id,
          participants,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        });
      })
    );

    return {
      data: rooms,
      total: total.count,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total.count / options.limit),
    };
  }

  async update(room: Room): Promise<Room> {
    const roomData = room.toJSON();
    
    await this.db.run(
      `UPDATE rooms 
       SET name = ?, avatar_url = ?, last_message_id = ?, updated_at = ?
       WHERE id = ?`,
      [
        roomData.name,
        roomData.avatarUrl,
        roomData.lastMessageId,
        roomData.updatedAt.toISOString(),
        roomData.id,
      ]
    );

    // Update participants
    await this.updateParticipants(roomData.id, roomData.participants);

    return room;
  }

  async addParticipant(roomId: UUID, userId: UUID): Promise<void> {
    await this.db.run(
      `INSERT OR IGNORE INTO room_participants (room_id, user_id, joined_at)
       VALUES (?, ?, ?)`,
      [roomId, userId, new Date().toISOString()]
    );
  }

  async removeParticipant(roomId: UUID, userId: UUID): Promise<void> {
    await this.db.run(
      'DELETE FROM room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
  }

  async updateLastMessage(roomId: UUID, messageId: UUID): Promise<void> {
    await this.db.run(
      'UPDATE rooms SET last_message_id = ?, updated_at = ? WHERE id = ?',
      [messageId, new Date().toISOString(), roomId]
    );
  }

  async delete(id: UUID): Promise<void> {
    // Delete participants first
    await this.db.run('DELETE FROM room_participants WHERE room_id = ?', [id]);
    
    // Delete room
    await this.db.run('DELETE FROM rooms WHERE id = ?', [id]);
  }

  async exists(id: UUID): Promise<boolean> {
    const row = await this.db.get('SELECT 1 FROM rooms WHERE id = ?', [id]);
    return !!row;
  }

  async existsByName(name: string): Promise<boolean> {
    const row = await this.db.get('SELECT 1 FROM rooms WHERE name = ?', [name]);
    return !!row;
  }

  async isParticipant(roomId: UUID, userId: UUID): Promise<boolean> {
    const row = await this.db.get(
      'SELECT 1 FROM room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    return !!row;
  }

  async count(): Promise<number> {
    const row = await this.db.get('SELECT COUNT(*) as count FROM rooms');
    return row.count;
  }

  async countByAuthorId(authorId: UUID): Promise<number> {
    const row = await this.db.get(
      'SELECT COUNT(*) as count FROM rooms WHERE author_id = ?',
      [authorId]
    );
    return row.count;
  }

  private async getParticipants(roomId: UUID): Promise<UUID[]> {
    const rows = await this.db.all(
      'SELECT user_id FROM room_participants WHERE room_id = ?',
      [roomId]
    );
    return rows.map((row: any) => row.user_id);
  }

  private async updateParticipants(roomId: UUID, participants: UUID[]): Promise<void> {
    // Remove all current participants
    await this.db.run('DELETE FROM room_participants WHERE room_id = ?', [roomId]);
    
    // Add new participants
    for (const userId of participants) {
      await this.addParticipant(roomId, userId);
    }
  }
}
