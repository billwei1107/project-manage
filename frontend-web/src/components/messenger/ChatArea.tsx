import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton, InputBase, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import Badge from '@mui/material/Badge';
import { useMessengerStore } from '../../stores/useMessengerStore';
import type { Message as MessageType, ChatUser } from '../../stores/useMessengerStore';

interface ChatAreaProps {
    conversationId: string;
    conversationName: string;
    messages: MessageType[];
    currentUserId: string;
    isLoading: boolean;
    onSendMessage: (conversationId: string, content: string, messageType?: string, fileUrl?: string, fileName?: string) => Promise<void>;
}

export default function ChatArea({ conversationId, conversationName, messages, currentUserId, isLoading, onSendMessage }: ChatAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputStr, setInputStr] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Mention State
    const [showMention, setShowMention] = useState(false);
    
    const users = useMessengerStore(state => state.users);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputStr(val);
        
        // Show mention popup if the last character is '@' or string ends with ' @'
        if (val.endsWith('@') || val.endsWith(' @')) {
            setShowMention(true);
        } else if (!val.includes('@')) {
            setShowMention(false);
        }
    };
    
    const handleMentionClick = (user: ChatUser) => {
        // Find the last '@' and replace it with the username
        const lastAtIndex = inputStr.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            const newStr = inputStr.substring(0, lastAtIndex) + '@' + user.name + ' ';
            setInputStr(newStr);
        } else {
            setInputStr(inputStr + '@' + user.name + ' ');
        }
        setShowMention(false);
        inputRef.current?.focus();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputStr.trim() || isSubmitting) return;
        setIsSubmitting(true);
        const text = inputStr.trim();
        setInputStr('');
        try {
            await onSendMessage(conversationId, text, 'TEXT');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        if (e.key === 'Escape' && showMention) {
            setShowMention(false);
        }
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white', borderTopRightRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, py: 2.5, borderBottom: '1px solid #E6EBF5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: '#0AC947',
                                color: '#0AC947',
                                boxShadow: '0 0 0 2px white',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                '&::after': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    content: '""',
                                },
                            }
                        }}
                    >
                        <Avatar sx={{ width: 44, height: 44, bgcolor: '#F5BD78' }} src={conversationName === 'Oscar Holloway' ? 'https://placehold.co/44x44' : undefined}>
                            {conversationName.charAt(0)}
                        </Avatar>
                    </Badge>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 16 }}>{conversationName}</Typography>
                        <Typography sx={{ color: '#91929E', fontSize: 14 }}>{conversationName === 'Oscar Holloway' ? 'UI/UX Designer' : '對話成員'}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                        <SearchIcon sx={{ color: '#0A1629' }} fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                        <PushPinIcon sx={{ color: '#0A1629' }} fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                        <MoreVertIcon sx={{ color: '#0A1629' }} fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Chat History */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 2 }} className="custom-scrollbar">
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : messages.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', color: '#7D8592', py: 4 }}>
                        尚未有任何通訊紀錄
                    </Box>
                ) : (
                    messages.map((msg, index) => {
                        const isOwn = msg.senderId === currentUserId;
                        const showDateDivider = index === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
                        
                        return (
                            <React.Fragment key={msg.id}>
                                {showDateDivider && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                        <Box sx={{ bgcolor: 'white', borderRadius: '20px', border: '1px solid #E6EBF5', px: 3, py: 0.5, boxShadow: '0px 2px 16px rgba(195.86, 203.28, 214.36, 0.10)' }}>
                                            <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 600 }}>
                                                {formatDateDivider(msg.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: isOwn ? '#3F8CFF' : '#E78175' }}>
                                        {isOwn ? '我' : msg.senderName?.charAt(0) || 'U'}
                                    </Avatar>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 16 }}>
                                                {isOwn ? '我' : msg.senderName || '未知使用者'}
                                            </Typography>
                                            <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 600 }}>
                                                {formatChatTime(msg.createdAt)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ maxWidth: '80%' }}>
                                            {msg.messageType === 'IMAGE' && msg.fileUrl ? (
                                                <img src={msg.fileUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8, cursor: 'pointer', marginTop: 8 }} onClick={()=>window.open(msg.fileUrl, '_blank')} />
                                            ) : msg.messageType === 'FILE' && msg.fileUrl ? (
                                                <Box sx={{
                                                    width: { xs: '100%', sm: 400, md: 518 },
                                                    height: 70,
                                                    bgcolor: 'white',
                                                    borderRadius: '14px',
                                                    border: '1px solid #D8DDE5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    px: 1.5,
                                                    mt: 1,
                                                    cursor: 'pointer'
                                                }} onClick={()=>window.open(msg.fileUrl, '_blank')}>
                                                    {/* Icon Container */}
                                                    <Box sx={{ 
                                                        width: 44, height: 44, 
                                                        bgcolor: 'rgba(109, 93, 211, 0.10)', 
                                                        borderRadius: '14px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        mr: 2, flexShrink: 0 
                                                    }}>
                                                        <AttachFileIcon sx={{ color: '#6D5DD3', transform: 'rotate(45deg)' }} />
                                                    </Box>
                                                    
                                                    {/* Text */}
                                                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                        <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700, lineHeight: '21px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                            {msg.fileName || 'site screens.png'}
                                                        </Typography>
                                                        <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', fontWeight: 400 }}>
                                                            10 MB PNG
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {/* Actions */}
                                                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                                        <IconButton size="small" sx={{ 
                                                            width: 44, height: 44, 
                                                            bgcolor: '#F4F9FD', borderRadius: '14px',
                                                            '&:hover': { bgcolor: '#E6EDF5' }
                                                        }} onClick={(e) => { e.stopPropagation(); window.open(msg.fileUrl, '_blank'); }}>
                                                            <CloudDownloadOutlinedIcon sx={{ color: '#0A1629' }} />
                                                        </IconButton>
                                                        <IconButton size="small" sx={{ 
                                                            width: 44, height: 44, 
                                                            bgcolor: '#F4F9FD', borderRadius: '14px',
                                                            '&:hover': { bgcolor: '#E6EDF5' }
                                                        }} onClick={(e) => { e.stopPropagation(); }}>
                                                            <MoreVertIcon sx={{ color: '#0A1629' }} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 16, color: '#0A1629', opacity: 0.7, lineHeight: 1.5, mt: 0.5 }}>
                                                    {msg.content}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Form Wrapper */}
            <Box sx={{ p: 4, pt: 2, bgcolor: 'white', position: 'relative' }}>
                
                {/* Mention Popup */}
                {showMention && (
                    <Box sx={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 170, // visually aligned roughly above the @ symbol area
                        mb: 1,
                        width: 240,
                        bgcolor: 'white',
                        boxShadow: '0px 6px 58px rgba(121.38, 144.70, 173.40, 0.20)',
                        borderRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        py: 1,
                        maxHeight: 280,
                        overflowY: 'auto'
                    }} className="custom-scrollbar">
                        {users.length === 0 && (
                            <Typography sx={{ px: 2, py: 1, color: '#7D8592', fontSize: 14 }}>無此紀錄...</Typography>
                        )}
                        {users.map(user => (
                            <Box 
                                key={user.id}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    mx: 1, px: 2, py: 1.5,
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'rgba(63, 140, 255, 0.12)' }
                                }}
                                onClick={() => handleMentionClick(user)}
                            >
                                <Avatar sx={{ width: 24, height: 24, bgcolor: '#63A2FF', fontSize: 12 }}>
                                    {user.name.charAt(0)}
                                </Avatar>
                                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                    {user.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box sx={{ 
                    display: 'flex', alignItems: 'center',
                    border: '1px solid #D8E0F0', 
                    borderRadius: '14px', 
                    bgcolor: 'white', 
                    boxShadow: '0px 1px 2px rgba(183.68, 200.04, 224.46, 0.22)', 
                    height: 56,
                    px: 1
                }}>
                    <IconButton sx={{ color: '#6D5DD3' }} onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                        <AttachFileIcon sx={{ transform: 'rotate(45deg)' }} />
                    </IconButton>
                    <IconButton sx={{ color: '#3F8CFF' }}>
                        <InsertLinkIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#3F8CFF' }} onClick={() => setShowMention(!showMention)}>
                        <AlternateEmailIcon />
                    </IconButton>
                    
                    <InputBase
                        inputRef={inputRef}
                        sx={{ ml: 2, flex: 1, fontSize: 16, color: '#0A1629' }}
                        placeholder="請在這裡輸入您的訊息..."
                        value={inputStr}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                    />
                    
                    <IconButton sx={{ color: '#FDC748', mr: 1 }}>
                        <SentimentSatisfiedAltIcon />
                    </IconButton>
                    <IconButton 
                        sx={{ 
                            bgcolor: '#3F8CFF', 
                            color: 'white', 
                            borderRadius: '14px', 
                            width: 44, 
                            height: 44, 
                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                            '&:hover': { bgcolor: '#2670e8' } 
                        }} 
                        onClick={handleSend}
                        disabled={!inputStr.trim() || isSubmitting}
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
        </Box>
    );
}

function formatChatTime(dateStr: string): string {
    const d = new Date(dateStr);
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
}

function formatDateDivider(dateStr: string): string {
    const d = new Date(dateStr);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${m}月${day}日 ${days[d.getDay()]}`;
}
