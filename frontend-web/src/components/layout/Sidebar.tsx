import {
    Box,
    Toolbar,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Badge,
    alpha,
    Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export interface NavItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    menuItems: NavItem[];
    currentPath: string;
    onNavigate: (path: string) => void;
    onLogout: () => void;
    unreadTotal: number;
}

export default function Sidebar({
    isCollapsed,
    onToggleCollapse,
    menuItems,
    currentPath,
    onNavigate,
    onLogout,
    unreadTotal
}: SidebarProps) {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
            <Toolbar sx={{ px: isCollapsed ? 1 : 4, height: 100, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', mb: 2 }}>
                <IconButton
                    onClick={onToggleCollapse}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        mr: isCollapsed ? 0 : 1.5,
                        color: '#0A1629',
                        minWidth: 40,
                        justifyContent: 'center'
                    }}
                >
                    <MenuIcon />
                </IconButton>
                {!isCollapsed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }} onClick={() => onNavigate('/admin')}>
                        <Box sx={{
                            height: 48,
                            width: 48,
                            borderRadius: '12px',
                            bgcolor: '#3F8CFF',
                            mr: 2,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            position: 'relative'
                        }}>
                            <Box sx={{ width: 14, height: 20, bgcolor: '#fff', borderRadius: '4px', position: 'absolute', left: 12, top: 14 }} />
                            <Box sx={{ width: 6, height: 6, bgcolor: '#fff', borderRadius: '50%', position: 'absolute', right: 12, bottom: 14 }} />
                        </Box>
                        <Typography variant="h6" noWrap sx={{ color: '#0A1629', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'Nunito Sans' }}>
                            專案管理系統
                        </Typography>
                    </Box>
                )}
            </Toolbar>

            <List sx={{ px: isCollapsed ? 1 : 2, flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Tooltip title={isCollapsed ? item.text : ''} placement="right" key={item.text}>
                            <ListItem disablePadding sx={{ mb: 1.5 }}>
                                <ListItemButton
                                    onClick={() => onNavigate(item.path)}
                                    sx={{
                                        borderRadius: '10px',
                                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                                        px: isCollapsed ? 1 : 2.5,
                                        py: 1.5,
                                        bgcolor: isActive ? alpha('#3F8CFF', 0.1) : 'transparent',
                                        color: isActive ? '#3F8CFF' : '#7D8592',
                                        position: 'relative',
                                        '&:hover': {
                                            bgcolor: alpha('#3F8CFF', 0.05),
                                            color: '#3F8CFF',
                                        },
                                        // Left indicator bar for active item
                                        '&::before': isActive && !isCollapsed ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: -12,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 4,
                                            height: 36,
                                            bgcolor: '#3F8CFF',
                                            borderRadius: 2,
                                        } : {}
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: isCollapsed ? 0 : 40,
                                            mr: isCollapsed ? 0 : 1.5,
                                            justifyContent: 'center',
                                            color: 'inherit'
                                        }}
                                    >
                                        {item.path === '/admin/messenger' ? (
                                            <Badge badgeContent={unreadTotal} color="error" max={99}>
                                                {item.icon}
                                            </Badge>
                                        ) : item.icon}
                                    </ListItemIcon>
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontWeight: isActive ? 700 : 600,
                                                fontSize: '1rem',
                                                fontFamily: 'Nunito Sans'
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>

            <Box sx={{ p: isCollapsed ? 1 : 3, display: 'flex', flexDirection: 'column', gap: 2, pb: 4 }}>
                {!isCollapsed ? (
                    <Button
                        variant="contained"
                        startIcon={<SupportAgentIcon />}
                        sx={{
                            bgcolor: '#3F8CFF',
                            color: '#fff',
                            borderRadius: '14px',
                            py: 1.5,
                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                            fontWeight: 700,
                            fontFamily: 'Nunito Sans',
                            justifyContent: 'flex-start',
                            px: 3
                        }}
                    >
                        客服支援
                    </Button>
                ) : (
                    <IconButton sx={{ bgcolor: '#3F8CFF', color: '#fff', borderRadius: '14px', p: 1.5 }}>
                        <SupportAgentIcon />
                    </IconButton>
                )}

                <Tooltip title={isCollapsed ? "登出" : ''} placement="right">
                    <ListItemButton
                        onClick={onLogout}
                        sx={{
                            borderRadius: '10px',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            px: isCollapsed ? 1 : 3,
                            py: 1.5,
                            color: '#7D8592',
                            '&:hover': {
                                color: '#0A1629',
                                bgcolor: 'transparent'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, mr: isCollapsed ? 0 : 1.5, justifyContent: 'center', color: 'inherit' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary="登出" primaryTypographyProps={{ fontWeight: 600, fontFamily: 'Nunito Sans', fontSize: '1rem' }} />}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
