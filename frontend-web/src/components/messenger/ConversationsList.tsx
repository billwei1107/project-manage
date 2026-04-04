import { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, List, ListItem, ListItemButton, ListItemAvatar, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { ConversationItem } from '../../stores/useMessengerStore';

interface ConversationsListProps {
    conversations: ConversationItem[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onNewChat: () => void;
    getConversationName: (conv: ConversationItem) => string;
}

export default function ConversationsList({ conversations, activeId, onSelect, onNewChat, getConversationName }: ConversationsListProps) {
    const [groupsOpen, setGroupsOpen] = useState(true);
    const [directsOpen, setDirectsOpen] = useState(true);

    const groups = conversations.filter(c => c.type === 'GROUP');
    const directs = conversations.filter(c => c.type === 'DIRECT');

    const formatTime = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <Box sx={{
            width: 360,
            borderRight: '1px solid #E6EBF5',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <Box className="flex items-center justify-between px-6 py-6 border-b border-[#E6EBF5]">
                <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 18 }}>
                    對話列表
                </Typography>
                <Box className="flex gap-2">
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: '12px' }} size="small">
                        <SearchIcon fontSize="small" sx={{ color: '#0A1629' }} />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#3F8CFF', borderRadius: '12px', color: 'white', '&:hover': { bgcolor: '#2670e8' } }} size="small" onClick={onNewChat}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }} className="pb-4 custom-scrollbar">
                
                {/* 群組 / Groups */}
                <Box className="mt-4">
                    <Box className="flex items-center px-6 py-2 cursor-pointer text-[#3F8CFF]" onClick={() => setGroupsOpen(!groupsOpen)}>
                        {groupsOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        <Typography sx={{ fontWeight: 600, ml: 1, fontSize: 16 }}>群組</Typography>
                    </Box>
                    <Collapse in={groupsOpen}>
                        <List disablePadding>
                            {groups.map(conv => (
                                <ConversationListItem
                                    key={conv.id}
                                    conv={conv}
                                    isActive={activeId === conv.id}
                                    name={getConversationName(conv)}
                                    time={formatTime(conv.lastMessageAt)}
                                    onClick={() => onSelect(conv.id)}
                                />
                            ))}
                        </List>
                    </Collapse>
                </Box>

                {/* 個人訊息 / Direct Messages */}
                <Box className="mt-2">
                    <Box className="flex items-center px-6 py-2 cursor-pointer text-[#3F8CFF]" onClick={() => setDirectsOpen(!directsOpen)}>
                        {directsOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        <Typography sx={{ fontWeight: 600, ml: 1, fontSize: 16 }}>個人訊息</Typography>
                    </Box>
                    <Collapse in={directsOpen}>
                        <List disablePadding>
                            {directs.map(conv => (
                                <ConversationListItem
                                    key={conv.id}
                                    conv={conv}
                                    isActive={activeId === conv.id}
                                    name={getConversationName(conv)}
                                    time={formatTime(conv.lastMessageAt)}
                                    onClick={() => onSelect(conv.id)}
                                />
                            ))}
                        </List>
                    </Collapse>
                </Box>

            </Box>
        </Box>
    );
}

function ConversationListItem({ conv, isActive, name, time, onClick }: any) {
    return (
        <ListItem disablePadding sx={{ px: 2, mb: 0.5 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    borderRadius: '14px',
                    bgcolor: isActive ? '#F4F9FD' : 'transparent',
                    pl: 2,
                    pr: 2,
                    py: 1.5,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#F4F9FD' }
                }}
            >
                <ListItemAvatar sx={{ minWidth: 54 }}>
                    <Badge
                        badgeContent={conv.unreadCount > 0 ? (conv.unreadCount > 99 ? '99+' : conv.unreadCount) : null}
                        sx={{
                            '& .MuiBadge-badge': {
                                bgcolor: '#F65160',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                minWidth: 20,
                                height: 20,
                                borderRadius: 10,
                                border: '2px solid white',
                                top: 5,
                                right: 5,
                                padding: '0 4px',
                            }
                        }}
                    >
                        <Avatar sx={{ width: 40, height: 40, bgcolor: conv.type === 'GROUP' ? '#28D196' : '#63A2FF' }}>
                            {name.charAt(0)}
                        </Avatar>
                    </Badge>
                </ListItemAvatar>
                
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Box className="flex justify-between items-center mb-0.5">
                        <Typography noWrap sx={{ fontWeight: 700, color: '#0A1629', fontSize: 16 }}>
                            {name}
                        </Typography>
                        <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 600, flexShrink: 0, ml: 1 }}>
                            {time}
                        </Typography>
                    </Box>
                    <Typography noWrap sx={{ color: '#91929E', fontSize: 14, fontWeight: conv.unreadCount > 0 ? 600 : 400 }}>
                        {conv.lastMessage || '尚無訊息...'}
                    </Typography>
                </Box>
            </ListItemButton>
        </ListItem>
    );
}
