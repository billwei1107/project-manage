import React from 'react';
import {
    Box,
    Button,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

interface SettingsNavigationProps {
    onBack: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const SETTINGS_TABS = [
    { id: 'Account', icon: <PersonOutlineIcon /> },
    { id: 'Notifications', icon: <NotificationsNoneOutlinedIcon /> },
    { id: 'My Company', icon: <DomainOutlinedIcon /> },
    { id: 'Connected Apps', icon: <ExtensionOutlinedIcon /> },
    { id: 'Payments', icon: <PaymentOutlinedIcon /> },
    { id: 'Confidentiality', icon: <LockOutlinedIcon /> },
    { id: 'Safety', icon: <VerifiedUserOutlinedIcon /> },
];

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({ onBack, activeTab, onTabChange }) => {
    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: '24px',
            boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
            width: { xs: '100%', md: '280px' },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            pb: 4
        }}>
            {/* Header: Back Button */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: { xs: 2.5, md: 3 },
                pb: 2,
            }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{
                        textTransform: 'none',
                        color: '#0A1629',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 800,
                        fontSize: 18,
                        pl: 0,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    Settings
                </Button>
            </Box>

            {/* Menu List */}
            <List sx={{ px: 0, pt: 1 }}>
                {SETTINGS_TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <ListItemButton
                            key={tab.id}
                            selected={isActive}
                            onClick={() => onTabChange(tab.id)}
                            sx={{
                                py: 1.5,
                                px: { xs: 2.5, md: 3 },
                                borderLeft: isActive ? '3px solid #3F8CFF' : '3px solid transparent',
                                bgcolor: isActive ? '#F0F6FF' : 'transparent',
                                '&:hover': { bgcolor: isActive ? '#F0F6FF' : '#FAFBFC' },
                                '&.Mui-selected': {
                                    bgcolor: '#F0F6FF',
                                    '&:hover': { bgcolor: '#F0F6FF' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#3F8CFF' : '#A0AABF', '& .MuiSvgIcon-root': { fontSize: 20 } }}>
                                {tab.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={tab.id}
                                primaryTypographyProps={{
                                    fontWeight: isActive ? 700 : 600,
                                    fontSize: 14,
                                    color: isActive ? '#0A1629' : '#7D8592',
                                    fontFamily: 'Nunito Sans'
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );
};

export default SettingsNavigation;
