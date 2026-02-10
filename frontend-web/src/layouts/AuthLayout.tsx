import { Box, Container, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

/**
 * @file AuthLayout.tsx
 * @description Authentication Layout
 * @description_en Layout wrapper for login/register pages
 * @description_zh 登入/註冊頁面的版面配置
 */

export default function AuthLayout() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                padding: 3,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom color="primary">
                        Project Manage
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Sign in to continue
                    </Typography>

                    {/* Child pages (Login, etc.) render here */}
                    <Outlet />
                </Paper>
            </Container>
        </Box>
    );
}
