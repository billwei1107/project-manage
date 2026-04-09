import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Popover,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * @file NotificationsDropdown.tsx
 * @description 通知下拉選單元件 / Notifications Dropdown Component
 * @description_en High-fidelity notifications dropdown displaying recent activity
 * @description_zh 顯示近期活動的高保真通知下拉選單
 */

interface NotificationsDropdownProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

// ========================================
// 靜態模擬資料 / Mock Data
// ========================================
type ActionType = 'COMMENT' | 'STATUS_UPDATE' | 'ASSIGNMENT';

interface NotificationItem {
    id: string;
    userName: string;
    userAvatar: string;
    actionType: ActionType;
    actionText: string;
    targetName: string;
    newStatus?: string;
    timeLabel: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'n1',
        userName: 'Emily Tyler',
        userAvatar: '/avatars/emily.png', // Fallbacks will use initial 'E'
        actionType: 'COMMENT',
        actionText: 'sent you a comment in',
        targetName: 'Research task',
        timeLabel: '2h ago'
    },
    {
        id: 'n2',
        userName: 'Evan Yates', // Assuming Evan or similar
        userAvatar: '/avatars/evan.png',
        actionType: 'STATUS_UPDATE',
        actionText: 'Updated the status of',
        targetName: 'Mind Map',
        newStatus: 'In Progress',
        timeLabel: '6h ago'
    },
    {
        id: 'n3',
        userName: 'Blake Silva',
        userAvatar: '/avatars/blake.png',
        actionType: 'ASSIGNMENT',
        actionText: 'assigned the issue in you',
        targetName: '',
        timeLabel: 'Today 9:30 am'
    },
    {
        id: 'n4',
        userName: 'Emily Tyler',
        userAvatar: '/avatars/emily.png',
        actionType: 'COMMENT',
        actionText: 'sent you a comment in',
        targetName: 'Research task',
        timeLabel: 'Tomorrow 2:30 pm'
    },
    {
        id: 'n5',
        userName: 'Evan Yates',
        userAvatar: '/avatars/evan.png',
        actionType: 'STATUS_UPDATE',
        actionText: 'Updated the status of',
        targetName: 'Mind Map',
        newStatus: 'In Progress',
        timeLabel: 'Tomorrow 1:45 pm'
    },
    {
        id: 'n6',
        userName: 'Blake Silva',
        userAvatar: '/avatars/blake.png',
        actionType: 'ASSIGNMENT',
        actionText: 'assigned the issue in you',
        targetName: '',
        timeLabel: 'Sep 12 | 10:54 am'
    },
    {
        id: 'n7',
        userName: 'Emily Tyler',
        userAvatar: '/avatars/emily.png',
        actionType: 'COMMENT',
        actionText: 'sent you a comment in',
        targetName: 'Research task',
        timeLabel: 'Sep 12 | 9:05 am'
    },
    {
        id: 'n8',
        userName: 'Evan Yates',
        userAvatar: '/avatars/evan.png',
        actionType: 'STATUS_UPDATE',
        actionText: 'Updated the status of',
        targetName: 'Mind Map',
        newStatus: 'In Progress',
        timeLabel: 'Sep 11 | 8:15 pm'
    }
];

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ anchorEl, onClose }) => {
    const open = Boolean(anchorEl);

    // ========================================
    // 渲染通知內容區塊 / Render Notification Content
    // ========================================
    const renderContent = (item: NotificationItem) => {
        if (item.actionType === 'COMMENT') {
            return (
                <Typography sx={{ color: '#4E5D78', fontSize: 14, fontFamily: 'Nunito Sans', lineHeight: 1.5 }}>
                    <Box component="span" sx={{ color: '#0A1629', fontWeight: 700 }}>{item.userName}</Box> {item.actionText} <Box component="span" sx={{ color: '#0A1629', fontWeight: 700 }}>{item.targetName}</Box>
                </Typography>
            );
        }
        
        if (item.actionType === 'STATUS_UPDATE') {
            return (
                <Typography sx={{ color: '#4E5D78', fontSize: 14, fontFamily: 'Nunito Sans', lineHeight: 1.5 }}>
                    {item.actionText} <Box component="span" sx={{ color: '#0A1629', fontWeight: 700 }}>{item.targetName}</Box> task to <Box component="span" sx={{ color: '#3F8CFF', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>{item.newStatus}</Box>
                </Typography>
            );
        }

        if (item.actionType === 'ASSIGNMENT') {
            return (
                <Typography sx={{ color: '#4E5D78', fontSize: 14, fontFamily: 'Nunito Sans', lineHeight: 1.5 }}>
                    <Box component="span" sx={{ color: '#0A1629', fontWeight: 700 }}>{item.userName}</Box> {item.actionText}
                </Typography>
            );
        }

        return null;
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                elevation: 0,
                sx: {
                    mt: 2,
                    width: 380,
                    maxHeight: 560,
                    borderRadius: '24px',
                    boxShadow: '0px 20px 60px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                pt: 3,
                pb: 2,
            }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans' }}>
                    Notifications
                </Typography>
                <IconButton 
                    onClick={onClose}
                    sx={{ 
                        bgcolor: '#F4F9FD', 
                        borderRadius: '12px',
                        width: 36,
                        height: 36,
                        '&:hover': { bgcolor: '#E6EDF5' }
                    }}
                >
                    <CloseIcon sx={{ color: '#0A1629', fontSize: 20 }} />
                </IconButton>
            </Box>

            {/* List Body */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 2 }}>
                {MOCK_NOTIFICATIONS.map((item, index) => (
                    <Box key={item.id}>
                        {index > 0 && <Divider sx={{ borderColor: '#F0F2F5', my: 1 }} />}
                        
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            py: 1.5,
                            pl: 1,
                            pr: 1,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                bgcolor: '#FAFBFC'
                            }
                        }}>
                            {/* Avatar */}
                            <Avatar 
                                src={item.userAvatar} 
                                sx={{ width: 40, height: 40, bgcolor: '#3F8CFF', fontSize: 16 }}
                            >
                                {item.userName.charAt(0)}
                            </Avatar>

                            {/* Content */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {renderContent(item)}
                                <Typography sx={{ fontSize: 12, color: '#A0AABF', fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                    {item.timeLabel}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Popover>
    );
};

export default NotificationsDropdown;
