import { useState } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChangePasswordModal from '../components/common/ChangePasswordModal';
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

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [pwModalOpen, setPwModalOpen] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenPwModal = () => {
        handleMenuClose();
        setPwModalOpen(true);
    };

    const handleClosePwModal = () => {
        setPwModalOpen(false);
    };

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
                            <Avatar
                                src={user?.avatar}
                                alt={user?.name}
                                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                                onClick={handleMenuOpen}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 3,
                                    sx: { mt: 1.5, minWidth: 150 }
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem disabled>
                                    <ListItemText primary={user?.name} secondary={user?.role} />
                                </MenuItem>
                                <MenuItem onClick={handleOpenPwModal}>
                                    <ListItemIcon sx={{ minWidth: 28 }}><ManageAccountsIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="修改密碼" />
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                    <ListItemIcon sx={{ minWidth: 28, color: 'error.main' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="登出" />
                                </MenuItem>
                            </Menu>
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

            <ChangePasswordModal open={pwModalOpen} onClose={handleClosePwModal} />
        </Box>
    );
}
