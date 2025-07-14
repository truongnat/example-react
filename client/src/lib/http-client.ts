import { config } from "./config";
import type { ApiResponse } from "@/types/api";

export class HttpClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshAttempts: number = 0;
  private maxRefreshAttempts: number = 3;

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

  private handleAuthFailure(): void {
    console.log("Authentication failed, clearing tokens and redirecting to login");
    this.clearTokens();

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

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.data?.tokens) {
        throw new Error("Invalid refresh token response");
      }

      const { accessToken, refreshToken } = data.data.tokens;
      this.saveTokensToStorage(accessToken, refreshToken);
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
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
