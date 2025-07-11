var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    isAuthenticated: false,
    tokens: null,
    setUser: (user) => {
        set({ user });
    },
    setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
    },
    setTokens: (tokens) => {
        set({ tokens });
    },
    logout: () => {
        set({ user: null, isAuthenticated: false, tokens: null });
    },
    // Legacy methods for backward compatibility - these will be deprecated
    login: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate API call
        yield new Promise(resolve => setTimeout(resolve, 1000));
        // Mock authentication - in real app, this would call your API
        if (email === 'demo@example.com' && password === 'password') {
            const user = {
                id: '1',
                name: 'Demo User',
                email: 'demo@example.com',
                avatar: '/api/placeholder/120/120'
            };
            set({ user, isAuthenticated: true });
            return true;
        }
        return false;
    }),
    register: (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate API call
        yield new Promise(resolve => setTimeout(resolve, 1000));
        // Mock registration - in real app, this would call your API
        const user = {
            id: Date.now().toString(),
            name,
            email,
            avatar: '/api/placeholder/120/120'
        };
        set({ user, isAuthenticated: true });
        return true;
    })
}), {
    name: 'auth-storage',
    partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokens: state.tokens
    }),
}));
