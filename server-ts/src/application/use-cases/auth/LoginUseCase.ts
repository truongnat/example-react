import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ITokenService } from '@application/interfaces/ITokenService';
import { LoginRequestDto, LoginResponseDto } from '@application/dtos/auth.dto';
import { UnauthorizedException, ValidationException } from '@shared/exceptions';
import { REGEX_EMAIL } from '@shared/constants';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    // Validate input
    this.validateRequest(request);

    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update online status
    user.setOnlineStatus(true);
    await this.userRepository.update(user);

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: user.toPublicJSON(),
      tokens,
    };
  }

  private validateRequest(request: LoginRequestDto): void {
    const errors: string[] = [];

    if (!request.email || !REGEX_EMAIL.test(request.email)) {
      errors.push('Invalid email format');
    }

    if (!request.password || request.password.length === 0) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
