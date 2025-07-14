/**
 * Tests for Token Monitor Service
 */

import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { TokenMonitorService, TokenMonitorCallback } from '../token-monitor.service';
import { TokenExpirationEvent } from '@/lib/token-utils';

// Mock dependencies
vi.mock('@/lib/token-utils', () => ({
  getTokenInfo: vi.fn(),
  shouldRefreshToken: vi.fn(),
  isValidTokenStructure: vi.fn(),
  TokenExpirationEvent: {
    EXPIRED: 'expired',
    NEAR_EXPIRY: 'near_expiry',
    REFRESHED: 'refreshed',
    INVALID: 'invalid',
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    pathname: '/test',
    search: '',
  },
  writable: true,
});

describe('TokenMonitorService', () => {
  let tokenMonitor: TokenMonitorService;
  let mockCallback: Mock;

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  const mockTokenInfo = {
    payload: {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      tokenVersion: 1,
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    isExpired: false,
    expiresAt: new Date(Date.now() + 3600000),
    issuedAt: new Date(Date.now() - 3600000),
    timeUntilExpiry: 3600000,
    isNearExpiry: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset localStorage mock
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      state: { tokens: mockTokens }
    }));

    // Reset auth store mock
    const { useAuthStore } = require('@/stores/authStore');
    useAuthStore.getState.mockReturnValue({
      tokens: mockTokens,
      logout: vi.fn(),
      setTokens: vi.fn(),
    });

    // Reset token utils mocks
    const { getTokenInfo, shouldRefreshToken, isValidTokenStructure } = require('@/lib/token-utils');
    getTokenInfo.mockReturnValue(mockTokenInfo);
    shouldRefreshToken.mockReturnValue(false);
    isValidTokenStructure.mockReturnValue(true);

    tokenMonitor = new TokenMonitorService({
      checkInterval: 100, // Fast interval for testing
      warningThreshold: 5,
      autoRefreshThreshold: 2,
    });

    mockCallback = vi.fn();
  });

  afterEach(() => {
    tokenMonitor.stop();
  });

  describe('Basic functionality', () => {
    it('should initialize with correct default config', () => {
      const defaultMonitor = new TokenMonitorService();
      const status = defaultMonitor.getStatus();
      
      expect(status.isMonitoring).toBe(false);
      expect(status.config.checkInterval).toBe(30000);
      expect(status.config.warningThreshold).toBe(5);
      expect(status.config.autoRefreshThreshold).toBe(2);
    });

    it('should start and stop monitoring', () => {
      expect(tokenMonitor.getStatus().isMonitoring).toBe(false);
      
      tokenMonitor.start();
      expect(tokenMonitor.getStatus().isMonitoring).toBe(true);
      
      tokenMonitor.stop();
      expect(tokenMonitor.getStatus().isMonitoring).toBe(false);
    });

    it('should not start monitoring twice', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      tokenMonitor.start();
      tokenMonitor.start(); // Second call should be ignored
      
      expect(consoleSpy).toHaveBeenCalledWith('Token monitor already running');
      consoleSpy.mockRestore();
    });

    it('should add and remove callbacks', () => {
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      // Trigger a check that should call the callback
      const { getTokenInfo } = require('@/lib/token-utils');
      getTokenInfo.mockReturnValue({ ...mockTokenInfo, isExpired: true });
      
      // Wait for the interval to trigger
      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledWith(TokenExpirationEvent.EXPIRED);
          
          tokenMonitor.removeCallback(mockCallback);
          mockCallback.mockClear();
          
          // Wait for another interval
          setTimeout(() => {
            expect(mockCallback).not.toHaveBeenCalled();
            resolve(undefined);
          }, 150);
        }, 150);
      });
    });
  });

  describe('Token expiration detection', () => {
    it('should detect expired tokens', () => {
      const { getTokenInfo } = require('@/lib/token-utils');
      getTokenInfo.mockReturnValue({ ...mockTokenInfo, isExpired: true });
      
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledWith(TokenExpirationEvent.EXPIRED);
          resolve(undefined);
        }, 150);
      });
    });

    it('should detect near expiry tokens', () => {
      const { getTokenInfo } = require('@/lib/token-utils');
      getTokenInfo.mockReturnValue({ 
        ...mockTokenInfo, 
        isNearExpiry: true,
        timeUntilExpiry: 240000 // 4 minutes
      });
      
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledWith(
            TokenExpirationEvent.NEAR_EXPIRY,
            expect.objectContaining({ timeUntilExpiry: 240000 })
          );
          resolve(undefined);
        }, 150);
      });
    });

    it('should detect invalid tokens', () => {
      const { isValidTokenStructure } = require('@/lib/token-utils');
      isValidTokenStructure.mockReturnValue(false);
      
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledWith(TokenExpirationEvent.INVALID);
          resolve(undefined);
        }, 150);
      });
    });

    it('should handle missing tokens gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        state: { tokens: { accessToken: null } }
      }));
      
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          // Should not call callback for missing tokens
          expect(mockCallback).not.toHaveBeenCalled();
          resolve(undefined);
        }, 150);
      });
    });
  });

  describe('Token refresh handling', () => {
    it('should attempt token refresh when needed', async () => {
      const { shouldRefreshToken } = require('@/lib/token-utils');
      const { httpClient } = require('@/lib/http-client');
      
      shouldRefreshToken.mockReturnValue(true);
      httpClient.get.mockResolvedValue({});
      
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(httpClient.get).toHaveBeenCalledWith('/auth/me');
          resolve(undefined);
        }, 150);
      });
    });

    it('should handle refresh failure', async () => {
      const { shouldRefreshToken } = require('@/lib/token-utils');
      const { httpClient } = require('@/lib/http-client');
      
      shouldRefreshToken.mockReturnValue(true);
      httpClient.get.mockRejectedValue(new Error('Refresh failed'));
      
      tokenMonitor.addCallback(mockCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledWith(TokenExpirationEvent.EXPIRED);
          resolve(undefined);
        }, 150);
      });
    });

    it('should throttle refresh attempts', async () => {
      const { shouldRefreshToken } = require('@/lib/token-utils');
      const { httpClient } = require('@/lib/http-client');
      
      shouldRefreshToken.mockReturnValue(true);
      httpClient.get.mockResolvedValue({});
      
      tokenMonitor.start();
      
      // Wait for multiple intervals
      return new Promise(resolve => {
        setTimeout(() => {
          // Should only call refresh once due to throttling
          expect(httpClient.get).toHaveBeenCalledTimes(1);
          resolve(undefined);
        }, 300);
      });
    });
  });

  describe('Configuration updates', () => {
    it('should update configuration', () => {
      const newConfig = {
        checkInterval: 60000,
        warningThreshold: 10,
      };
      
      tokenMonitor.updateConfig(newConfig);
      const status = tokenMonitor.getStatus();
      
      expect(status.config.checkInterval).toBe(60000);
      expect(status.config.warningThreshold).toBe(10);
      expect(status.config.autoRefreshThreshold).toBe(2); // Should keep original value
    });

    it('should restart monitoring when config is updated during monitoring', () => {
      const stopSpy = vi.spyOn(tokenMonitor, 'stop');
      const startSpy = vi.spyOn(tokenMonitor, 'start');
      
      tokenMonitor.start();
      tokenMonitor.updateConfig({ checkInterval: 60000 });
      
      expect(stopSpy).toHaveBeenCalled();
      expect(startSpy).toHaveBeenCalledTimes(2); // Once for initial start, once for restart
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      tokenMonitor.start();
      
      // Should not throw and should log warning
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to get tokens from storage:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle callback errors gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const { getTokenInfo } = require('@/lib/token-utils');
      getTokenInfo.mockReturnValue({ ...mockTokenInfo, isExpired: true });
      
      tokenMonitor.addCallback(errorCallback);
      tokenMonitor.start();
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(consoleSpy).toHaveBeenCalledWith(
            'Error in token monitor callback:',
            expect.any(Error)
          );
          consoleSpy.mockRestore();
          resolve(undefined);
        }, 150);
      });
    });
  });
});
