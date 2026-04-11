import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Drawer,
    useMediaQuery,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Toolbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlightIcon from '@mui/icons-material/Flight';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuthStore } from '../stores/useAuthStore';
import ChangePasswordModal from '../components/common/ChangePasswordModal';
import { useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useMessengerStore } from '../stores/useMessengerStore';
import Sidebar, { type NavItem } from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import NotificationsDropdown from '../components/layout/NotificationsDropdown';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 80;

export default function AdminLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // 心跳機制：每 3 分鐘回報一次在線狀態
    useEffect(() => {
        const sendHeartbeat = () => {
            axiosInstance.post('/v1/hr/heartbeat').catch(err => console.error("Heartbeat failed", err));
        };
        sendHeartbeat(); // 發送一次初始心跳
        const intervalId = setInterval(sendHeartbeat, 3 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const currentDrawerWidth = isCollapsed && !isMobile ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { unreadTotal, fetchUnreadCount, connectWebSocket, disconnectWebSocket } = useMessengerStore();

    // 取得未讀數與連線 WebSocket / Fetch unread count & connect WS on mount
    useEffect(() => {
        fetchUnreadCount();
        connectWebSocket();
        return () => disconnectWebSocket();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
    const [pwModalOpen, setPwModalOpen] = useState(false);
    const [reminders, setReminders] = useState<any[]>([]);

    const fetchReminders = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/v1/tasks/reminders');
            setReminders(res.data);
        } catch (error) {
            console.error("Failed to fetch reminders", error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchReminders();
        }
    }, [user, fetchReminders]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    const handleOpenPwModal = () => {
        handleMenuClose();
        setPwModalOpen(true);
    };

    const handleClosePwModal = () => {
        setPwModalOpen(false);
    };

    const handleOpenProfileModal = () => {
        handleMenuClose();
        navigate('/admin/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems: NavItem[] = [
        { text: '儀表板', icon: <DashboardIcon />, path: '/admin' },
        { text: '專案管理', icon: <FolderIcon />, path: '/admin/projects' },
        { text: '行事曆', icon: <CalendarMonthIcon />, path: '/admin/calendar' },
        { text: '差勤管理', icon: <FlightIcon sx={{ transform: 'rotate(45deg)' }} />, path: '/admin/vacations' },
        { text: '員工管理', icon: <GroupIcon />, path: '/admin/employees' },
        { text: '即時通訊', icon: <MessageIcon />, path: '/admin/messenger' },
        { text: '資訊中心', icon: <InfoIcon />, path: '/admin/info-portal' },
        ...(user?.role === 'ADMIN' ? [
            { text: '帳號管理', icon: <ManageAccountsIcon />, path: '/admin/accounts' }
        ] : []),
    ];

    return (
        <Box sx={{ display: 'flex', bgcolor: '#F4F9FD', minHeight: '100vh' }}>
            <CssBaseline />

            <Header
                isMobile={isMobile}
                currentDrawerWidth={currentDrawerWidth}
                isCollapsed={isCollapsed}
                onDrawerToggle={handleDrawerToggle}
                user={user}
                remindersCount={reminders.length}
                onNotifOpen={handleNotifOpen}
                onMenuOpen={handleMenuOpen}
            />

            {/* Menus mounted globally but anchored to Header elements */}
            <NotificationsDropdown anchorEl={notifAnchorEl} onClose={handleNotifClose} />

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
                <MenuItem onClick={handleOpenProfileModal}>
                    <ListItemIcon sx={{ minWidth: 28 }}><ManageAccountsIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="個人設定" />
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

            <Box
                component="nav"
                sx={{
                    width: { md: currentDrawerWidth },
                    flexShrink: { md: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: isCollapsed ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                    }),
                }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
                    }}
                >
                    <Sidebar
                        isCollapsed={false}
                        onToggleCollapse={() => { }}
                        menuItems={menuItems}
                        currentPath={location.pathname}
                        onNavigate={navigate}
                        onLogout={handleLogout}
                        unreadTotal={unreadTotal}
                    />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: currentDrawerWidth,
                            overflowX: 'hidden',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: isCollapsed ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                            }),
                            borderRight: 'none',
                        },
                    }}
                    open
                >
                    <Sidebar
                        isCollapsed={isCollapsed}
                        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                        menuItems={menuItems}
                        currentPath={location.pathname}
                        onNavigate={navigate}
                        onLogout={handleLogout}
                        unreadTotal={unreadTotal}
                    />
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
                    maxWidth: '100%',
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: isCollapsed ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Toolbar /> {/* Toolbar spacer for header */}
                <Outlet />
            </Box>

            {/* Modals */}
            <ChangePasswordModal open={pwModalOpen} onClose={handleClosePwModal} />
        </Box>
    );
}
