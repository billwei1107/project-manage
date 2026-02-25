import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * @file ClientLayout.tsx
 * @description Client Portal Layout
 * @description_en Layout with top navigation bar for clients
 * @description_zh 客戶端版面配置，包含頂部導航列
 */

export default function ClientLayout() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="default" elevation={1}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: 'flex', fontWeight: 'bold', color: 'primary.main' }}
                        >
                            Project Manage (Client)
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: { xs: 0.5, sm: 2 }, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Button color="inherit" size="small" onClick={() => navigate('/client')} sx={{ minWidth: 'auto' }}>Overview</Button>
                            <Button color="inherit" size="small" onClick={() => navigate('/client/projects')} sx={{ minWidth: 'auto' }}>My Projects</Button>
                        </Box>

                        <Box sx={{ ml: { xs: 1, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Typography variant="caption" display="block" align="right" noWrap sx={{ maxWidth: { xs: 80, sm: 150 } }}>
                                {user?.name}
                            </Typography>
                            <Button color="error" size="small" onClick={handleLogout} sx={{ minWidth: 'auto', p: { xs: 0, sm: undefined } }}>Logout</Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet />
            </Container>

            <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="body2" color="text.secondary">
                    © 2026 Project Manage Inc.
                </Typography>
            </Box>
        </Box>
    );
}
