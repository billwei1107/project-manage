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
    Menu,
    MenuItem,
    Tooltip,
    Divider,
    ListSubheader,
    Chip,
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
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useAuthStore } from '../stores/useAuthStore';
import ChangePasswordModal from '../components/common/ChangePasswordModal';
import ProfileSettingsModal from '../components/common/ProfileSettingsModal';
import { useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useMessengerStore } from '../stores/useMessengerStore';
import { format, differenceInDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';

/**
 * @file AdminLayout.tsx
 * @description Refactored Admin Layout
 * @description_en Includes sidebar with full navigation and modern header
 * @description_zh 重構後的後台版面，包含完整導航與現代化標頭
 */

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 80;

interface NavItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

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
    const [profileModalOpen, setProfileModalOpen] = useState(false);
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
        setProfileModalOpen(true);
    };

    const handleCloseProfileModal = () => {
        setProfileModalOpen(false);
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
        { text: '資訊門戶', icon: <InfoIcon />, path: '/admin/info-portal' },
        ...(user?.role === 'ADMIN' ? [
            { text: '員工列表', icon: <GroupIcon />, path: '/admin/employees' },
            { text: '帳號管理', icon: <ManageAccountsIcon />, path: '/admin/accounts' }
        ] : []),
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Area */}
            <Toolbar sx={{ px: isCollapsed ? 1 : 2, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', position: 'relative' }}>
                <IconButton
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        mr: isCollapsed ? 0 : 1.5,
                        color: 'text.primary',
                        minWidth: 40,
                        justifyContent: 'center'
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {!isCollapsed && (
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
                        onClick={() => navigate('/admin')}
                    >
                        <Box
                            sx={{
                                height: 32,
                                width: 32,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                mr: 1.5,
                                flexShrink: 0
                            }}
                        />
                        <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '1.1rem' }}>
                            PRO MANAGE
                        </Typography>
                    </Box>
                )}
            </Toolbar>

            {/* User Info Card in Sidebar */}
            <Box sx={{ mb: 5, mx: isCollapsed ? 1 : 2.5, mt: 2 }}>
                <Tooltip title={isCollapsed ? (user?.name || '') : ''} placement="right">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            p: isCollapsed ? 1 : 2,
                            borderRadius: 2,
                            bgcolor: 'action.hover', // Light grey background
                        }}
                    >
                        <Avatar src={user?.avatar} alt={user?.name} sx={{ mr: isCollapsed ? 0 : 2 }}>{user?.name?.charAt(0)}</Avatar>
                        {!isCollapsed && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>
                                    {user?.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {user?.role}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Tooltip>
            </Box>

            {/* Navigation List */}
            <List sx={{ px: isCollapsed ? 1 : 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Tooltip title={isCollapsed ? item.text : ''} placement="right" key={item.text}>
                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 1.5,
                                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                                        px: isCollapsed ? 1 : 2,
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
                                            minWidth: isCollapsed ? 0 : 40,
                                            mr: isCollapsed ? 0 : 2,
                                            justifyContent: 'center',
                                            color: isActive ? 'primary.main' : 'inherit'
                                        }}
                                    >
                                        {item.path === '/admin/messenger' ? (
                                            <Badge badgeContent={unreadTotal} color="error" max={99}>
                                                {item.icon}
                                            </Badge>
                                        ) : item.icon}
                                    </ListItemIcon>
                                    {!isCollapsed && (
                                        <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            {/* Logout & Collapse Toggle */}
            <Box sx={{ p: isCollapsed ? 1 : 2.5, display: 'flex', flexDirection: 'column', gap: 1, pb: 2 }}>
                <Tooltip title={isCollapsed ? "登出" : ''} placement="right">
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 1.5,
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            px: isCollapsed ? 1 : 2,
                            color: 'error.main',
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                            '&:hover': {
                                bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, mr: isCollapsed ? 0 : 2, justifyContent: 'center', color: 'error.main' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary="登出" />}
                    </ListItemButton>
                </Tooltip>

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
                        width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                        ml: { md: `${currentDrawerWidth}px` },
                        bgcolor: 'background.paper',
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: isCollapsed ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                        }),
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
                        width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
                        ml: { md: `${currentDrawerWidth}px` },
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: isCollapsed ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                        }),
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
                        <IconButton onClick={handleNotifOpen}>
                            <Badge badgeContent={reminders.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Menu
                            anchorEl={notifAnchorEl}
                            open={Boolean(notifAnchorEl)}
                            onClose={handleNotifClose}
                            PaperProps={{
                                elevation: 3,
                                sx: { mt: 1.5, minWidth: 280, maxWidth: 350, maxHeight: 400 }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <ListSubheader sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>
                                到期任務提醒 ({reminders.length})
                            </ListSubheader>
                            <Divider />
                            {reminders.length === 0 ? (
                                <MenuItem disabled>
                                    <ListItemText primary="目前沒有即將到期的任務" />
                                </MenuItem>
                            ) : (
                                reminders.map((task) => {
                                    const isOverdue = new Date(task.deadline) < new Date();
                                    const daysLeft = differenceInDays(new Date(task.deadline), new Date());

                                    return (
                                        <MenuItem
                                            key={task.id}
                                            onClick={() => {
                                                handleNotifClose();
                                                navigate(`/admin/projects/${task.projectId}`);
                                            }}
                                            sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                                                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, flexGrow: 1, mr: 1 }}>
                                                    {task.title}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={isOverdue ? '已逾期' : `剩餘 ${daysLeft} 天`}
                                                    color={isOverdue ? 'error' : 'warning'}
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                到期日: {format(new Date(task.deadline), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                                            </Typography>
                                        </MenuItem>
                                    );
                                })
                            )}
                        </Menu>

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
                    </Toolbar>
                </AppBar>
            )}

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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                    }}
                >
                    {drawer}
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
                        },
                    }}
                    open
                >
                    {drawer}
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
                <Toolbar /> {/* Toolbar spacer */}
                <Outlet />
            </Box>

            {/* Modals */}
            <ChangePasswordModal open={pwModalOpen} onClose={handleClosePwModal} />
            <ProfileSettingsModal open={profileModalOpen} onClose={handleCloseProfileModal} />
        </Box>
    );
}
