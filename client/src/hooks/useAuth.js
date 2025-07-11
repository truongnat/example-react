import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { httpClient } from '@/lib/http-client';
import { useAuthStore } from '@/stores/authStore';
// Query keys
export const authKeys = {
    all: ['auth'],
    me: () => [...authKeys.all, 'me'],
};
// Get current user query
export const useCurrentUser = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: authService.getCurrentUser,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            // Don't retry on 401 errors
            if ((error === null || error === void 0 ? void 0 : error.status) === 401)
                return false;
            return failureCount < 3;
        },
    });
};
// Login mutation
export const useLogin = () => {
    const queryClient = useQueryClient();
    const { setUser, setAuthenticated, setTokens } = useAuthStore();
    return useMutation({
        mutationFn: (credentials) => authService.login(credentials),
        onSuccess: (data) => {
            var _a, _b;
            console.log('Login mutation onSuccess, received data:', {
                hasUser: !!data.user,
                hasTokens: !!data.tokens,
                accessTokenLength: (_b = (_a = data.tokens) === null || _a === void 0 ? void 0 : _a.accessToken) === null || _b === void 0 ? void 0 : _b.length
            });
            // Update auth store
            setUser({
                id: data.user.id,
                name: data.user.username,
                email: data.user.email,
                avatar: data.user.avatarUrl,
            });
            setAuthenticated(true);
            setTokens(data.tokens);
            // Force set tokens in HTTP client to ensure they're available immediately
            httpClient.forceSetTokens(data.tokens.accessToken, data.tokens.refreshToken);
            // Also save to localStorage
            httpClient.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
            // Set user data in query cache
            queryClient.setQueryData(authKeys.me(), data.user);
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });
};
// Register mutation
export const useRegister = () => {
    const queryClient = useQueryClient();
    const { setUser, setAuthenticated, setTokens } = useAuthStore();
    return useMutation({
        mutationFn: (userData) => authService.register(userData),
        onSuccess: (data) => {
            // Update auth store
            setUser({
                id: data.user.id,
                name: data.user.username,
                email: data.user.email,
                avatar: data.user.avatarUrl,
            });
            setAuthenticated(true);
            setTokens(data.tokens);
            // Set user data in query cache
            queryClient.setQueryData(authKeys.me(), data.user);
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
        onError: (error) => {
            console.error('Registration failed:', error);
        },
    });
};
// Logout mutation
export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout: logoutStore } = useAuthStore();
    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            // Clear auth store
            logoutStore();
            // Clear all queries
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // Even if logout fails, clear local state
            logoutStore();
            queryClient.clear();
        },
    });
};
// Forgot password mutation
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data) => authService.forgotPassword(data),
    });
};
// Verify OTP mutation
export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (data) => authService.verifyOtp(data),
    });
};
// Reset password mutation
export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data) => authService.resetPassword(data),
    });
};
// Change password mutation
export const useChangePassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => authService.changePassword(data),
        onSuccess: () => {
            // Invalidate user data
            queryClient.invalidateQueries({ queryKey: authKeys.me() });
        },
    });
};
