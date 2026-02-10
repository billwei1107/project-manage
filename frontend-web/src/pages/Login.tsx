import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * @file Login.tsx
 * @description Login Page
 * @description_en Real login form with API integration
 * @description_zh 真實登入表單，整合後端 API
 */

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) return;

        try {
            await login(email, password);
            navigate('/'); // Redirect to Dashboard on success
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center', color: 'primary.main' }}>
                Project Manage CRM
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="電子郵件"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
            />

            <TextField
                fullWidth
                label="密碼"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleLogin();
                }}
            />

            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, height: 48 }}
                onClick={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : '登入'}
            </Button>

            <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                * 請使用註冊的帳號密碼登入
            </Typography>
        </Box>
    );
}
