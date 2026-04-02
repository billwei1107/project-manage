import { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, List, ListItem, ListItemButton, ListItemAvatar, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { ConversationItem } from '../../stores/useMessengerStore';

/**
 * @file ConversationsList.tsx
 * @description Messenger 左側的對話清單元件 / Conversations List Component
 * @description_en Sidebar component for Messenger to display groups and direct messages
 * @description_zh Messenger 左側的對話清單，用來顯示群組與直接對話列表
 */

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
            width: 340,
            borderRight: '1px solid #E6EBF5',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <Box className="flex items-center justify-between p-6">
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A1629' }}>
                    對話列表
                </Typography>
                <Box className="flex gap-2">
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: 2 }} size="small">
                        <SearchIcon fontSize="small" sx={{ color: '#0A1629' }} />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#3F8CFF', borderRadius: 2, color: 'white', '&:hover': { bgcolor: '#2670e8' } }} size="small" onClick={onNewChat}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }} className="px-3 pb-4 custom-scrollbar">
                
                {/* 群組 / Groups */}
                <Box className="mb-2">
                    <Box className="flex items-center px-4 py-2 cursor-pointer text-[#3F8CFF]" onClick={() => setGroupsOpen(!groupsOpen)}>
                        {groupsOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        <Typography sx={{ fontWeight: 600, ml: 1, fontSize: 14 }}>群組 ({groups.length})</Typography>
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
                <Box>
                    <Box className="flex items-center px-4 py-2 cursor-pointer text-[#3F8CFF]" onClick={() => setDirectsOpen(!directsOpen)}>
                        {directsOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        <Typography sx={{ fontWeight: 600, ml: 1, fontSize: 14 }}>個人訊息 ({directs.length})</Typography>
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
        <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    borderRadius: 3,
                    bgcolor: isActive ? '#F4F9FD' : 'transparent',
                    borderLeft: isActive ? '4px solid #3F8CFF' : '4px solid transparent',
                    pl: 2,
                    pr: 2,
                    py: 1.5,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#F4F9FD' }
                }}
            >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Badge
                        badgeContent={conv.unreadCount}
                        sx={{
                            '& .MuiBadge-badge': {
                                bgcolor: '#F65160',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                minWidth: 18,
                                height: 18,
                                borderRadius: 9,
                                border: '2px solid white',
                                top: 4,
                                right: 4
                            }
                        }}
                    >
                        <Avatar sx={{ width: 40, height: 40, bgcolor: conv.type === 'GROUP' ? '#28D196' : '#E78175' }}>
                            {name.charAt(0)}
                        </Avatar>
                    </Badge>
                </ListItemAvatar>
                
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Box className="flex justify-between items-center mb-0.5">
                        <Typography noWrap sx={{ fontWeight: 700, color: '#0A1629', fontSize: 15 }}>
                            {name}
                        </Typography>
                        <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 600, flexShrink: 0, ml: 1 }}>
                            {time}
                        </Typography>
                    </Box>
                    <Typography noWrap sx={{ color: '#7D8592', fontSize: 13, fontWeight: conv.unreadCount > 0 ? 600 : 400 }}>
                        {conv.lastMessage || '尚無訊息'}
                    </Typography>
                </Box>
            </ListItemButton>
        </ListItem>
    );
}
