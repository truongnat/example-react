import { ITokenService } from '@application/interfaces/ITokenService';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from '@application/dtos/auth.dto';
import { UnauthorizedException } from '@shared/exceptions';

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    this.validateRequest(request);

    try {
      // Verify the refresh token and get payload
      const payload = await this.tokenService.verifyRefreshToken(request.refreshToken);

      // Check if user still exists and is active
      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Check if token version matches (for token revocation)
      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token has been revoked');
      }

      // Generate new token pair with current token version
      const tokens = await this.tokenService.generateTokenPair({
        userId: user.id,
        email: user.email,
        username: user.username,
        tokenVersion: user.tokenVersion,
      });

      return { tokens };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private validateRequest(request: RefreshTokenRequestDto): void {
    if (!request.refreshToken || typeof request.refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token is required');
    }
  }
}
