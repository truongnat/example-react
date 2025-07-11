import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: (failureCount, error) => {
                // Don't retry on 4xx errors except 408, 429
                if ((error === null || error === void 0 ? void 0 : error.status) >= 400 && (error === null || error === void 0 ? void 0 : error.status) < 500 && ![408, 429].includes(error === null || error === void 0 ? void 0 : error.status)) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            // onError is deprecated in newer versions of TanStack Query
            // Use global error boundary or individual query error handling instead
        },
        mutations: {
            retry: (failureCount, error) => {
                // Don't retry on 4xx errors except 408, 429
                if ((error === null || error === void 0 ? void 0 : error.status) >= 400 && (error === null || error === void 0 ? void 0 : error.status) < 500 && ![408, 429].includes(error === null || error === void 0 ? void 0 : error.status)) {
                    return false;
                }
                return failureCount < 2;
            },
            // onError is deprecated in newer versions of TanStack Query
        },
    },
});
