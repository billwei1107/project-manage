import { useState } from 'react';
import { Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../stores/useAuthStore';

/**
 * @file Login.tsx
 * @description Login Page
 * @description_en Mock login form with role selection
 * @description_zh 模擬登入表單，包含角色選擇功能
 */

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [role, setRole] = useState<UserRole>('ADMIN');

    const handleLogin = () => {
        // Mock Login Logic
        login({
            id: '1',
            name: role === 'ADMIN' ? 'Admin User' : 'Client User',
            email: `${role.toLowerCase()}@example.com`,
            role: role,
        });

        // Redirect based on role
        if (role === 'CLIENT') {
            navigate('/client');
        } else {
            navigate('/admin');
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                    value={role}
                    exclusive
                    onChange={(_, newRole) => newRole && setRole(newRole)}
                    aria-label="role selection"
                    fullWidth
                >
                    <ToggleButton value="ADMIN">管理員 / 開發者</ToggleButton>
                    <ToggleButton value="CLIENT">客戶</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <TextField
                fullWidth
                label="電子郵件"
                variant="outlined"
                margin="normal"
                defaultValue="admin@example.com"
                disabled
            />

            <TextField
                fullWidth
                label="密碼"
                type="password"
                variant="outlined"
                margin="normal"
                defaultValue="password"
                disabled
            />

            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                onClick={handleLogin}
            >
                登入
            </Button>

            <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                * 模擬登入：密碼未經驗證
            </Typography>
        </Box>
    );
}
