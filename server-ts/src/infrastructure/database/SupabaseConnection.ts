import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseConnection } from './DatabaseConnection';

export class SupabaseConnection extends DatabaseConnection {
  private client: SupabaseClient | null = null;

  async connect(): Promise<void> {
    try {
      const config = this.config.getConfig();
      
      if (!config.supabase?.url || !config.supabase?.serviceRoleKey) {
        throw new Error('Supabase configuration is missing');
      }

      this.client = createClient(
        config.supabase.url,
        config.supabase.serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // Test connection
      const { error } = await this.client.from('users').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is fine for initial setup
        throw error;
      }

      this.isConnected = true;
      console.log('Supabase database connected successfully');
    } catch (error) {
      console.error('Failed to connect to Supabase database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      // Supabase client doesn't need explicit disconnection
      this.client = null;
      this.isConnected = false;
      console.log('Supabase database disconnected');
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      const { error } = await this.client.from('users').select('count', { count: 'exact', head: true });
      return !error || error.code === 'PGRST116';
    } catch {
      return false;
    }
  }

  public getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not connected');
    }
    return this.client;
  }
}
