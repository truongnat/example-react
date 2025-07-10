import { UUID, JWTPayload } from '@shared/types/common.types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ITokenService {
  generateTokenPair(payload: JWTPayload): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<JWTPayload>;
  verifyRefreshToken(token: string): Promise<JWTPayload>;
  refreshTokens(refreshToken: string): Promise<TokenPair>;
}
