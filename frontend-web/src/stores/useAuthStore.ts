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
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: (user) => set({ user, isAuthenticated: true }),

    logout: () => set({ user: null, isAuthenticated: false }),
}));
