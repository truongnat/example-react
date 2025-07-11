import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPasswordService } from '@application/interfaces/IPasswordService';
import { ITokenService } from '@application/interfaces/ITokenService';
import { RegisterRequestDto, RegisterResponseDto } from '@application/dtos/auth.dto';
import { ConflictException, ValidationException } from '@shared/exceptions';
import { REGEX_EMAIL, MIN_LENGTH_PASS } from '@shared/constants';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    // Validate input
    await this.validateRequest(request);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(request.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(request.password);

    // Create user
    const user = User.create({
      username: request.username,
      email: request.email,
      password: hashedPassword,
      avatarUrl: request.avatarUrl || '',
    });

    // Save user
    const savedUser = await this.userRepository.create(user);

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair({
      userId: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
    });

    return {
      user: savedUser.toPublicJSON(),
      tokens,
    };
  }

  private async validateRequest(request: RegisterRequestDto): Promise<void> {
    const errors: string[] = [];

    if (!request.username || request.username.trim().length < 2) {
      errors.push('Username must be at least 2 characters long');
    }

    if (!request.email || !REGEX_EMAIL.test(request.email)) {
      errors.push('Invalid email format');
    }

    if (!request.password || request.password.length < MIN_LENGTH_PASS) {
      errors.push(`Password must be at least ${MIN_LENGTH_PASS} characters long`);
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }
  }
}
