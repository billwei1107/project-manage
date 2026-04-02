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
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import type { Message as MessageType } from '../../stores/useMessengerStore';

/**
 * @file ChatArea.tsx
 * @description Messenger 右側的聊天區域元件 / Chat Area Component
 * @description_en Main chat area displaying messages and message input
 * @description_zh Messenger 右側聊天主畫面，顯示歷史訊息與文字輸入框
 */

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
    const [inputStr, setInputStr] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white', borderTopRightRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden' }}>
            {/* Header */}
            <Box className="flex items-center justify-between px-8 py-5 border-b border-[#E6EBF5]">
                <Box className="flex items-center gap-4">
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#F5BD78' }}>
                        {conversationName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 16 }}>{conversationName}</Typography>
                        <Typography sx={{ color: '#91929E', fontSize: 14 }}>對話成員</Typography>
                    </Box>
                </Box>
                <Box className="flex gap-3">
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: 3, width: 40, height: 40 }}>
                        <SearchIcon sx={{ color: '#0A1629' }} fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: 3, width: 40, height: 40 }}>
                        <PushPinIcon sx={{ color: '#0A1629' }} fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#F4F9FD', borderRadius: 3, width: 40, height: 40 }}>
                        <MoreVertIcon sx={{ color: '#0A1629' }} fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Chat History */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }} className="custom-scrollbar">
                {isLoading ? (
                    <Box className="flex justify-center py-8"><CircularProgress /></Box>
                ) : messages.length === 0 ? (
                    <Box className="flex justify-center text-[#7D8592] py-8">
                        尚未有任何通訊紀錄
                    </Box>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.senderId === currentUserId;
                        return (
                            <Box key={msg.id} className={`flex items-start gap-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                <Avatar sx={{ width: 40, height: 40, bgcolor: isOwn ? '#3F8CFF' : '#E78175' }}>
                                    {isOwn ? '我' : msg.senderName?.charAt(0) || 'U'}
                                </Avatar>
                                <Box className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                                    <Box className={`flex items-baseline gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                        <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 16 }}>
                                            {isOwn ? '我' : msg.senderName || '未知使用者'}
                                        </Typography>
                                        <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 600 }}>
                                            {formatChatTime(msg.createdAt)}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{
                                        px: 3, py: 2,
                                        bgcolor: isOwn ? '#3F8CFF' : '#F4F9FD',
                                        color: isOwn ? 'white' : '#0A1629',
                                        borderRadius: 3,
                                        borderTopRightRadius: isOwn ? 4 : 24,
                                        borderTopLeftRadius: !isOwn ? 4 : 24
                                    }}>
                                        {msg.messageType === 'IMAGE' && msg.fileUrl ? (
                                            <img src={msg.fileUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8, cursor: 'pointer' }} onClick={()=>window.open(msg.fileUrl, '_blank')} />
                                        ) : msg.messageType === 'FILE' && msg.fileUrl ? (
                                            <Box className="flex items-center gap-2 cursor-pointer" onClick={()=>window.open(msg.fileUrl, '_blank')}>
                                                <InsertDriveFileIcon />
                                                <Typography>{msg.fileName || '檔案'}</Typography>
                                                <DownloadIcon />
                                            </Box>
                                        ) : (
                                            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 15, opacity: isOwn ? 1 : 0.8 }}>
                                                {msg.content}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Form */}
            <Box className="p-6 bg-white">
                <Box className="flex items-center border border-[#D8E0F0] rounded-2xl shadow-[0px_1px_2px_rgba(183,200,224,0.22)] overflow-hidden">
                    <Box className="flex gap-2 px-3">
                        <IconButton size="small" sx={{ color: '#6D5DD3' }} onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                            <AttachFileIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#3F8CFF' }}>
                            <InsertLinkIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#3F8CFF' }}>
                            <AlternateEmailIcon />
                        </IconButton>
                    </Box>
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: 15, color: '#0A1629', py: 1.5 }}
                        placeholder="請在這裡輸入您的訊息..."
                        inputProps={{ 'aria-label': '請在這裡輸入您的訊息...' }}
                        value={inputStr}
                        onChange={e => setInputStr(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                        multiline
                        maxRows={3}
                    />
                    <Box className="flex gap-2 px-3 items-center">
                        <IconButton size="small" sx={{ color: '#FDC748' }}>
                            <SentimentSatisfiedAltIcon />
                        </IconButton>
                        <IconButton 
                            sx={{ bgcolor: '#3F8CFF', color: 'white', borderRadius: 3, width: 44, height: 44, '&:hover': { bgcolor: '#2670e8' } }} 
                            onClick={handleSend}
                            disabled={!inputStr.trim() || isSubmitting}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
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
