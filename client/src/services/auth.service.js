var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { httpClient } from '@/lib/http-client';
export class AuthService {
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield httpClient.post('/auth/login', credentials);
            if (response.success && response.data) {
                // Store tokens in HTTP client
                console.log('Login successful, storing tokens:', {
                    hasAccessToken: !!response.data.tokens.accessToken,
                    hasRefreshToken: !!response.data.tokens.refreshToken,
                    accessTokenLength: (_a = response.data.tokens.accessToken) === null || _a === void 0 ? void 0 : _a.length
                });
                httpClient.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
                return response.data;
            }
            throw new Error(response.message || 'Login failed');
        });
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post('/auth/register', userData);
            if (response.success && response.data) {
                // Store tokens in HTTP client
                httpClient.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
                return response.data;
            }
            throw new Error(response.message || 'Registration failed');
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield httpClient.post('/auth/logout');
            }
            catch (error) {
                // Even if logout fails on server, clear local tokens
                console.warn('Logout request failed:', error);
            }
            finally {
                httpClient.clearAuth();
            }
        });
    }
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.get('/auth/me');
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to get user profile');
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post('/auth/forgot-password', email);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to send reset email');
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post('/auth/verify-otp', data);
            if (!response.success) {
                throw new Error(response.message || 'OTP verification failed');
            }
        });
    }
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post('/auth/reset-password', data);
            if (!response.success) {
                throw new Error(response.message || 'Password reset failed');
            }
        });
    }
    changePassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post('/auth/change-password', data);
            if (!response.success) {
                throw new Error(response.message || 'Password change failed');
            }
        });
    }
    // Helper method to check if user is authenticated
    isAuthenticated() {
        var _a, _b, _c;
        try {
            const authData = localStorage.getItem('auth-storage');
            if (authData) {
                const parsed = JSON.parse(authData);
                return ((_a = parsed.state) === null || _a === void 0 ? void 0 : _a.isAuthenticated) === true && ((_c = (_b = parsed.state) === null || _b === void 0 ? void 0 : _b.tokens) === null || _c === void 0 ? void 0 : _c.accessToken);
            }
        }
        catch (error) {
            console.warn('Failed to check authentication status:', error);
        }
        return false;
    }
}
// Export singleton instance
export const authService = new AuthService();
