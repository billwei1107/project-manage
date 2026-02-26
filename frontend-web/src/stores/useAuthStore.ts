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
    username?: string;
    employeeId?: string;
    email?: string;
    role: UserRole;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (loginId: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

import api from '../api/axios';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: !!localStorage.getItem('token'),
    error: null,

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, isLoading: false });
            return;
        }

        try {
            const response = await api.get('/v1/auth/me');
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (loginId, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/v1/auth/login', { loginId, password });
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
