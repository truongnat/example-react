import { DatabaseConfigService } from '@infrastructure/config/database.config';

export abstract class DatabaseConnection {
  protected config = DatabaseConfigService.getInstance();
  protected isConnected = false;

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract isHealthy(): Promise<boolean>;

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export class DatabaseConnectionFactory {
  static async create(): Promise<DatabaseConnection> {
    const config = DatabaseConfigService.getInstance();
    const dbType = config.getDatabaseType();

    switch (dbType) {
      case 'sqlite':
        const { SQLiteConnection } = await import('./SQLiteConnection');
        return new SQLiteConnection();

      case 'supabase':
        const { SupabaseConnection } = await import('./SupabaseConnection');
        return new SupabaseConnection();

      case 'postgres':
        const { PostgreSQLConnection } = await import('./PostgreSQLConnection');
        return new PostgreSQLConnection();

      case 'mongodb':
        const { MongoDBConnection } = await import('./MongoDBConnection');
        return new MongoDBConnection();

      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}
