import axios from 'axios';

/**
 * @file axios.ts
 * @description Axios instance configuration
 * @description_en Configures base URL and interceptors for API requests
 * @description_zh 設定 API 請求的 Base URL 與攔截器
 */

const api = axios.create({
    baseURL: '/api', // Proxy handles this in Dev / Nginx handles in Prod
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors (e.g., 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');

            // Only redirect if not already on login page and not an /auth/me request
            const isLoginPage = window.location.pathname === '/login';
            const isAuthMeRequest = error.config?.url?.includes('/auth/me');

            if (!isLoginPage && !isAuthMeRequest) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
