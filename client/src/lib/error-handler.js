import { ApiError } from './http-client';
import { useAuthStore } from '@/stores/authStore';
export class ErrorHandler {
    static handle(error) {
        if (error instanceof ApiError) {
            switch (error.status) {
                case 401:
                    // Unauthorized - clear auth and redirect to login
                    this.handleUnauthorized();
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden:', error.message);
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found:', error.message);
                    break;
                case 422:
                    // Validation error
                    console.error('Validation error:', error.errors || error.message);
                    break;
                case 500:
                    // Server error
                    console.error('Server error:', error.message);
                    break;
                default:
                    console.error('API error:', error.message);
            }
        }
        else if (error instanceof Error) {
            console.error('Application error:', error.message);
        }
        else {
            console.error('Unknown error:', error);
        }
    }
    static handleUnauthorized() {
        // Clear auth state
        const authStore = useAuthStore.getState();
        authStore.logout();
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
    }
    static isNetworkError(error) {
        return error instanceof ApiError && error.status === 0;
    }
    static isAuthError(error) {
        return error instanceof ApiError && (error.status === 401 || error.status === 403);
    }
    static isValidationError(error) {
        return error instanceof ApiError && error.status === 422;
    }
}
