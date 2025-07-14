/**
 * Tests for JWT Token Utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  decodeJWT,
  isTokenExpired,
  getTokenInfo,
  shouldRefreshToken,
  getTimeUntilExpiry,
  isValidTokenStructure,
  areTokensEqual,
  getExpirationWarning,
  TokenExpirationEvent,
} from '../token-utils';

// Mock JWT tokens for testing
const createMockToken = (payload: any): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

describe('Token Utils', () => {
  const now = Math.floor(Date.now() / 1000);
  const validPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    tokenVersion: 1,
    iat: now - 3600, // Issued 1 hour ago
    exp: now + 3600, // Expires in 1 hour
  };

  const expiredPayload = {
    ...validPayload,
    exp: now - 300, // Expired 5 minutes ago
  };

  const nearExpiryPayload = {
    ...validPayload,
    exp: now + 240, // Expires in 4 minutes
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('decodeJWT', () => {
    it('should decode a valid JWT token', () => {
      const token = createMockToken(validPayload);
      const decoded = decodeJWT(token);
      
      expect(decoded).toEqual(validPayload);
    });

    it('should return null for invalid token format', () => {
      expect(decodeJWT('invalid-token')).toBeNull();
      expect(decodeJWT('invalid.token')).toBeNull();
      expect(decodeJWT('')).toBeNull();
      expect(decodeJWT(null as any)).toBeNull();
    });

    it('should return null for token with invalid payload', () => {
      const invalidToken = 'header.invalid-base64.signature';
      expect(decodeJWT(invalidToken)).toBeNull();
    });

    it('should return null for token missing required fields', () => {
      const incompletePayload = { userId: 'user-123' }; // Missing exp, iat
      const token = createMockToken(incompletePayload);
      expect(decodeJWT(token)).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const token = createMockToken(validPayload);
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const token = createMockToken(expiredPayload);
      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
      expect(isTokenExpired('')).toBe(true);
    });
  });

  describe('getTokenInfo', () => {
    it('should return complete token info for valid token', () => {
      const token = createMockToken(validPayload);
      const info = getTokenInfo(token);
      
      expect(info).toBeDefined();
      expect(info!.payload).toEqual(validPayload);
      expect(info!.isExpired).toBe(false);
      expect(info!.expiresAt).toBeInstanceOf(Date);
      expect(info!.issuedAt).toBeInstanceOf(Date);
      expect(info!.timeUntilExpiry).toBeGreaterThan(0);
      expect(info!.isNearExpiry).toBe(false);
    });

    it('should detect near expiry tokens', () => {
      const token = createMockToken(nearExpiryPayload);
      const info = getTokenInfo(token);
      
      expect(info!.isNearExpiry).toBe(true);
      expect(info!.isExpired).toBe(false);
    });

    it('should detect expired tokens', () => {
      const token = createMockToken(expiredPayload);
      const info = getTokenInfo(token);
      
      expect(info!.isExpired).toBe(true);
      expect(info!.timeUntilExpiry).toBeLessThan(0);
    });

    it('should return null for invalid token', () => {
      expect(getTokenInfo('invalid-token')).toBeNull();
    });
  });

  describe('shouldRefreshToken', () => {
    it('should return false for token with plenty of time left', () => {
      const token = createMockToken(validPayload);
      expect(shouldRefreshToken(token, 5)).toBe(false);
    });

    it('should return true for token near expiry', () => {
      const token = createMockToken(nearExpiryPayload);
      expect(shouldRefreshToken(token, 5)).toBe(true);
    });

    it('should return true for expired token', () => {
      const token = createMockToken(expiredPayload);
      expect(shouldRefreshToken(token, 5)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(shouldRefreshToken('invalid-token', 5)).toBe(true);
    });

    it('should respect custom threshold', () => {
      const token = createMockToken(nearExpiryPayload);
      expect(shouldRefreshToken(token, 2)).toBe(false); // 4 minutes left, threshold 2 minutes
      expect(shouldRefreshToken(token, 10)).toBe(true); // 4 minutes left, threshold 10 minutes
    });
  });

  describe('getTimeUntilExpiry', () => {
    it('should return human-readable time for valid token', () => {
      const token = createMockToken(validPayload);
      const timeLeft = getTimeUntilExpiry(token);
      
      expect(timeLeft).toContain('hour');
    });

    it('should return "Expired" for expired token', () => {
      const token = createMockToken(expiredPayload);
      expect(getTimeUntilExpiry(token)).toBe('Expired');
    });

    it('should return "Invalid token" for invalid token', () => {
      expect(getTimeUntilExpiry('invalid-token')).toBe('Invalid token');
    });

    it('should handle different time units', () => {
      // Test minutes
      const minutesPayload = { ...validPayload, exp: now + 300 }; // 5 minutes
      const minutesToken = createMockToken(minutesPayload);
      expect(getTimeUntilExpiry(minutesToken)).toContain('minute');

      // Test seconds
      const secondsPayload = { ...validPayload, exp: now + 30 }; // 30 seconds
      const secondsToken = createMockToken(secondsPayload);
      expect(getTimeUntilExpiry(secondsToken)).toContain('second');
    });
  });

  describe('isValidTokenStructure', () => {
    it('should return true for valid token structure', () => {
      const token = createMockToken(validPayload);
      expect(isValidTokenStructure(token)).toBe(true);
    });

    it('should return false for invalid token format', () => {
      expect(isValidTokenStructure('invalid-token')).toBe(false);
      expect(isValidTokenStructure('invalid.token')).toBe(false);
      expect(isValidTokenStructure('')).toBe(false);
      expect(isValidTokenStructure(null as any)).toBe(false);
    });

    it('should return false for token with missing required fields', () => {
      const incompletePayload = { userId: 'user-123' };
      const token = createMockToken(incompletePayload);
      expect(isValidTokenStructure(token)).toBe(false);
    });

    it('should return false for token with invalid expiration', () => {
      const invalidPayload = { ...validPayload, exp: validPayload.iat - 100 }; // exp before iat
      const token = createMockToken(invalidPayload);
      expect(isValidTokenStructure(token)).toBe(false);
    });
  });

  describe('areTokensEqual', () => {
    it('should return true for identical tokens', () => {
      const token = createMockToken(validPayload);
      expect(areTokensEqual(token, token)).toBe(true);
    });

    it('should return false for different tokens', () => {
      const token1 = createMockToken(validPayload);
      const token2 = createMockToken(expiredPayload);
      expect(areTokensEqual(token1, token2)).toBe(false);
    });

    it('should return true for both null tokens', () => {
      expect(areTokensEqual(null, null)).toBe(true);
    });

    it('should return false for one null token', () => {
      const token = createMockToken(validPayload);
      expect(areTokensEqual(token, null)).toBe(false);
      expect(areTokensEqual(null, token)).toBe(false);
    });
  });

  describe('getExpirationWarning', () => {
    it('should return null for token with plenty of time', () => {
      const token = createMockToken(validPayload);
      expect(getExpirationWarning(token)).toBeNull();
    });

    it('should return warning for near expiry token', () => {
      const token = createMockToken(nearExpiryPayload);
      const warning = getExpirationWarning(token);
      
      expect(warning).toBeDefined();
      expect(warning).toContain('will expire');
    });

    it('should return error message for expired token', () => {
      const token = createMockToken(expiredPayload);
      const warning = getExpirationWarning(token);
      
      expect(warning).toBeDefined();
      expect(warning).toContain('has expired');
    });

    it('should return error message for invalid token', () => {
      const warning = getExpirationWarning('invalid-token');
      
      expect(warning).toBeDefined();
      expect(warning).toContain('invalid');
    });
  });

  describe('TokenExpirationEvent enum', () => {
    it('should have correct event types', () => {
      expect(TokenExpirationEvent.EXPIRED).toBe('expired');
      expect(TokenExpirationEvent.NEAR_EXPIRY).toBe('near_expiry');
      expect(TokenExpirationEvent.REFRESHED).toBe('refreshed');
      expect(TokenExpirationEvent.INVALID).toBe('invalid');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle malformed base64 in token payload', () => {
      const malformedToken = 'header.malformed-base64-payload.signature';
      expect(decodeJWT(malformedToken)).toBeNull();
      expect(isTokenExpired(malformedToken)).toBe(true);
      expect(getTokenInfo(malformedToken)).toBeNull();
    });

    it('should handle tokens with non-JSON payload', () => {
      const nonJsonPayload = btoa('not-json-data');
      const invalidToken = `header.${nonJsonPayload}.signature`;
      expect(decodeJWT(invalidToken)).toBeNull();
    });

    it('should handle very large time differences', () => {
      const farFuturePayload = {
        ...validPayload,
        exp: now + (365 * 24 * 60 * 60), // 1 year in the future
      };
      const token = createMockToken(farFuturePayload);
      const timeLeft = getTimeUntilExpiry(token);
      expect(timeLeft).toContain('day');
    });

    it('should handle tokens with zero or negative time differences', () => {
      const zeroTimePayload = {
        ...validPayload,
        iat: now,
        exp: now, // Expires immediately
      };
      const token = createMockToken(zeroTimePayload);
      expect(isTokenExpired(token)).toBe(true);
    });
  });
});
