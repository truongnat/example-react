import { User, UserProps } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';
import { SQLiteConnection } from '@infrastructure/database/SQLiteConnection';
import { DEFAULT_AVATAR } from '@shared/constants';

interface UserRow {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar_url: string | null;
  is_active: number;
  is_online: number;
  otp: string | null;
  otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export class SQLiteUserRepository implements IUserRepository {
  constructor(private readonly connection: SQLiteConnection) {}

  async create(user: User): Promise<User> {
    const db = this.connection.getDatabase();
    const userData = user.toJSON();

    await db.run(`
      INSERT INTO users (id, username, email, password, avatar_url, is_active, is_online, otp, otp_expires_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userData.id,
      userData.username,
      userData.email,
      userData.password,
      userData.avatarUrl,
      userData.isActive ? 1 : 0,
      userData.isOnline ? 1 : 0,
      userData.otp || null,
      userData.otpExpiresAt?.toISOString() || null,
      userData.createdAt.toISOString(),
      userData.updatedAt.toISOString()
    ]);

    return user;
  }

  async findById(id: UUID): Promise<User | null> {
    const db = this.connection.getDatabase();
    const row = await db.get<UserRow>('SELECT * FROM users WHERE id = ?', [id]);

    return row ? this.mapRowToUser(row) : null;
  }

  async findByIds(ids: UUID[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    const db = this.connection.getDatabase();
    const placeholders = ids.map(() => '?').join(',');
    const rows = await db.all<UserRow[]>(
      `SELECT * FROM users WHERE id IN (${placeholders})`,
      ids
    );

    return rows.map(row => this.mapRowToUser(row));
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.connection.getDatabase();
    const row = await db.get<UserRow>('SELECT * FROM users WHERE email = ?', [email]);
    
    return row ? this.mapRowToUser(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const db = this.connection.getDatabase();
    const row = await db.get<UserRow>('SELECT * FROM users WHERE username = ?', [username]);
    
    return row ? this.mapRowToUser(row) : null;
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options || {};
    const offset = (page - 1) * limit;

    const countResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users');
    const total = countResult?.count || 0;

    const rows = await db.all<UserRow[]>(`
      SELECT * FROM users 
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const users = rows.map((row: UserRow) => this.mapRowToUser(row));

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findActiveUsers(options?: PaginationOptions, excludeUserIds?: UUID[]): Promise<PaginatedResult<User>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options || {};
    const offset = (page - 1) * limit;

    // Build WHERE clause with exclusions
    let whereClause = 'WHERE is_active = 1';
    const params: any[] = [];

    if (excludeUserIds && excludeUserIds.length > 0) {
      const placeholders = excludeUserIds.map(() => '?').join(',');
      whereClause += ` AND id NOT IN (${placeholders})`;
      params.push(...excludeUserIds);
    }

    const countResult = await db.get<{ count: number }>(`SELECT COUNT(*) as count FROM users ${whereClause}`, params);
    const total = countResult?.count || 0;

    const rows = await db.all<UserRow[]>(`
      SELECT * FROM users
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const users = rows.map(row => this.mapRowToUser(row));

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOnlineUsers(): Promise<User[]> {
    const db = this.connection.getDatabase();
    const rows = await db.all<UserRow[]>('SELECT * FROM users WHERE is_online = 1 AND is_active = 1');

    return rows.map((row: UserRow) => this.mapRowToUser(row));
  }

  async searchUsers(query: string, options?: PaginationOptions, excludeUserIds?: UUID[]): Promise<PaginatedResult<User>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'username', sortOrder = 'asc' } = options || {};
    const offset = (page - 1) * limit;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['username', 'email', 'created_at', 'updated_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'username';
    const safeSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Search in username and email (case-insensitive)
    const searchPattern = `%${query}%`;

    // Build WHERE clause with exclusions
    let whereClause = 'WHERE is_active = 1 AND (username LIKE ? OR email LIKE ?)';
    const params: any[] = [searchPattern, searchPattern];

    if (excludeUserIds && excludeUserIds.length > 0) {
      const placeholders = excludeUserIds.map(() => '?').join(',');
      whereClause += ` AND id NOT IN (${placeholders})`;
      params.push(...excludeUserIds);
    }

    const countResult = await db.get<{ count: number }>(`
      SELECT COUNT(*) as count FROM users
      ${whereClause}
    `, params);

    const total = countResult?.count || 0;

    const rows = await db.all<UserRow[]>(`
      SELECT * FROM users
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const users = rows.map(row => this.mapRowToUser(row));

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(user: User): Promise<User> {
    const db = this.connection.getDatabase();
    const userData = user.toJSON();

    await db.run(`
      UPDATE users 
      SET username = ?, email = ?, password = ?, avatar_url = ?, is_active = ?, is_online = ?, 
          otp = ?, otp_expires_at = ?, updated_at = ?
      WHERE id = ?
    `, [
      userData.username,
      userData.email,
      userData.password,
      userData.avatarUrl,
      userData.isActive ? 1 : 0,
      userData.isOnline ? 1 : 0,
      userData.otp || null,
      userData.otpExpiresAt?.toISOString() || null,
      userData.updatedAt.toISOString(),
      userData.id
    ]);

    return user;
  }

  async updateOnlineStatus(userId: UUID, isOnline: boolean): Promise<void> {
    const db = this.connection.getDatabase();
    await db.run('UPDATE users SET is_online = ?, updated_at = ? WHERE id = ?', [
      isOnline ? 1 : 0,
      new Date().toISOString(),
      userId
    ]);
  }

  async delete(id: UUID): Promise<void> {
    const db = this.connection.getDatabase();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
  }

  async softDelete(id: UUID): Promise<void> {
    const db = this.connection.getDatabase();
    await db.run('UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?', [
      new Date().toISOString(),
      id
    ]);
  }

  async exists(id: UUID): Promise<boolean> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users WHERE id = ?', [id]);
    return (result?.count || 0) > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users WHERE email = ?', [email]);
    return (result?.count || 0) > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users WHERE username = ?', [username]);
    return (result?.count || 0) > 0;
  }

  async count(): Promise<number> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users');
    return result?.count || 0;
  }

  private mapRowToUser(row: UserRow): User {
    const userProps: Partial<UserProps> = {
      id: row.id,
      username: row.username,
      email: row.email,
      password: row.password,
      avatarUrl: row.avatar_url || DEFAULT_AVATAR,
      isActive: Boolean(row.is_active),
      isOnline: Boolean(row.is_online),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };

    if (row.otp) {
      userProps.otp = row.otp;
    }
    if (row.otp_expires_at) {
      userProps.otpExpiresAt = new Date(row.otp_expires_at);
    }

    return User.fromPersistence(userProps as UserProps);
  }
}
