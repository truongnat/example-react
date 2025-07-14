/**
 * Token Expiration Monitoring Service
 * 
 * This service monitors JWT token expiration and automatically handles:
 * - Token expiration warnings
 * - Automatic token refresh
 * - Automatic logout when tokens expire
 * - User notifications about session status
 */

import { 
  getTokenInfo, 
  shouldRefreshToken, 
  getExpirationWarning,
  TokenExpirationEvent,
  TokenMonitorConfig,
  DEFAULT_TOKEN_MONITOR_CONFIG,
  isValidTokenStructure
} from '@/lib/token-utils';
import { toast } from 'sonner';

export type TokenMonitorCallback = (event: TokenExpirationEvent, data?: any) => void;

export class TokenMonitorService {
  private intervalId: NodeJS.Timeout | null = null;
  private config: TokenMonitorConfig;
  private callbacks: Set<TokenMonitorCallback> = new Set();
  private lastWarningTime: number = 0;
  private lastRefreshAttempt: number = 0;
  private isMonitoring: boolean = false;

  constructor(config: Partial<TokenMonitorConfig> = {}) {
    this.config = { ...DEFAULT_TOKEN_MONITOR_CONFIG, ...config };
    
    // Bind methods to preserve context
    this.checkTokenExpiration = this.checkTokenExpiration.bind(this);
    this.handleTokenExpired = this.handleTokenExpired.bind(this);
    this.handleTokenNearExpiry = this.handleTokenNearExpiry.bind(this);
    this.handleTokenRefreshed = this.handleTokenRefreshed.bind(this);
    this.handleTokenInvalid = this.handleTokenInvalid.bind(this);
  }

  /**
   * Start monitoring token expiration
   */
  start(): void {
    if (this.isMonitoring) {
      console.log('Token monitor already running');
      return;
    }

    console.log('Starting token expiration monitoring...', {
      checkInterval: this.config.checkInterval,
      warningThreshold: this.config.warningThreshold,
      autoRefreshThreshold: this.config.autoRefreshThreshold,
    });

    this.isMonitoring = true;
    this.intervalId = setInterval(this.checkTokenExpiration, this.config.checkInterval);
    
    // Run initial check
    this.checkTokenExpiration();
  }

  /**
   * Stop monitoring token expiration
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    console.log('Token expiration monitoring stopped');
  }

  /**
   * Add a callback for token events
   */
  addCallback(callback: TokenMonitorCallback): void {
    this.callbacks.add(callback);
  }

  /**
   * Remove a callback
   */
  removeCallback(callback: TokenMonitorCallback): void {
    this.callbacks.delete(callback);
  }

  /**
   * Update monitoring configuration
   */
  updateConfig(newConfig: Partial<TokenMonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart monitoring with new config if currently running
    if (this.isMonitoring) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get current monitoring status
   */
  getStatus(): { isMonitoring: boolean; config: TokenMonitorConfig } {
    return {
      isMonitoring: this.isMonitoring,
      config: { ...this.config },
    };
  }

  /**
   * Main token checking logic
   */
  private checkTokenExpiration(): void {
    try {
      const tokens = this.getTokensFromStorage();
      
      if (!tokens.accessToken) {
        // No token available - user is not authenticated
        return;
      }

      // Validate token structure
      if (!isValidTokenStructure(tokens.accessToken)) {
        console.warn('Invalid access token structure detected');
        this.handleTokenInvalid();
        return;
      }

      const tokenInfo = getTokenInfo(tokens.accessToken);
      
      if (!tokenInfo) {
        console.warn('Unable to get token info');
        this.handleTokenInvalid();
        return;
      }

      // Check if token is expired
      if (tokenInfo.isExpired) {
        console.log('Access token has expired');
        this.handleTokenExpired();
        return;
      }

      // Check if token should be refreshed
      if (shouldRefreshToken(tokens.accessToken, this.config.autoRefreshThreshold)) {
        const now = Date.now();
        const timeSinceLastRefresh = now - this.lastRefreshAttempt;
        
        // Prevent too frequent refresh attempts (minimum 30 seconds between attempts)
        if (timeSinceLastRefresh > 30000) {
          console.log('Token needs refresh, attempting automatic refresh...');
          this.lastRefreshAttempt = now;
          this.attemptTokenRefresh();
        }
        return;
      }

      // Check if token is near expiry and should show warning
      if (tokenInfo.isNearExpiry) {
        const now = Date.now();
        const timeSinceLastWarning = now - this.lastWarningTime;
        
        // Show warning at most once per minute
        if (timeSinceLastWarning > 60000) {
          this.lastWarningTime = now;
          this.handleTokenNearExpiry(tokenInfo.timeUntilExpiry);
        }
      }

    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
  }

  /**
   * Get tokens from storage
   */
  private getTokensFromStorage(): { accessToken: string | null; refreshToken: string | null } {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        const tokens = parsed.state?.tokens;
        return {
          accessToken: tokens?.accessToken || null,
          refreshToken: tokens?.refreshToken || null,
        };
      }
    } catch (error) {
      console.warn('Failed to get tokens from storage:', error);
    }
    
    return { accessToken: null, refreshToken: null };
  }

