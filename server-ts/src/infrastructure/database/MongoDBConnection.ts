import mongoose from 'mongoose';
import { DatabaseConnection } from './DatabaseConnection';

export class MongoDBConnection extends DatabaseConnection {
  async connect(): Promise<void> {
    try {
      const connectionString = this.config.getConnectionString();
      
      await mongoose.connect(connectionString, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      console.log('MongoDB database connected successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB database disconnected');
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return mongoose.connection.readyState === 1;
    } catch {
      return false;
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error('MongoDB not connected');
    }
    return mongoose;
  }
}
