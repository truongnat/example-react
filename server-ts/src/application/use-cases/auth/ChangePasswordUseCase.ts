import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ChangePasswordRequestDto } from '@application/dtos/auth.dto';
import { UnauthorizedException, ValidationException, NotFoundException } from '@shared/exceptions';
import { UUID } from '@shared/types/common.types';
import { MIN_LENGTH_PASS } from '@shared/constants';

export interface ChangePasswordResponseDto {
  message: string;
}

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(userId: UUID, request: ChangePasswordRequestDto): Promise<ChangePasswordResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find user by ID
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.passwordService.compare(
      request.currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is different from current password
    const isSamePassword = await this.passwordService.compare(
      request.newPassword,
      user.password
    );
    if (isSamePassword) {
      throw new ValidationException('New password must be different from current password');
    }

    // Hash new password
    const hashedNewPassword = await this.passwordService.hash(request.newPassword);

    // Update user password
    user.changePassword(hashedNewPassword);

    // Save updated user
    await this.userRepository.update(user);

    return {
      message: 'Password changed successfully',
    };
  }

  private validateRequest(request: ChangePasswordRequestDto): void {
    const errors: string[] = [];

    if (!request.currentPassword || request.currentPassword.length === 0) {
      errors.push('Current password is required');
    }

    if (!request.newPassword || request.newPassword.length < MIN_LENGTH_PASS) {
      errors.push(`New password must be at least ${MIN_LENGTH_PASS} characters long`);
    }

    if (request.newPassword && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(request.newPassword)) {
      errors.push('New password must contain at least one lowercase letter, one uppercase letter, and one number');
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
