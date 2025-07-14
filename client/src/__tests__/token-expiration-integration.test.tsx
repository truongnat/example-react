/**
 * Integration tests for token expiration handling
 * 
 * These tests verify the complete flow of token expiration detection,
 * automatic refresh attempts, and logout functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenMonitor } from '@/components/TokenMonitor';
import { useAuthStore } from '@/stores/authStore';
import { tokenMonitorService } from '@/services/token-monitor.service';

// Mock dependencies
vi.mock('@/lib/token-utils', () => ({
  getTokenInfo: vi.fn(),
  isTokenExpired: vi.fn(),
  isValidTokenStructure: vi.fn(),
  shouldRefreshToken: vi.fn(),
  TokenExpirationEvent: {
    EXPIRED: 'expired',
    NEAR_EXPIRY: 'near_expiry',
    REFRESHED: 'refreshed',
    INVALID: 'invalid',
  },
}));

vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    forceRefresh: vi.fn(),
    clearAuth: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock window.location
const mockLocation = {
  href: '',
  pathname: '/dashboard',
  search: '?tab=todos',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Token Expiration Integration', () => {
  let queryClient: QueryClient;

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Setup localStorage mock
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      state: {
        user: mockUser,
        isAuthenticated: true,
        tokens: mockTokens,
      }
    }));

    // Reset auth store
    const authStore = useAuthStore.getState();
    authStore.setUser(mockUser);
    authStore.setAuthenticated(true);
    authStore.setTokens(mockTokens);

    // Setup token utils mocks
    const { getTokenInfo, isTokenExpired, isValidTokenStructure, shouldRefreshToken } = require('@/lib/token-utils');
    getTokenInfo.mockReturnValue({
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
    });
    isTokenExpired.mockReturnValue(false);
    isValidTokenStructure.mockReturnValue(true);
    shouldRefreshToken.mockReturnValue(false);
  });

  afterEach(() => {
    tokenMonitorService.stop();
    queryClient.clear();
  });

  const renderTokenMonitor = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TokenMonitor {...props} />
      </QueryClientProvider>
    );
  };

  describe('Token expiration detection', () => {
    it('should detect expired token and trigger logout', async () => {
      const { getTokenInfo, isTokenExpired } = require('@/lib/token-utils');
      const { toast } = require('sonner');
      
      // Mock expired token
      getTokenInfo.mockReturnValue({
        isExpired: true,
        timeUntilExpiry: -300000,
      });
      isTokenExpired.mockReturnValue(true);

      const authStore = useAuthStore.getState();
      const logoutSpy = vi.spyOn(authStore, 'logout');

      renderTokenMonitor();

      // Wait for token monitoring to detect expiration
      await waitFor(() => {
        expect(logoutSpy).toHaveBeenCalled();
      }, { timeout: 2000 });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('expired'),
        expect.any(Object)
      );
    });

    it('should show warning for near expiry token', async () => {
      const { getTokenInfo } = require('@/lib/token-utils');
      const { toast } = require('sonner');
      
      // Mock near expiry token
      getTokenInfo.mockReturnValue({
        isExpired: false,
        isNearExpiry: true,
        timeUntilExpiry: 240000, // 4 minutes
      });

      renderTokenMonitor();

      // Wait for warning notification
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          expect.stringContaining('will expire'),
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });

    it('should attempt token refresh when near expiry', async () => {
      const { shouldRefreshToken } = require('@/lib/token-utils');
      const { httpClient } = require('@/lib/http-client');
      
      shouldRefreshToken.mockReturnValue(true);
      httpClient.get.mockResolvedValue({});

      renderTokenMonitor();

      // Wait for refresh attempt
      await waitFor(() => {
        expect(httpClient.get).toHaveBeenCalledWith('/auth/me');
      }, { timeout: 2000 });
    });

    it('should handle refresh failure and logout', async () => {
      const { shouldRefreshToken } = require('@/lib/token-utils');
      const { httpClient } = require('@/lib/http-client');
      const { toast } = require('sonner');
      
      shouldRefreshToken.mockReturnValue(true);
      httpClient.get.mockRejectedValue(new Error('Refresh failed'));

      const authStore = useAuthStore.getState();
      const logoutSpy = vi.spyOn(authStore, 'logout');

      renderTokenMonitor();

      // Wait for refresh failure and logout
      await waitFor(() => {
        expect(logoutSpy).toHaveBeenCalled();
      }, { timeout: 2000 });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('expired'),
        expect.any(Object)
      );
    });
  });

  describe('Invalid token handling', () => {
    it('should detect invalid token structure and logout', async () => {
      const { isValidTokenStructure } = require('@/lib/token-utils');
      const { toast } = require('sonner');
      
      isValidTokenStructure.mockReturnValue(false);

      const authStore = useAuthStore.getState();
      const logoutSpy = vi.spyOn(authStore, 'logout');

      renderTokenMonitor();

      // Wait for invalid token detection
      await waitFor(() => {
        expect(logoutSpy).toHaveBeenCalled();
      }, { timeout: 2000 });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('invalid'),
        expect.any(Object)
      );
    });
  });

  describe('User interactions', () => {
    it('should allow manual session extension', async () => {
      const { getTokenInfo } = require('@/lib/token-utils');
      const { httpClient } = require('@/lib/http-client');
      const { toast } = require('sonner');
      
      // Mock near expiry token
      getTokenInfo.mockReturnValue({
        isExpired: false,
        isNearExpiry: true,
        timeUntilExpiry: 240000,
      });

      httpClient.forceRefresh.mockResolvedValue({});

      renderTokenMonitor();

      // Wait for warning notification with action button
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            action: expect.objectContaining({
              label: 'Extend Session',
              onClick: expect.any(Function),
            }),
          })
        );
      }, { timeout: 2000 });

      // Simulate clicking the extend session button
      const warningCall = toast.warning.mock.calls.find(call => 
        call[1]?.action?.label === 'Extend Session'
      );
      
      if (warningCall) {
        await warningCall[1].action.onClick();
        expect(httpClient.forceRefresh).toHaveBeenCalled();
      }
    });

    it('should redirect to login with current path on expiration', async () => {
      const { getTokenInfo, isTokenExpired } = require('@/lib/token-utils');
      
      // Mock expired token
      getTokenInfo.mockReturnValue({
        isExpired: true,
        timeUntilExpiry: -300000,
      });
      isTokenExpired.mockReturnValue(true);

      renderTokenMonitor({ autoRedirect: true });

      // Wait for expiration detection and redirect
      await waitFor(() => {
        expect(mockLocation.href).toBe('/login?redirect=%2Fdashboard%3Ftab%3Dtodos');
      }, { timeout: 2000 });
    });
  });

  describe('Configuration options', () => {
    it('should respect debug mode', async () => {
      const { getTokenInfo } = require('@/lib/token-utils');
      const { toast } = require('sonner');
      
      // Mock token refresh
      getTokenInfo.mockReturnValue({
        isExpired: false,
        isNearExpiry: false,
        timeUntilExpiry: 3600000,
      });

      renderTokenMonitor({ debug: true });

      // In debug mode, should show info toast when monitoring starts
      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(
          'Token monitoring started',
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });

    it('should use custom messages', async () => {
      const { getTokenInfo, isTokenExpired } = require('@/lib/token-utils');
      const { toast } = require('sonner');
      
      const customMessages = {
        expired: 'Custom expiration message',
      };

      // Mock expired token
      getTokenInfo.mockReturnValue({
        isExpired: true,
        timeUntilExpiry: -300000,
      });
      isTokenExpired.mockReturnValue(true);

      renderTokenMonitor({ messages: customMessages });

      // Wait for custom message
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Custom expiration message',
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });

    it('should respect autoRedirect setting', async () => {
      const { getTokenInfo, isTokenExpired } = require('@/lib/token-utils');
      const { toast } = require('sonner');
      
      // Mock expired token
      getTokenInfo.mockReturnValue({
        isExpired: true,
        timeUntilExpiry: -300000,
      });
      isTokenExpired.mockReturnValue(true);

      renderTokenMonitor({ autoRedirect: false });

      // Wait for expiration notification without redirect action
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.any(String),
          expect.not.objectContaining({
            action: expect.any(Object),
          })
        );
      }, { timeout: 2000 });

      // Should not redirect
      expect(mockLocation.href).toBe('');
    });
  });
});
