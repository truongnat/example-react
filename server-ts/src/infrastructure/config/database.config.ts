import { DatabaseConfig } from '@shared/types/common.types';

export interface DatabaseConnectionConfig {
  type: 'sqlite' | 'supabase' | 'postgres' | 'mongodb';
  sqlite?: {
    path: string;
  };
  supabase?: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  postgres?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  mongodb?: {
    url: string;
  };
}

export class DatabaseConfigService {
  private static instance: DatabaseConfigService;
  private config: DatabaseConnectionConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): DatabaseConfigService {
    if (!DatabaseConfigService.instance) {
      DatabaseConfigService.instance = new DatabaseConfigService();
    }
    return DatabaseConfigService.instance;
  }

  private loadConfig(): DatabaseConnectionConfig {
    const dbType = (process.env.DATABASE_TYPE || 'sqlite') as DatabaseConnectionConfig['type'];

    const config: DatabaseConnectionConfig = {
      type: dbType,
    };

    switch (dbType) {
      case 'sqlite':
        config.sqlite = {
          path: process.env.SQLITE_DATABASE_PATH || './data/database.sqlite',
        };
        break;

      case 'supabase':
        config.supabase = {
          url: process.env.SUPABASE_URL || '',
          anonKey: process.env.SUPABASE_ANON_KEY || '',
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        };
        break;

      case 'postgres':
        config.postgres = {
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432'),
          database: process.env.POSTGRES_DATABASE || 'example_db',
          username: process.env.POSTGRES_USERNAME || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'password',
        };
        break;

      case 'mongodb':
        config.mongodb = {
          url: process.env.MONGO_URL || 'mongodb://localhost:27017/example-db',
        };
        break;

      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }

    return config;
  }

  public getConfig(): DatabaseConnectionConfig {
    return this.config;
  }

  public getDatabaseType(): DatabaseConnectionConfig['type'] {
    return this.config.type;
  }

  public getConnectionString(): string {
    switch (this.config.type) {
      case 'sqlite':
        return this.config.sqlite?.path || '';

      case 'supabase':
        return this.config.supabase?.url || '';

      case 'postgres':
        const pg = this.config.postgres!;
        return `postgresql://${pg.username}:${pg.password}@${pg.host}:${pg.port}/${pg.database}`;

      case 'mongodb':
        return this.config.mongodb?.url || '';

      default:
        throw new Error(`Cannot generate connection string for database type: ${this.config.type}`);
    }
  }
}
