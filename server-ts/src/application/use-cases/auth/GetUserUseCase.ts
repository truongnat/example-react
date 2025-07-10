import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserProfileDto } from '@application/dtos/auth.dto';
import { NotFoundException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UUID): Promise<UserProfileDto> {
    // Find user by ID
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new NotFoundException('User account is deactivated');
    }

    // Return public user data
    return user.toPublicJSON();
  }
}
