import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserProfileDto } from '@application/dtos/auth.dto';
import { NotFoundException, ConflictException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';

export interface UpdateUserRequestDto {
  username?: string;
  avatarUrl?: string;
}

export interface UpdateUserResponseDto {
  user: UserProfileDto;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UUID, request: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find user by ID
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new NotFoundException('User account is deactivated');
    }

    // Check if username is being changed and if it conflicts with existing users
    if (request.username && request.username !== user.username) {
      const existingUser = await this.userRepository.findByUsername(request.username);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username already exists');
      }
    }

    // Update user profile
    user.updateProfile(request.username, request.avatarUrl);

    // Save updated user
    const updatedUser = await this.userRepository.update(user);

    return {
      user: updatedUser.toPublicJSON(),
    };
  }

  private validateRequest(request: UpdateUserRequestDto): void {
    if (request.username === undefined && request.avatarUrl === undefined) {
      throw new Error('At least one field must be provided for update');
    }

    if (request.username !== undefined) {
      if (typeof request.username !== 'string') {
        throw new Error('Username must be a string');
      }
      if (request.username.trim().length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }
      if (request.username.trim().length > 50) {
        throw new Error('Username must be less than 50 characters');
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(request.username.trim())) {
        throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
      }
    }

    if (request.avatarUrl !== undefined) {
      if (typeof request.avatarUrl !== 'string') {
        throw new Error('Avatar URL must be a string');
      }
      if (request.avatarUrl.trim() && !this.isValidUrl(request.avatarUrl.trim())) {
        throw new Error('Avatar URL must be a valid URL');
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
