var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from "./config";
export class HttpClient {
    constructor(baseURL = config.apiBaseUrl) {
        this.accessToken = null;
        this.refreshToken = null;
        this.baseURL = baseURL;
        this.loadTokensFromStorage();
        // Log initial state
        console.log("HTTP Client initialized:", {
            baseURL: this.baseURL,
            hasAccessToken: !!this.accessToken,
            hasRefreshToken: !!this.refreshToken,
        });
    }
    loadTokensFromStorage() {
        var _a;
        try {
            const authData = localStorage.getItem("auth-storage");
            if (authData) {
                const parsed = JSON.parse(authData);
                // Check both possible structures
                const tokens = ((_a = parsed.state) === null || _a === void 0 ? void 0 : _a.tokens) || parsed.tokens;
                this.accessToken = (tokens === null || tokens === void 0 ? void 0 : tokens.accessToken) || null;
                this.refreshToken = (tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken) || null;
                // Debug log
                console.log("Loading tokens from storage:", {
                    hasAuthData: !!authData,
                    hasState: !!parsed.state,
                    hasTokens: !!tokens,
                    hasAccessToken: !!this.accessToken,
                });
            }
        }
        catch (error) {
            console.warn("Failed to load tokens from storage:", error);
        }
    }
    saveTokensToStorage(accessToken, refreshToken) {
        var _a, _b, _c;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        try {
            // Get current auth data or create new structure
            let authData = localStorage.getItem("auth-storage");
            let parsed;
            if (authData) {
                parsed = JSON.parse(authData);
            }
            else {
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
                    hasTokens: !!((_a = verifyParsed.state) === null || _a === void 0 ? void 0 : _a.tokens),
                    hasAccessToken: !!((_c = (_b = verifyParsed.state) === null || _b === void 0 ? void 0 : _b.tokens) === null || _c === void 0 ? void 0 : _c.accessToken),
                });
            }
        }
        catch (error) {
            console.error("Failed to save tokens to storage:", error);
        }
    }
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        try {
            const authData = localStorage.getItem("auth-storage");
            if (authData) {
                const parsed = JSON.parse(authData);
                delete parsed.state.tokens;
                localStorage.setItem("auth-storage", JSON.stringify(parsed));
            }
        }
        catch (error) {
            console.warn("Failed to clear tokens from storage:", error);
        }
    }
    syncTokensFromAuthStore() {
        var _a, _b;
        try {
            // Get tokens directly from authStore
            const authData = localStorage.getItem("auth-storage");
            if (authData) {
                const parsed = JSON.parse(authData);
                const tokens = (_a = parsed.state) === null || _a === void 0 ? void 0 : _a.tokens;
                if ((tokens === null || tokens === void 0 ? void 0 : tokens.accessToken) && (tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken)) {
                    this.accessToken = tokens.accessToken;
                    this.refreshToken = tokens.refreshToken;
                    console.log("Synced tokens from authStore:", {
                        hasAccessToken: !!this.accessToken,
                        accessTokenLength: (_b = this.accessToken) === null || _b === void 0 ? void 0 : _b.length,
                    });
                    return true;
                }
            }
        }
        catch (error) {
            console.warn("Failed to sync tokens from authStore:", error);
        }
        return false;
    }
    request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, options = {}) {
            // Try to sync tokens from authStore first
            if (!this.accessToken) {
                this.syncTokensFromAuthStore();
            }
            const url = `${this.baseURL}${endpoint}`;
            const headers = Object.assign({ "Content-Type": "application/json" }, options.headers);
            // Add authorization header if token exists
            if (this.accessToken) {
                headers.Authorization = `Bearer ${this.accessToken}`;
                console.log("Adding Authorization header:", `Bearer ${this.accessToken.substring(0, 20)}...`);
            }
            else {
                console.warn("No access token available for request to:", endpoint);
            }
            console.log("this.accessToken", this.accessToken);
            try {
                const response = yield fetch(url, Object.assign(Object.assign({}, options), { headers }));
                const data = yield response.json();
                if (!response.ok) {
                    // Handle 401 Unauthorized - try to refresh token
                    if (response.status === 401 &&
                        this.refreshToken &&
                        endpoint !== "/auth/refresh") {
                        try {
                            yield this.refreshAccessToken();
                            // Retry the original request with new token
                            return this.request(endpoint, options);
                        }
                        catch (refreshError) {
                            this.clearTokens();
                            throw new ApiError("Session expired. Please login again.", 401);
                        }
                    }
                    throw new ApiError(data.message || `HTTP ${response.status}: ${response.statusText}`, response.status, data.errors);
                }
                return data;
            }
            catch (error) {
                if (error instanceof ApiError) {
                    throw error;
                }
                throw new ApiError(error instanceof Error ? error.message : "Network error occurred", 0);
            }
        });
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.refreshToken) {
                throw new Error("No refresh token available");
            }
            try {
                const response = yield fetch(`${this.baseURL}/auth/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refreshToken: this.refreshToken }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to refresh token: ${response.status}`);
                }
                const data = yield response.json();
                if (!data.success || !((_a = data.data) === null || _a === void 0 ? void 0 : _a.tokens)) {
                    throw new Error("Invalid refresh token response");
                }
                const { accessToken, refreshToken } = data.data.tokens;
                this.saveTokensToStorage(accessToken, refreshToken);
            }
            catch (error) {
                // Clear tokens on refresh failure
                this.clearTokens();
                throw error;
            }
        });
    }
    // Public methods
    get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, { method: "GET" });
        });
    }
    post(endpoint, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: "POST",
                body: body ? JSON.stringify(body) : undefined,
            });
        });
    }
    put(endpoint, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: "PUT",
                body: body ? JSON.stringify(body) : undefined,
            });
        });
    }
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, { method: "DELETE" });
        });
    }
    setTokens(accessToken, refreshToken) {
        this.saveTokensToStorage(accessToken, refreshToken);
    }
    reloadTokens() {
        this.loadTokensFromStorage();
    }
    // Method to manually set tokens (called by auth hooks)
    forceSetTokens(accessToken, refreshToken) {
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
    constructor(message, status, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
        this.name = "ApiError";
    }
}
// Export singleton instance
export const httpClient = new HttpClient();