  /**
   * Attempt to refresh the access token
   */
  private async attemptTokenRefresh(): Promise<void> {
    try {
      // Import httpClient dynamically to avoid circular dependencies
      const { httpClient } = await import('@/lib/http-client');
      
      // The httpClient will automatically handle token refresh on 401 responses
      // We can trigger this by making a simple authenticated request
      await httpClient.get('/auth/me');
      
      console.log('Token refresh successful');
      this.handleTokenRefreshed();
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails, the token is likely expired or invalid
      this.handleTokenExpired();
    }
  }

  /**
   * Handle token expiration
   */
  private handleTokenExpired(): void {
    console.log('Handling token expiration - logging out user');
    
    // Notify callbacks
    this.notifyCallbacks(TokenExpirationEvent.EXPIRED);
    
    // Show user notification
    toast.error('Your session has expired. Please log in again.', {
      duration: 5000,
      action: {
        label: 'Login',
        onClick: () => {
          window.location.href = '/login';
        },
      },
    });

    // Call config callback
    if (this.config.onTokenExpired) {
      this.config.onTokenExpired();
    }

    // Trigger logout
    this.triggerLogout();
  }

  /**
   * Handle token near expiry
   */
  private handleTokenNearExpiry(timeUntilExpiry: number): void {
    const minutes = Math.floor(timeUntilExpiry / (60 * 1000));
    const timeLeftText = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : 'less than a minute';
    
    console.log(`Token near expiry: ${timeLeftText} remaining`);
    
    // Notify callbacks
    this.notifyCallbacks(TokenExpirationEvent.NEAR_EXPIRY, { timeUntilExpiry, timeLeftText });
    
    // Show user warning
    toast.warning(`Your session will expire in ${timeLeftText}. Please save your work.`, {
      duration: 10000,
      action: {
        label: 'Extend Session',
        onClick: () => {
          this.attemptTokenRefresh();
        },
      },
    });

    // Call config callback
    if (this.config.onTokenNearExpiry) {
      this.config.onTokenNearExpiry(timeLeftText);
    }
  }

  /**
   * Handle successful token refresh
   */
  private handleTokenRefreshed(): void {
    console.log('Token refreshed successfully');
    
    // Reset warning time to allow new warnings
    this.lastWarningTime = 0;
    
    // Notify callbacks
    this.notifyCallbacks(TokenExpirationEvent.REFRESHED);
    
    // Show success notification
    toast.success('Session extended successfully', {
      duration: 3000,
    });

    // Call config callback
    if (this.config.onTokenRefreshed) {
      this.config.onTokenRefreshed();
    }
  }

  /**
   * Handle invalid token
   */
  private handleTokenInvalid(): void {
    console.log('Invalid token detected - logging out user');
    
    // Notify callbacks
    this.notifyCallbacks(TokenExpirationEvent.INVALID);
    
    // Show user notification
    toast.error('Your session is invalid. Please log in again.', {
      duration: 5000,
    });

    // Call config callback
    if (this.config.onTokenInvalid) {
      this.config.onTokenInvalid();
    }

    // Trigger logout
    this.triggerLogout();
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(event: TokenExpirationEvent, data?: any): void {
    this.callbacks.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in token monitor callback:', error);
      }
    });
  }

  /**
   * Trigger user logout
   */
  private async triggerLogout(): Promise<void> {
    try {
      // Import auth store dynamically to avoid circular dependencies
      const { useAuthStore } = await import('@/stores/authStore');
      const authStore = useAuthStore.getState();
      
      // Clear auth state
      authStore.logout();
      
      // Clear HTTP client tokens
      const { httpClient } = await import('@/lib/http-client');
      httpClient.clearAuth();
      
      // Redirect to login page
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Fallback: clear localStorage and redirect
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
  }
}

// Export singleton instance
export const tokenMonitorService = new TokenMonitorService();
