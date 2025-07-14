/**
 * JWT Token Utilities for Client-Side Token Management
 * 
 * This module provides utilities for handling JWT tokens on the client side,
 * including decoding, expiration checking, and validation without server verification.
 * 
 * Note: These utilities only decode and validate token structure and expiration.
 * They do NOT verify token signatures - that's done on the server side.
 */

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  tokenVersion: number;
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration (timestamp)
}

export interface TokenInfo {
  payload: JWTPayload;
  isExpired: boolean;
  expiresAt: Date;
  issuedAt: Date;
  timeUntilExpiry: number; // milliseconds
  isNearExpiry: boolean; // expires within 5 minutes
}

/**
 * Decodes a JWT token without verification
 * This is safe for client-side use as we only extract payload information
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // JWT has 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    // Validate required fields
    if (!parsedPayload.userId || !parsedPayload.exp || !parsedPayload.iat) {
      console.warn('JWT payload missing required fields:', parsedPayload);
      return null;
    }

    return parsedPayload as JWTPayload;
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true; // Consider invalid tokens as expired
  }

  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  return payload.exp <= now;
}

/**
 * Gets comprehensive token information
 */
export function getTokenInfo(token: string): TokenInfo | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  const now = Date.now();
  const nowSeconds = Math.floor(now / 1000);
  
  const expiresAt = new Date(payload.exp * 1000);
  const issuedAt = new Date(payload.iat * 1000);
  const timeUntilExpiry = (payload.exp * 1000) - now;
  const isExpired = payload.exp <= nowSeconds;
  
  // Consider token near expiry if it expires within 5 minutes
  const fiveMinutesInMs = 5 * 60 * 1000;
  const isNearExpiry = timeUntilExpiry <= fiveMinutesInMs && timeUntilExpiry > 0;

  return {
    payload,
    isExpired,
    expiresAt,
    issuedAt,
    timeUntilExpiry,
    isNearExpiry,
  };
}

/**
 * Checks if a token needs to be refreshed
 * Returns true if token is expired or will expire within the specified threshold
 */
export function shouldRefreshToken(
  token: string, 
  thresholdMinutes: number = 5
): boolean {
  const tokenInfo = getTokenInfo(token);
  if (!tokenInfo) {
    return true; // Invalid token should be refreshed
  }

  if (tokenInfo.isExpired) {
    return true; // Expired token should be refreshed
  }

  const thresholdMs = thresholdMinutes * 60 * 1000;
  return tokenInfo.timeUntilExpiry <= thresholdMs;
}

/**
 * Gets the time remaining until token expiration in a human-readable format
 */
export function getTimeUntilExpiry(token: string): string {
  const tokenInfo = getTokenInfo(token);
  if (!tokenInfo) {
    return 'Invalid token';
  }

  if (tokenInfo.isExpired) {
    return 'Expired';
  }

  const ms = tokenInfo.timeUntilExpiry;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}

/**
 * Validates token structure and basic requirements
 */
export function isValidTokenStructure(token: string): boolean {
  try {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Try to decode payload
    const payload = decodeJWT(token);
    if (!payload) {
      return false;
    }

    // Check required fields
    const requiredFields = ['userId', 'email', 'username', 'tokenVersion', 'iat', 'exp'];
    for (const field of requiredFields) {
      if (!(field in payload)) {
        return false;
      }
    }

    // Check that exp is in the future relative to iat
    if (payload.exp <= payload.iat) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Compares two tokens to see if they're the same
 */
export function areTokensEqual(token1: string | null, token2: string | null): boolean {
  if (!token1 && !token2) return true;
  if (!token1 || !token2) return false;
  return token1 === token2;
}

/**
 * Gets token expiration warning message based on time remaining
 */
export function getExpirationWarning(token: string): string | null {
  const tokenInfo = getTokenInfo(token);
  if (!tokenInfo) {
    return 'Your session is invalid. Please log in again.';
  }

  if (tokenInfo.isExpired) {
    return 'Your session has expired. Please log in again.';
  }

  if (tokenInfo.isNearExpiry) {
    const timeLeft = getTimeUntilExpiry(token);
    return `Your session will expire in ${timeLeft}. Please save your work.`;
  }

  return null;
}

/**
 * Token expiration event types for monitoring
 */
export enum TokenExpirationEvent {
  EXPIRED = 'expired',
  NEAR_EXPIRY = 'near_expiry',
  REFRESHED = 'refreshed',
  INVALID = 'invalid',
}

/**
 * Token monitoring configuration
 */
export interface TokenMonitorConfig {
  checkInterval: number; // milliseconds
  warningThreshold: number; // minutes before expiry to show warning
  autoRefreshThreshold: number; // minutes before expiry to auto-refresh
  onTokenExpired?: () => void;
  onTokenNearExpiry?: (timeLeft: string) => void;
  onTokenRefreshed?: () => void;
  onTokenInvalid?: () => void;
}

/**
 * Default token monitoring configuration
 */
export const DEFAULT_TOKEN_MONITOR_CONFIG: TokenMonitorConfig = {
  checkInterval: 30 * 1000, // Check every 30 seconds
  warningThreshold: 5, // Warn 5 minutes before expiry
  autoRefreshThreshold: 2, // Auto-refresh 2 minutes before expiry
};
