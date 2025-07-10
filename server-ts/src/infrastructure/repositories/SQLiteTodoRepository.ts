import { Todo, TodoProps } from '@domain/entities/Todo';
import { ITodoRepository } from '@domain/repositories/ITodoRepository';
import { UUID, PaginationOptions, PaginatedResult } from '@shared/types/common.types';
import { TodoStatus } from '@shared/constants';
import { SQLiteConnection } from '@infrastructure/database/SQLiteConnection';

interface TodoRow {
  id: string;
  title: string;
  content: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export class SQLiteTodoRepository implements ITodoRepository {
  constructor(private readonly connection: SQLiteConnection) {}

  async create(todo: Todo): Promise<Todo> {
    const db = this.connection.getDatabase();
    const todoData = todo.toJSON();

    await db.run(`
      INSERT INTO todos (id, title, content, status, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      todoData.id,
      todoData.title,
      todoData.content,
      todoData.status,
      todoData.userId,
      todoData.createdAt.toISOString(),
      todoData.updatedAt.toISOString()
    ]);

    return todo;
  }

  async findById(id: UUID): Promise<Todo | null> {
    const db = this.connection.getDatabase();
    const row = await db.get<TodoRow>('SELECT * FROM todos WHERE id = ?', [id]);
    
    return row ? this.mapRowToTodo(row) : null;
  }

  async findByUserId(userId: UUID, options?: PaginationOptions): Promise<PaginatedResult<Todo>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options || {};
    const offset = (page - 1) * limit;

    const countResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE user_id = ?', [userId]);
    const total = countResult?.count || 0;

    const rows = await db.all<TodoRow[]>(`
      SELECT * FROM todos 
      WHERE user_id = ?
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    const todos = rows.map((row: TodoRow) => this.mapRowToTodo(row));

    return {
      data: todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByStatus(status: TodoStatus, options?: PaginationOptions): Promise<PaginatedResult<Todo>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options || {};
    const offset = (page - 1) * limit;

    const countResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE status = ?', [status]);
    const total = countResult?.count || 0;

    const rows = await db.all<TodoRow[]>(`
      SELECT * FROM todos 
      WHERE status = ?
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `, [status, limit, offset]);

    const todos = rows.map(row => this.mapRowToTodo(row));

    return {
      data: todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByUserIdAndStatus(userId: UUID, status: TodoStatus, options?: PaginationOptions): Promise<PaginatedResult<Todo>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options || {};
    const offset = (page - 1) * limit;

    const countResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND status = ?', [userId, status]);
    const total = countResult?.count || 0;

    const rows = await db.all<TodoRow[]>(`
      SELECT * FROM todos 
      WHERE user_id = ? AND status = ?
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `, [userId, status, limit, offset]);

    const todos = rows.map(row => this.mapRowToTodo(row));

    return {
      data: todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Todo>> {
    const db = this.connection.getDatabase();
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options || {};
    const offset = (page - 1) * limit;

    const countResult = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos');
    const total = countResult?.count || 0;

    const rows = await db.all<TodoRow[]>(`
      SELECT * FROM todos 
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const todos = rows.map(row => this.mapRowToTodo(row));

    return {
      data: todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(todo: Todo): Promise<Todo> {
    const db = this.connection.getDatabase();
    const todoData = todo.toJSON();

    await db.run(`
      UPDATE todos 
      SET title = ?, content = ?, status = ?, updated_at = ?
      WHERE id = ?
    `, [
      todoData.title,
      todoData.content,
      todoData.status,
      todoData.updatedAt.toISOString(),
      todoData.id
    ]);

    return todo;
  }

  async updateStatus(id: UUID, status: TodoStatus): Promise<void> {
    const db = this.connection.getDatabase();
    await db.run('UPDATE todos SET status = ?, updated_at = ? WHERE id = ?', [
      status,
      new Date().toISOString(),
      id
    ]);
  }

  async delete(id: UUID): Promise<void> {
    const db = this.connection.getDatabase();
    await db.run('DELETE FROM todos WHERE id = ?', [id]);
  }

  async exists(id: UUID): Promise<boolean> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE id = ?', [id]);
    return (result?.count || 0) > 0;
  }

  async existsByUserIdAndTitle(userId: UUID, title: string): Promise<boolean> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND title = ?', [userId, title]);
    return (result?.count || 0) > 0;
  }

  async count(): Promise<number> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos');
    return result?.count || 0;
  }

  async countByUserId(userId: UUID): Promise<number> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE user_id = ?', [userId]);
    return result?.count || 0;
  }

  async countByStatus(status: TodoStatus): Promise<number> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE status = ?', [status]);
    return result?.count || 0;
  }

  async countByUserIdAndStatus(userId: UUID, status: TodoStatus): Promise<number> {
    const db = this.connection.getDatabase();
    const result = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND status = ?', [userId, status]);
    return result?.count || 0;
  }

  private mapRowToTodo(row: TodoRow): Todo {
    const todoProps: TodoProps = {
      id: row.id,
      title: row.title,
      content: row.content,
      status: row.status as TodoStatus,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };

    return Todo.fromPersistence(todoProps);
  }
}
