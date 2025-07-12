import { User, UserProps } from '@domain/entities/User';
import { UUID } from '@shared/types/common.types';

export interface UserFactoryOptions {
  id?: UUID;
  username?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  isActive?: boolean;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserFactory {
  private static defaultProps: Partial<UserProps> = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword123',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  static create(options: UserFactoryOptions = {}): User {
    const props = {
      ...this.defaultProps,
      ...options,
    };

    const user = User.create(props as any);
    
    // Set additional properties if provided
    if (options.id) {
      (user as any)._id = options.id;
    }
    
    if (options.isActive === false) {
      user.deactivate();
    }
    
    if (options.isOnline !== undefined) {
      user.setOnlineStatus(options.isOnline);
    }
    
    if (options.createdAt) {
      (user as any)._createdAt = options.createdAt;
    }
    
    if (options.updatedAt) {
      (user as any)._updatedAt = options.updatedAt;
    }

    return user;
  }

  static createMany(count: number, options: UserFactoryOptions = {}): User[] {
    return Array.from({ length: count }, (_, index) => 
      this.create({
        ...options,
        username: `${options.username || 'testuser'}${index + 1}`,
        email: `${options.email?.split('@')[0] || 'test'}${index + 1}@${options.email?.split('@')[1] || 'example.com'}`,
      })
    );
  }

  static createAdmin(options: UserFactoryOptions = {}): User {
    return this.create({
      ...options,
      username: 'admin',
      email: 'admin@example.com',
    });
  }

  static createInactive(options: UserFactoryOptions = {}): User {
    return this.create({
      ...options,
      isActive: false,
    });
  }

  static createOnline(options: UserFactoryOptions = {}): User {
    return this.create({
      ...options,
      isOnline: true,
    });
  }

  static createOffline(options: UserFactoryOptions = {}): User {
    return this.create({
      ...options,
      isOnline: false,
    });
  }
}
