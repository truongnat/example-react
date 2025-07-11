import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService, TokenPair } from '@application/interfaces/ITokenService';
import { JWTPayload } from '@shared/types/common.types';
import { UnauthorizedException } from '@shared/exceptions';

export class TokenService implements ITokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
    this.accessTokenExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async generateTokenPair(payload: JWTPayload): Promise<TokenPair> {
    const accessToken = jwt.sign(
      payload as object,
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiresIn } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      payload as object,
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiresIn } as jwt.SignOptions
    );

    // Calculate expiration time in seconds
    const decoded = jwt.decode(accessToken) as any;
    const expiresIn = decoded.exp - decoded.iat;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Access token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid access token');
      }
      throw new UnauthorizedException('Token verification failed');
    }
  }

  async verifyRefreshToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('Refresh token verification failed');
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken);
    
    // Create new payload without JWT specific fields
    const newPayload: JWTPayload = {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    };

    return this.generateTokenPair(newPayload);
  }
}
