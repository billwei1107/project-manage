import { create } from 'zustand';

/**
 * @file useAuthStore.ts
 * @description Authentication State Management
 * @description_en Manages user session, login status, and roles
 * @description_zh 管理用戶會話、登入狀態與角色權限
 */

export type UserRole = 'ADMIN' | 'CLIENT' | 'DEV';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

import api from '../api/axios';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/v1/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Login failed',
                isLoading: false
            });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
    },
}));
