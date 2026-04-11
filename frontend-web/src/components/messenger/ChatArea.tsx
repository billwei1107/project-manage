import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton, InputBase, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PushPinIcon from '@mui/icons-material/PushPin';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
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
    const [mentions, setMentions] = useState<ChatUser[]>([]);
    
    // Hover Message State
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    
    // Edit Message State
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    
    // Typing Indicators State (hardcoded for UI preview per screenshot)
    const [typingUsers] = useState<string[]>(['Oscar Holloway']);
    
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
        // Find the last '@' and remove it from the input string
        const lastAtIndex = inputStr.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            setInputStr(inputStr.substring(0, lastAtIndex)); // retain text before @
        }
        setMentions(prev => {
            // Prevent adding the same user twice consecutively
            if (prev.length > 0 && prev[prev.length-1].id === user.id) return prev;
            return [...prev, user];
        });
        setShowMention(false);
        inputRef.current?.focus();
    };
    
    const removeMention = (index: number) => {
        setMentions(prev => prev.filter((_, i) => i !== index));
        inputRef.current?.focus();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const finalContent = `${mentions.map(u => `@${u.name}`).join(' ')} ${inputStr}`.trim();
        if (!finalContent || isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            if (editingMessageId) {
                // Future iteration: call edit API
                console.log('Edited message:', editingMessageId, 'to:', finalContent);
                // Fake optimistic update behavior can go here. For now just clear state.
            } else {
                await onSendMessage(conversationId, finalContent, 'TEXT');
            }
        } finally {
            setInputStr('');
            setMentions([]);
            setEditingMessageId(null);
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setInputStr('');
        setMentions([]);
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
        // Remove mention when pressing backspace on empty input
        if (e.key === 'Backspace' && inputStr === '' && mentions.length > 0) {
            setMentions(prev => prev.slice(0, -1));
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
                                
                                <Box 
                                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative' }}
                                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                                    onMouseLeave={() => setHoveredMessageId(null)}
                                >
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: isOwn ? '#3F8CFF' : '#E78175' }}>
                                        {isOwn ? '我' : msg.senderName?.charAt(0) || 'U'}
                                    </Avatar>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        flex: 1,
                                        bgcolor: hoveredMessageId === msg.id ? '#F4F9FD' : 'transparent',
                                        borderRadius: '16px',
                                        px: 2,
                                        py: 1.5,
                                        ml: -2,
                                        position: 'relative',
                                        transition: 'background-color 0.2s'
                                    }}>
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
                                        
                                        {/* Hover Action Bar */}
                                        {hoveredMessageId === msg.id && (
                                            <Box sx={{
                                                position: 'absolute',
                                                top: -20,
                                                right: 16,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: 'white',
                                                boxShadow: '0px 6px 16px rgba(121, 144, 173, 0.15)',
                                                borderRadius: '16px',
                                                p: 0.5,
                                                zIndex: 10
                                            }}>
                                                <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '10px', '&:hover': { bgcolor: '#F4F9FD' } }}>
                                                    <PushPinOutlinedIcon sx={{ fontSize: 20, color: '#0A1629' }} />
                                                </IconButton>
                                                <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '10px', '&:hover': { bgcolor: '#F4F9FD' } }}>
                                                    <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: '#0A1629' }} />
                                                </IconButton>
                                                <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '10px', '&:hover': { bgcolor: '#F4F9FD' } }}>
                                                    <ShareOutlinedIcon sx={{ fontSize: 20, color: '#0A1629' }} />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => {
                                                        setEditingMessageId(msg.id);
                                                        setInputStr(msg.content);
                                                        setHoveredMessageId(null);
                                                        inputRef.current?.focus();
                                                    }}
                                                    sx={{ width: 36, height: 36, borderRadius: '10px', '&:hover': { bgcolor: '#F4F9FD' } }}
                                                >
                                                    <EditOutlinedIcon sx={{ fontSize: 20, color: '#0A1629' }} />
                                                </IconButton>
                                                <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#FFF0F0', color: '#F76659', '&:hover': { bgcolor: '#FFE5E5' } }}>
                                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Box>
                                        )}
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
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                    <Typography 
                        sx={{ 
                            color: '#3F8CFF', 
                            fontSize: 13, 
                            fontWeight: 700, 
                            fontFamily: 'Nunito Sans',
                            mb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        {typingUsers.join(', ')} is typing...
                    </Typography>
                )}
                
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
                    border: (mentions.length > 0 || editingMessageId) ? '1px solid #3F8CFF' : '1px solid #D8E0F0', 
                    borderRadius: '14px', 
                    bgcolor: 'white', 
                    boxShadow: (mentions.length > 0 || editingMessageId) ? '0 0 0 3px rgba(63, 140, 255, 0.12)' : '0px 1px 2px rgba(183.68, 200.04, 224.46, 0.22)', 
                    height: 56,
                    px: 1,
                    transition: 'all 0.2s ease-in-out'
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
                        placeholder={mentions.length > 0 || editingMessageId ? '' : '請在這裡輸入您的訊息...'}
                        value={inputStr}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                        startAdornment={
                            mentions.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                                    {mentions.map((u, i) => (
                                        <Box key={u.id + '_' + i} sx={{
                                            bgcolor: 'rgba(63, 140, 255, 0.12)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 1.5,
                                            height: 28,
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <Typography sx={{ color: '#3F8CFF', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                                @{u.name}
                                            </Typography>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => removeMention(i)}
                                                sx={{ p: 0.2, ml: 0.5, color: '#3F8CFF', '&:hover': { bgcolor: 'rgba(63,140,255,0.2)' } }}
                                            >
                                                <CloseIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )
                        }
                    />
                    
                    <IconButton sx={{ color: '#FDC748', mr: 1 }}>
                        <SentimentSatisfiedAltIcon />
                    </IconButton>
                    
                    {editingMessageId ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                sx={{ 
                                    border: '1px solid #D8E0F0', 
                                    borderRadius: '14px', 
                                    width: 44, 
                                    height: 44, 
                                    color: '#7D8592',
                                    '&:hover': { bgcolor: '#F4F9FD' }
                                }} 
                                onClick={handleCancelEdit}
                            >
                                <CloseIcon fontSize="small" />
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
                                disabled={inputStr.trim() === '' || isSubmitting}
                            >
                                <CheckIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ) : (
                        <IconButton 
                            sx={{ 
                                bgcolor: '#3F8CFF', 
                                color: 'white', 
                                borderRadius: '14px', 
                                width: 44, 
                                height: 44, 
                                boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                                '&:hover': { bgcolor: '#2670e8' },
                                '&.Mui-disabled': { bgcolor: '#B0D4FF', color: 'white' }
                            }} 
                            onClick={handleSend}
                            disabled={(inputStr.trim() === '' && mentions.length === 0) || isSubmitting}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    )}
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
