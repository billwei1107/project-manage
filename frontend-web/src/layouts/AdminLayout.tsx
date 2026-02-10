import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Badge,
    useMediaQuery,
    alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * @file AdminLayout.tsx
 * @description Refactored Admin Layout
 * @description_en Includes sidebar with full navigation and modern header
 * @description_zh 重構後的後台版面，包含完整導航與現代化標頭
 */

const drawerWidth = 280;

interface NavItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

export default function AdminLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems: NavItem[] = [
        { text: '儀表板', icon: <DashboardIcon />, path: '/admin' },
        { text: '專案管理', icon: <FolderIcon />, path: '/admin/projects' },
        { text: '行事曆', icon: <CalendarMonthIcon />, path: '/admin/calendar' },
        { text: '財務報表', icon: <MonetizationOnIcon />, path: '/admin/finance' },
        { text: '訊息中心', icon: <MessageIcon />, path: '/admin/messenger' },
        { text: '員工管理', icon: <GroupIcon />, path: '/admin/employees' },
        { text: '資訊門戶', icon: <InfoIcon />, path: '/admin/info-portal' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Area */}
            <Toolbar sx={{ px: 2.5 }}>
                <Box
                    component="img"
                    // src="/logo.png" // Placeholder for logo
                    onClick={() => navigate('/admin')}
                    sx={{
                        height: 40,
                        width: 40,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        cursor: 'pointer',
                        mr: 2
                    }}
                />
                <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 800 }}>
                    PRO MANAGE
                </Typography>
            </Toolbar>

            {/* User Info Card in Sidebar */}
            <Box sx={{ mb: 5, mx: 2.5, mt: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover', // Light grey background
                    }}
                >
                    <Avatar src={user?.avatar} alt={user?.name} sx={{ mr: 2 }}>{user?.name?.charAt(0)}</Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {user?.role}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Navigation List */}
            <List sx={{ px: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: isActive ? 'action.selected' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        color: 'text.primary',
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isActive ? 'primary.main' : 'inherit'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            {/* Logout */}
            <Box sx={{ p: 2.5 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 1.5,
                        color: 'error.main',
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="登出" />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Mobile AppBar */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: { md: `calc(100% - ${drawerWidth}px)` },
                        ml: { md: `${drawerWidth}px` },
                        bgcolor: 'background.paper',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary' }}>
                            儀表板
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Desktop Header / Toolbar Actions */}
            {!isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        backdropFilter: 'blur(6px)', // Glassmorphism
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        <IconButton>
                            <Badge badgeContent={4} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 40, height: 40, cursor: 'pointer' }}>
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </Toolbar>
                </AppBar>
            )}

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
            >
                <Toolbar /> {/* Toolbar spacer */}
                <Outlet />
            </Box>
        </Box>
    );
}
