/**
 * Token Monitor Component
 * 
 * This component provides automatic token expiration monitoring and user notifications.
 * It should be included at the root level of the application to ensure global monitoring.
 */

import React, { useEffect } from 'react';
import { useTokenMonitor } from '@/hooks/useTokenMonitor';
import { useAuthStore } from '@/stores/authStore';
import { TokenExpirationEvent } from '@/lib/token-utils';
import { toast } from 'sonner';

export interface TokenMonitorProps {
  /**
   * Whether to show detailed notifications for debugging
   * @default false
   */
  debug?: boolean;
  
  /**
   * Custom notification messages
   */
  messages?: {
    expired?: string;
    nearExpiry?: string;
    refreshed?: string;
    invalid?: string;
  };
  
  /**
   * Whether to automatically redirect to login on token expiration
   * @default true
   */
  autoRedirect?: boolean;
}

/**
 * Token Monitor Component
 * 
 * Provides automatic token expiration monitoring with user notifications.
 * Should be included once at the root level of the application.
 */
export function TokenMonitor({ 
  debug = false, 
  messages = {},
  autoRedirect = true 
}: TokenMonitorProps) {
  const { isAuthenticated } = useAuthStore();
  
  const defaultMessages = {
    expired: 'Your session has expired. Please log in again.',
    nearExpiry: 'Your session will expire soon. Please save your work.',
    refreshed: 'Session extended successfully.',
    invalid: 'Your session is invalid. Please log in again.',
  };

  const finalMessages = { ...defaultMessages, ...messages };

  /**
   * Handle token expiration events with custom notifications
   */
  const handleTokenEvent = (event: TokenExpirationEvent, data?: any) => {
    if (debug) {
      console.log('TokenMonitor: Token event received:', event, data);
    }

    switch (event) {
      case TokenExpirationEvent.EXPIRED:
        toast.error(finalMessages.expired, {
          duration: 8000,
          action: autoRedirect ? {
            label: 'Login',
            onClick: () => {
              const currentPath = window.location.pathname + window.location.search;
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            },
          } : undefined,
        });
        break;

      case TokenExpirationEvent.NEAR_EXPIRY:
        if (data?.timeLeftText) {
          toast.warning(`${finalMessages.nearExpiry} Time remaining: ${data.timeLeftText}`, {
            duration: 15000,
            action: {
              label: 'Extend Session',
              onClick: async () => {
                try {
                  const { httpClient } = await import('@/lib/http-client');
                  await httpClient.forceRefresh();
                  toast.success('Session extended successfully');
                } catch (error) {
                  toast.error('Failed to extend session. Please save your work and log in again.');
                }
              },
            },
          });
        } else {
          toast.warning(finalMessages.nearExpiry, {
            duration: 10000,
          });
        }
        break;

      case TokenExpirationEvent.REFRESHED:
        if (debug) {
          toast.success(finalMessages.refreshed, {
            duration: 3000,
          });
        }
        break;

      case TokenExpirationEvent.INVALID:
        toast.error(finalMessages.invalid, {
          duration: 8000,
          action: autoRedirect ? {
            label: 'Login',
            onClick: () => {
              window.location.href = '/login';
            },
          } : undefined,
        });
        break;
    }
  };

  // Initialize token monitoring with custom event handler
  const { isMonitoring, getTokenInfo } = useTokenMonitor({
    autoStart: true,
    showNotifications: false, // We handle notifications ourselves
    autoLogout: true,
    onTokenEvent: handleTokenEvent,
    checkInterval: 30000, // Check every 30 seconds
    warningThreshold: 5, // Warn 5 minutes before expiry
    autoRefreshThreshold: 2, // Auto-refresh 2 minutes before expiry
  });

  // Debug information
  useEffect(() => {
    if (debug && isAuthenticated) {
      const tokenInfo = getTokenInfo();
      if (tokenInfo) {
        console.log('TokenMonitor: Current token info:', {
          isMonitoring,
          expiresAt: tokenInfo.expiresAt,
          timeUntilExpiry: tokenInfo.timeUntilExpiry,
          isNearExpiry: tokenInfo.isNearExpiry,
          isExpired: tokenInfo.isExpired,
        });
      }
    }
  }, [debug, isAuthenticated, isMonitoring, getTokenInfo]);

  // Show debug toast when monitoring starts/stops
  useEffect(() => {
    if (debug) {
      if (isMonitoring && isAuthenticated) {
        toast.info('Token monitoring started', { duration: 2000 });
      } else if (!isMonitoring && !isAuthenticated) {
        toast.info('Token monitoring stopped', { duration: 2000 });
      }
    }
  }, [debug, isMonitoring, isAuthenticated]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Token Status Display Component (for debugging)
 * 
 * Shows current token status information. Useful for development and debugging.
 */
export function TokenStatusDisplay() {
  const { isAuthenticated, tokens, getTokenInfo } = useAuthStore();
  const { isMonitoring, isTokenValid } = useTokenMonitor();

  if (!isAuthenticated || !tokens?.accessToken) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
        <div className="font-semibold text-red-800">Not Authenticated</div>
        <div className="text-red-600">No access token available</div>
      </div>
    );
  }

  const tokenInfo = getTokenInfo();
  
  if (!tokenInfo) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
        <div className="font-semibold text-red-800">Invalid Token</div>
        <div className="text-red-600">Unable to parse token information</div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (tokenInfo.isExpired) return 'red';
    if (tokenInfo.isNearExpiry) return 'yellow';
    return 'green';
  };

  const statusColor = getStatusColor();
  const bgColor = `bg-${statusColor}-100`;
  const borderColor = `border-${statusColor}-300`;
  const textColor = `text-${statusColor}-800`;
  const subTextColor = `text-${statusColor}-600`;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} border ${borderColor} rounded-lg p-3 text-sm max-w-xs`}>
      <div className={`font-semibold ${textColor} mb-2`}>Token Status</div>
      
      <div className="space-y-1">
        <div className={subTextColor}>
          <span className="font-medium">Status:</span> {
            tokenInfo.isExpired ? 'Expired' :
            tokenInfo.isNearExpiry ? 'Near Expiry' :
            'Valid'
          }
        </div>
        
        <div className={subTextColor}>
          <span className="font-medium">Monitoring:</span> {isMonitoring ? 'Active' : 'Inactive'}
        </div>
        
        <div className={subTextColor}>
          <span className="font-medium">Valid:</span> {isTokenValid() ? 'Yes' : 'No'}
        </div>
        
        <div className={subTextColor}>
          <span className="font-medium">Expires:</span> {tokenInfo.expiresAt.toLocaleTimeString()}
        </div>
        
        {!tokenInfo.isExpired && (
          <div className={subTextColor}>
            <span className="font-medium">Time left:</span> {Math.floor(tokenInfo.timeUntilExpiry / 60000)}m
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenMonitor;
