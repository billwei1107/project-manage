import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Badge,
    InputBase
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

interface HeaderProps {
    isMobile: boolean;
    currentDrawerWidth: number;
    isCollapsed: boolean;
    onDrawerToggle: () => void;
    user: any;
    remindersCount: number;
    onNotifOpen: (e: React.MouseEvent<HTMLElement>) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function Header({
    isMobile,
    currentDrawerWidth,
    isCollapsed,
    onDrawerToggle,
    user,
    remindersCount,
    onNotifOpen,
    onMenuOpen
}: HeaderProps) {
    return (
        <AppBar
            position="fixed"
            sx={{
                width: { xs: '100%', md: `calc(100% - ${currentDrawerWidth}px)` },
                ml: { md: `${currentDrawerWidth}px` },
                bgcolor: 'transparent',
                boxShadow: 'none',
                transition: (theme) => theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: isCollapsed ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
                }),
                pt: { xs: 1, md: 3 },
                px: { xs: 2, md: 4 }
            }}
        >
            <Toolbar disableGutters sx={{ gap: 3, justifyContent: 'space-between' }}>
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{ mr: 2, color: '#0A1629' }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Search Bar - Figma Style */}
                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    bgcolor: '#FFFFFF',
                    borderRadius: '14px',
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
                    px: 2,
                    py: 1,
                    width: 412,
                    height: 48
                }}>
                    <SearchIcon sx={{ color: '#7D8592', mr: 2 }} />
                    <InputBase
                        placeholder="搜尋"
                        sx={{ flex: 1, fontFamily: 'Nunito Sans', color: '#0A1629', fontSize: 16 }}
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Selected Date Range - Figma Style */}
                <Box sx={{
                    display: { xs: 'none', lg: 'flex' },
                    alignItems: 'center',
                    bgcolor: '#E6EDF5',
                    borderRadius: '14px',
                    px: 2,
                    height: 48
                }}>
                    <Typography sx={{ color: '#0A1629', fontFamily: 'Nunito Sans', fontSize: 16, fontWeight: 400, mr: 1.5 }}>
                        2024年11月16日 - 2024年12月16日
                    </Typography>
                    <CalendarTodayOutlinedIcon sx={{ color: '#0A1629', fontSize: 20 }} />
                </Box>

                {/* Notifications - Figma Style */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#FFFFFF',
                    borderRadius: '14px',
                    width: 48,
                    height: 48,
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
                    cursor: 'pointer'
                }} onClick={onNotifOpen}>
                    <Badge badgeContent={remindersCount} color="error">
                        <NotificationsNoneIcon sx={{ color: '#0A1629' }} />
                    </Badge>
                </Box>

                {/* Profile - Figma Style */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#FFFFFF',
                    borderRadius: '14px',
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
                    px: 2,
                    py: 1,
                    height: 48,
                    cursor: 'pointer'
                }} onClick={onMenuOpen}>
                    <Avatar
                        src={user?.avatar}
                        alt={user?.name}
                        sx={{ width: 30, height: 30, mr: 1.5 }}
                    >
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Typography sx={{ color: '#0A1629', fontFamily: 'Nunito Sans', fontSize: 16, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
                        {user?.name || '使用者'}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
