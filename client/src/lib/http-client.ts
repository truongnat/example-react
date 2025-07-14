import { config } from "./config";
import type { ApiResponse } from "@/types/api";
import {
  isTokenExpired,
  shouldRefreshToken,
  getTokenInfo,
  isValidTokenStructure
} from "./token-utils";

export class HttpClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshAttempts: number = 0;
  private maxRefreshAttempts: number = 3;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseURL: string = config.apiBaseUrl) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();

    // Log initial state
    console.log("HTTP Client initialized:", {
      baseURL: this.baseURL,
      hasAccessToken: !!this.accessToken,
      hasRefreshToken: !!this.refreshToken,
    });
  }

  private loadTokensFromStorage() {
    try {
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        const parsed = JSON.parse(authData);
        // Check both possible structures
        const tokens = parsed.state?.tokens || parsed.tokens;
        this.accessToken = tokens?.accessToken || null;
        this.refreshToken = tokens?.refreshToken || null;

        // Debug log
        console.log("Loading tokens from storage:", {
          hasAuthData: !!authData,
          hasState: !!parsed.state,
          hasTokens: !!tokens,
          hasAccessToken: !!this.accessToken,
        });
      }
    } catch (error) {
      console.warn("Failed to load tokens from storage:", error);
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.refreshAttempts = 0; // Reset refresh attempts on successful token save

    try {
      // Get current auth data or create new structure
      let authData = localStorage.getItem("auth-storage");
      let parsed: any;

      if (authData) {
        parsed = JSON.parse(authData);
      } else {
        // Create initial structure matching Zustand persist format
        parsed = {
          state: {
            user: null,
            isAuthenticated: false,
            tokens: null,
          },
          version: 0,
        };
      }

      // Ensure state exists
      if (!parsed.state) {
        parsed.state = {};
      }

      // Save tokens
      parsed.state.tokens = { accessToken, refreshToken };

      // Also update authentication status if not set
      if (accessToken) {
        parsed.state.isAuthenticated = true;
      }

      localStorage.setItem("auth-storage", JSON.stringify(parsed));

      console.log("Saved tokens to localStorage:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
        fullStructure: parsed,
      });

      // Verify tokens were saved correctly
      const verification = localStorage.getItem("auth-storage");
      if (verification) {
        const verifyParsed = JSON.parse(verification);
        console.log("Verification - tokens in storage:", {
          hasTokens: !!verifyParsed.state?.tokens,
          hasAccessToken: !!verifyParsed.state?.tokens?.accessToken,
        });
      }
    } catch (error) {
      console.error("Failed to save tokens to storage:", error);
    }
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshAttempts = 0;

    try {
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        const parsed = JSON.parse(authData);
        delete parsed.state.tokens;
        localStorage.setItem("auth-storage", JSON.stringify(parsed));
      }
    } catch (error) {
      console.warn("Failed to clear tokens from storage:", error);
    }
  }

  private syncTokensFromAuthStore() {
    try {
      // Get tokens directly from authStore
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        const parsed = JSON.parse(authData);
        const tokens = parsed.state?.tokens;
        if (tokens?.accessToken && tokens?.refreshToken) {
          this.accessToken = tokens.accessToken;
          this.refreshToken = tokens.refreshToken;
          console.log("Synced tokens from authStore:", {
            hasAccessToken: !!this.accessToken,
            accessTokenLength: this.accessToken?.length,
          });
          return true;
        }
      }
    } catch (error) {
      console.warn("Failed to sync tokens from authStore:", error);
    }
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Try to sync tokens from authStore first
    if (!this.accessToken) {
      this.syncTokensFromAuthStore();
    }

    // Proactive token validation and refresh
    await this.ensureValidToken(endpoint);

    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit & { Authorization?: string } = {
      ...options.headers,
    };

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add authorization header if token exists
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
      console.log(
        "Adding Authorization header:",
        `Bearer ${this.accessToken.substring(0, 20)}...`
      );
    } else {
      console.warn("No access token available for request to:", endpoint);
    }

    console.log("this.accessToken", this.accessToken);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - try to refresh token
        if (
          response.status === 401 &&
          this.refreshToken &&
          endpoint !== "/auth/refresh" &&
          this.refreshAttempts < this.maxRefreshAttempts
        ) {
          try {
            this.refreshAttempts++;
            console.log(`Attempting token refresh (${this.refreshAttempts}/${this.maxRefreshAttempts})`);

            await this.refreshAccessToken();
            // Retry the original request with new token
            return this.request<T>(endpoint, options);
          } catch (refreshError) {
            console.error(`Token refresh failed (attempt ${this.refreshAttempts}):`, refreshError);

            // If we've exhausted all refresh attempts, logout user
            if (this.refreshAttempts >= this.maxRefreshAttempts) {
              console.log("Max refresh attempts reached, logging out user");
              this.handleAuthFailure();
            }

            throw new ApiError("Session expired. Please login again.", 401);
          }
        } else if (response.status === 401) {
          // No refresh token or max attempts reached
          this.handleAuthFailure();
        }

        throw new ApiError(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.errors
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred",
        0
      );
    }
  }

  /**
   * Ensures the access token is valid before making a request
   * Proactively checks for expiration and refreshes if needed
   */
  private async ensureValidToken(endpoint: string): Promise<void> {
    // Skip token validation for auth endpoints
    if (endpoint.startsWith('/auth/')) {
      return;
    }

    // If no access token, try to sync from storage
    if (!this.accessToken) {
      this.syncTokensFromAuthStore();
    }

    // If still no token, user is not authenticated
    if (!this.accessToken) {
      return;
    }

    // Validate token structure
    if (!isValidTokenStructure(this.accessToken)) {
      console.warn('Invalid access token structure, clearing tokens');
      this.handleAuthFailure();
      throw new ApiError('Invalid token structure', 401);
    }

    // Check if token is expired
    if (isTokenExpired(this.accessToken)) {
      console.log('Access token is expired, attempting refresh...');
      await this.handleExpiredToken();
      return;
    }

    // Check if token should be refreshed proactively (within 2 minutes of expiry)
    if (shouldRefreshToken(this.accessToken, 2)) {
      console.log('Access token near expiry, proactively refreshing...');
      try {
        await this.proactiveTokenRefresh();
      } catch (error) {
        console.warn('Proactive token refresh failed, will retry on 401:', error);
        // Don't throw error here, let the request proceed and handle 401 if it occurs
      }
    }
  }

  /**
   * Handle expired token by attempting refresh or logout
   */
  private async handleExpiredToken(): Promise<void> {
    if (!this.refreshToken) {
      console.log('No refresh token available, logging out');
      this.handleAuthFailure();
      throw new ApiError('Session expired', 401);
    }

    try {
      await this.refreshAccessToken();
      console.log('Successfully refreshed expired token');
    } catch (error) {
      console.error('Failed to refresh expired token:', error);
      this.handleAuthFailure();
      throw new ApiError('Session expired', 401);
    }
  }

  /**
   * Proactively refresh token to prevent expiration during requests
   */
  private async proactiveTokenRefresh(): Promise<void> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      if (this.refreshPromise) {
        await this.refreshPromise;
      }
      return;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.refreshAccessToken()
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    await this.refreshPromise;
  }

  private handleAuthFailure(): void {
    console.log("Authentication failed, clearing tokens and redirecting to login");
    this.clearTokens();

    // Reset refresh state
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.refreshAttempts = 0;

    // Clear auth store and trigger logout
    try {
      // Import dynamically to avoid circular dependency
      import('@/stores/authStore').then(({ useAuthStore }) => {
        const authStore = useAuthStore.getState();
        authStore.logout();
      });
    } catch (error) {
      console.warn("Failed to clear auth store:", error);
      // Fallback: clear localStorage directly
      localStorage.removeItem("auth-storage");
    }

    // Redirect to login if not already there
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Validate refresh token structure
    if (!isValidTokenStructure(this.refreshToken)) {
      console.warn('Invalid refresh token structure');
      throw new Error("Invalid refresh token structure");
    }

    // Check if refresh token is expired
    if (isTokenExpired(this.refreshToken)) {
      console.warn('Refresh token is expired');
      throw new Error("Refresh token expired");
    }

    try {
      console.log('Attempting to refresh access token...');

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to refresh token: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.success || !data.data?.tokens) {
        throw new Error("Invalid refresh token response format");
      }

      const { accessToken, refreshToken: newRefreshToken } = data.data.tokens;

      // Validate new tokens
      if (!isValidTokenStructure(accessToken) || !isValidTokenStructure(newRefreshToken)) {
        throw new Error("Received invalid token structure from server");
      }

      // Save new tokens
      this.saveTokensToStorage(accessToken, newRefreshToken);

      // Reset refresh attempts counter on success
      this.refreshAttempts = 0;

      console.log('Token refresh successful');

      // Update auth store with new tokens
      try {
        const { useAuthStore } = await import('@/stores/authStore');
        const authStore = useAuthStore.getState();
        authStore.setTokens({ accessToken, refreshToken: newRefreshToken });
      } catch (error) {
        console.warn('Failed to update auth store with new tokens:', error);
      }

    } catch (error) {
      console.error('Token refresh failed:', error);

      // Clear tokens on refresh failure
      this.clearTokens();

      // Re-throw the error for handling by caller
      throw error;
    }
  }

  // Public methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  reloadTokens() {
    this.loadTokensFromStorage();
  }

  // Method to manually set tokens (called by auth hooks)
  forceSetTokens(accessToken: string, refreshToken: string) {
    console.log("Force setting tokens:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  clearAuth() {
    this.clearTokens();
  }

  /**
   * Get current token information for debugging and monitoring
   */
  getTokenInfo() {
    if (!this.accessToken) {
      return null;
    }

    const tokenInfo = getTokenInfo(this.accessToken);
    return tokenInfo ? {
      ...tokenInfo,
      hasRefreshToken: !!this.refreshToken,
      refreshAttempts: this.refreshAttempts,
      isRefreshing: this.isRefreshing,
    } : null;
  }

  /**
   * Check if the current access token is valid and not expired
   */
  isTokenValid(): boolean {
    if (!this.accessToken) {
      return false;
    }

    return isValidTokenStructure(this.accessToken) && !isTokenExpired(this.accessToken);
  }

  /**
   * Force a token refresh (useful for testing or manual refresh)
   */
  async forceRefresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    await this.refreshAccessToken();
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
