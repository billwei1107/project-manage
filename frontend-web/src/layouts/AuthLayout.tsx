import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

/**
 * @file AuthLayout.tsx
 * @description Authentication Layout
 * @description_en Full-screen background layout for auth pages
 * @description_zh 提供滿版淺灰色背景的登入註冊用 Layout
 */

export default function AuthLayout() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#F4F9FD', // Light greyish background matching Figma
                p: { xs: 2, md: 4 },
            }}
        >
            <Outlet />
        </Box>
    );
}
