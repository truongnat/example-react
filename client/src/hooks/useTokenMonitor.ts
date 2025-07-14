/**
 * Token Monitoring Hook
 * 
 * This hook provides automatic token expiration monitoring and logout functionality.
 * It integrates with the token monitor service and provides React-specific features.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { tokenMonitorService, TokenMonitorCallback } from '@/services/token-monitor.service';
import { TokenExpirationEvent } from '@/lib/token-utils';
import { toast } from 'sonner';

export interface UseTokenMonitorOptions {
  /**
   * Whether to automatically start monitoring when authenticated
   * @default true
   */
  autoStart?: boolean;
  
  /**
   * Whether to show toast notifications for token events
   * @default true
   */
  showNotifications?: boolean;
  
  /**
   * Custom callback for token expiration events
   */
  onTokenEvent?: (event: TokenExpirationEvent, data?: any) => void;
  
  /**
   * Whether to automatically logout on token expiration
   * @default true
   */
  autoLogout?: boolean;
  
  /**
   * Check interval in milliseconds
   * @default 30000 (30 seconds)
   */
  checkInterval?: number;
  
  /**
   * Warning threshold in minutes before expiry
   * @default 5
   */
  warningThreshold?: number;
  
  /**
   * Auto-refresh threshold in minutes before expiry
   * @default 2
   */
  autoRefreshThreshold?: number;
}

export interface UseTokenMonitorReturn {
  /**
   * Whether token monitoring is currently active
   */
  isMonitoring: boolean;
  
  /**
   * Start token monitoring manually
   */
  startMonitoring: () => void;
  
  /**
   * Stop token monitoring manually
   */
  stopMonitoring: () => void;
  
  /**
   * Get current token information
   */
  getTokenInfo: () => any;
  
  /**
   * Check if current token is valid
   */
  isTokenValid: () => boolean;
  
  /**
   * Force a token refresh
   */
  forceRefresh: () => Promise<void>;
}

/**
 * Hook for monitoring JWT token expiration and handling automatic logout
 */
export function useTokenMonitor(options: UseTokenMonitorOptions = {}): UseTokenMonitorReturn {
  const {
    autoStart = true,
    showNotifications = true,
    onTokenEvent,
    autoLogout = true,
    checkInterval = 30000,
    warningThreshold = 5,
    autoRefreshThreshold = 2,
  } = options;

  const { isAuthenticated, tokens, logout, checkTokenExpiration, getTokenInfo, isTokenValid } = useAuthStore();
  const callbackRef = useRef<TokenMonitorCallback | null>(null);
  const isMonitoringRef = useRef(false);

  /**
   * Handle token expiration events
   */
  const handleTokenEvent = useCallback((event: TokenExpirationEvent, data?: any) => {
    console.log('Token event:', event, data);

    // Call custom callback if provided
    if (onTokenEvent) {
      try {
        onTokenEvent(event, data);
      } catch (error) {
        console.error('Error in custom token event callback:', error);
      }
    }

    // Handle different event types
    switch (event) {
      case TokenExpirationEvent.EXPIRED:
        if (showNotifications) {
          toast.error('Your session has expired. Please log in again.', {
            duration: 5000,
            action: {
              label: 'Login',
              onClick: () => {
                window.location.href = '/login';
              },
            },
          });
        }
        
        if (autoLogout) {
          logout();
        }
        break;

      case TokenExpirationEvent.NEAR_EXPIRY:
        if (showNotifications && data?.timeLeftText) {
          toast.warning(`Your session will expire in ${data.timeLeftText}. Please save your work.`, {
            duration: 10000,
            action: {
              label: 'Extend Session',
              onClick: async () => {
                try {
                  await forceRefresh();
                  toast.success('Session extended successfully');
                } catch (error) {
                  toast.error('Failed to extend session');
                }
              },
            },
          });
        }
        break;

      case TokenExpirationEvent.REFRESHED:
        if (showNotifications) {
          toast.success('Session extended successfully', {
            duration: 3000,
          });
        }
        break;

      case TokenExpirationEvent.INVALID:
        if (showNotifications) {
          toast.error('Your session is invalid. Please log in again.', {
            duration: 5000,
          });
        }
        
        if (autoLogout) {
          logout();
        }
        break;
    }
  }, [onTokenEvent, showNotifications, autoLogout, logout]);

  /**
   * Start monitoring token expiration
   */
  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) {
      return;
    }

    console.log('Starting token monitoring...');
    
    // Update token monitor configuration
    tokenMonitorService.updateConfig({
      checkInterval,
      warningThreshold,
      autoRefreshThreshold,
    });

    // Register callback
    callbackRef.current = handleTokenEvent;
    tokenMonitorService.addCallback(callbackRef.current);

    // Start monitoring
    tokenMonitorService.start();
    isMonitoringRef.current = true;
  }, [checkInterval, warningThreshold, autoRefreshThreshold, handleTokenEvent]);

  /**
   * Stop monitoring token expiration
   */
  const stopMonitoring = useCallback(() => {
    if (!isMonitoringRef.current) {
      return;
    }

    console.log('Stopping token monitoring...');

    // Remove callback
    if (callbackRef.current) {
      tokenMonitorService.removeCallback(callbackRef.current);
      callbackRef.current = null;
    }

    // Stop monitoring
    tokenMonitorService.stop();
    isMonitoringRef.current = false;
  }, []);

  /**
   * Force a token refresh
   */
  const forceRefresh = useCallback(async () => {
    try {
      const { httpClient } = await import('@/lib/http-client');
      await httpClient.forceRefresh();
    } catch (error) {
      console.error('Failed to force refresh token:', error);
      throw error;
    }
  }, []);

  /**
   * Effect to start/stop monitoring based on authentication status
   */
  useEffect(() => {
    if (autoStart && isAuthenticated && tokens?.accessToken) {
      // Check token validity first
      if (checkTokenExpiration()) {
        startMonitoring();
      }
    } else {
      stopMonitoring();
    }

    // Cleanup on unmount
    return () => {
      stopMonitoring();
    };
  }, [autoStart, isAuthenticated, tokens?.accessToken, startMonitoring, stopMonitoring, checkTokenExpiration]);

  /**
   * Effect to handle token changes
   */
  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      // Validate token when it changes
      if (!checkTokenExpiration()) {
        // Token is invalid or expired, stop monitoring
        stopMonitoring();
      }
    }
  }, [tokens?.accessToken, isAuthenticated, checkTokenExpiration, stopMonitoring]);

  return {
    isMonitoring: isMonitoringRef.current,
    startMonitoring,
    stopMonitoring,
    getTokenInfo,
    isTokenValid,
    forceRefresh,
  };
}

/**
 * Simplified hook for basic token monitoring with default settings
 */
export function useAutoLogout() {
  return useTokenMonitor({
    autoStart: true,
    showNotifications: true,
    autoLogout: true,
  });
}

/**
 * Hook for token monitoring without notifications (for background monitoring)
 */
export function useTokenMonitorSilent() {
  return useTokenMonitor({
    autoStart: true,
    showNotifications: false,
    autoLogout: true,
  });
}
