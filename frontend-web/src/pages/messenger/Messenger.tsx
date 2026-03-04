/**
 * @file Messenger.tsx
 * @description 即時通訊頁面 / Messenger Page
 * @description_en Real-time chat interface with conversation list and chat room
 * @description_zh 即時聊天介面，包含對話列表與聊天室
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, TextField, IconButton, Avatar, Badge, List, ListItem,
    ListItemAvatar, ListItemText, Paper, Divider, InputAdornment, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    ListItemButton, CircularProgress, alpha
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddCommentIcon from '@mui/icons-material/AddComment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { useMessengerStore } from '../../stores/useMessengerStore';
import { useAuthStore } from '../../stores/useAuthStore';
import type { ConversationItem, Message as MessageType, ChatUser } from '../../stores/useMessengerStore';

// ========================================
// 主元件 / Main Component
// ========================================

export default function Messenger() {
    const {
        conversations, activeConversationId, messages, isLoading, users,
        fetchConversations, fetchUsers, setActiveConversation, sendMessage,
        createConversation, fetchUnreadCount
    } = useMessengerStore();
    const { user: currentUser } = useAuthStore();
    const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);

    useEffect(() => {
        fetchConversations();
        fetchUsers();
        fetchUnreadCount();
    }, []);

    // ========================================
    // 取得對話顯示名稱 / Get conversation display name
    // ========================================
    const getConversationName = useCallback((conv: ConversationItem) => {
        if (conv.type === 'GROUP') return conv.name || '群組對話';
        const otherMember = conv.members?.find(m => m.userId !== currentUser?.id);
        return otherMember?.name || conv.name || '未知使用者';
    }, [currentUser]);

    // ========================================
    // 建立新對話 / Start New Conversation
    // ========================================
    const handleStartConversation = async (targetUser: ChatUser) => {
        try {
            const convId = await createConversation('', 'DIRECT', [targetUser.id]);
            setActiveConversation(convId);
            setNewMessageDialogOpen(false);
        } catch {
            console.error('Failed to create conversation');
        }
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* ========================================
                左側對話列表 / Left: Conversation List
                ======================================== */}
            <Paper
                elevation={0}
                sx={{
                    width: 340, minWidth: 340, borderRight: '1px solid',
                    borderColor: 'divider', display: 'flex', flexDirection: 'column',
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>訊息</Typography>
                    <IconButton
                        color="primary"
                        onClick={() => setNewMessageDialogOpen(true)}
                        title="發起新對話"
                    >
                        <AddCommentIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                    {conversations.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                            <Typography variant="body2">尚無對話</Typography>
                            <Typography variant="caption">點擊右上角 + 發起新對話</Typography>
                        </Box>
                    ) : conversations.map((conv) => (
                        <ListItem
                            key={conv.id}
                            disablePadding
                            sx={{
                                bgcolor: conv.id === activeConversationId
                                    ? (theme) => alpha(theme.palette.primary.main, 0.08)
                                    : 'transparent',
                            }}
                        >
                            <ListItemButton
                                onClick={() => setActiveConversation(conv.id)}
                                sx={{ px: 2, py: 1.5 }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        badgeContent={conv.unreadCount}
                                        color="error"
                                        max={99}
                                    >
                                        <Avatar sx={{ bgcolor: conv.type === 'GROUP' ? 'secondary.main' : 'primary.main' }}>
                                            {getConversationName(conv).charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" noWrap fontWeight={conv.unreadCount > 0 ? 700 : 500}>
                                            {getConversationName(conv)}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" noWrap color="text.secondary" component="span">
                                            {conv.lastMessage || '尚無訊息'}
                                        </Typography>
                                    }
                                />
                                {conv.lastMessageAt && (
                                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                                        {formatTime(conv.lastMessageAt)}
                                    </Typography>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* ========================================
                右側聊天室 / Right: Chat Room
                ======================================== */}
            {activeConversationId ? (
                <ChatRoom
                    conversationId={activeConversationId}
                    messages={messages}
                    isLoading={isLoading}
                    currentUserId={currentUser?.id || ''}
                    onSendMessage={sendMessage}
                    conversationName={
                        getConversationName(conversations.find(c => c.id === activeConversationId)!)
                    }
                />
            ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="h6" gutterBottom>訊息中心</Typography>
                        <Typography variant="body2">選擇一個對話或發起新對話開始聊天</Typography>
                    </Box>
                </Box>
            )}

            {/* ========================================
                新對話彈窗 / New Conversation Dialog
                ======================================== */}
            <NewConversationDialog
                open={newMessageDialogOpen}
                onClose={() => setNewMessageDialogOpen(false)}
                users={users}
                onStartConversation={handleStartConversation}
            />
        </Box>
    );
}

// ========================================
// 聊天室元件 / Chat Room Component
// ========================================

interface ChatRoomProps {
    conversationId: string;
    messages: MessageType[];
    isLoading: boolean;
    currentUserId: string;
    onSendMessage: (conversationId: string, content: string, messageType?: string, fileUrl?: string, fileName?: string) => Promise<void>;
    conversationName: string;
}

function ChatRoom({ conversationId, messages, isLoading, currentUserId, onSendMessage, conversationName }: ChatRoomProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 自動滾動到底部 / Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ========================================
    // 傳送文字訊息 / Send Text Message
    // ========================================
    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input.trim();
        setInput('');
        await onSendMessage(conversationId, text, 'TEXT');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ========================================
    // 上傳檔案 / Upload File
    // ========================================
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/msg-api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                await onSendMessage(conversationId, file.name, data.messageType, data.fileUrl, data.fileName);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
        // 重設 input / Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* 頂部標題 / Header */}
            <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" fontWeight={700}>{conversationName}</Typography>
            </Paper>

            {/* 訊息區域 / Messages Area */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : messages.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, color: 'text.secondary' }}>
                        <Typography variant="body2">傳送第一則訊息開始聊天吧！</Typography>
                    </Box>
                ) : messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
                ))}
                <div ref={messagesEndRef} />
            </Box>

            {/* 輸入區域 / Input Area */}
            <Paper elevation={0} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <TextField
                    fullWidth
                    placeholder="輸入訊息..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={4}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                                />
                                <IconButton size="small" onClick={() => fileInputRef.current?.click()} title="上傳檔案">
                                    <AttachFileIcon />
                                </IconButton>
                                <IconButton size="small" color="primary" onClick={handleSend} disabled={!input.trim()} title="傳送">
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3, bgcolor: 'background.default' },
                    }}
                />
            </Paper>
        </Box>
    );
}

// ========================================
// 訊息氣泡 / Message Bubble
// ========================================

function MessageBubble({ message, isOwn }: { message: MessageType; isOwn: boolean }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 0.5 }}>
            <Box sx={{ maxWidth: '70%' }}>
                {!isOwn && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1.5, mb: 0.25, display: 'block' }}>
                        {message.senderName}
                    </Typography>
                )}
                <Paper
                    elevation={0}
                    sx={{
                        px: message.messageType === 'IMAGE' && !message.content ? 0 : 2,
                        py: message.messageType === 'IMAGE' && !message.content ? 0 : 1,
                        borderRadius: 3,
                        bgcolor: (message.messageType === 'IMAGE' && !message.content)
                            ? 'transparent'
                            : (isOwn ? 'primary.main' : (theme) => alpha(theme.palette.grey[200], 0.8)),
                        color: isOwn ? 'primary.contrastText' : 'text.primary',
                        overflow: 'hidden'
                    }}
                >
                    {/* 圖片訊息 / Image Message */}
                    {message.messageType === 'IMAGE' && message.fileUrl && (
                        <Box sx={{ mb: message.content ? 1 : 0, display: 'flex' }}>
                            <img
                                src={message.fileUrl}
                                alt={message.fileName || 'Image'}
                                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, cursor: 'pointer', objectFit: 'contain' }}
                                onClick={() => window.open(message.fileUrl!, '_blank')}
                            />
                        </Box>
                    )}

                    {/* 檔案訊息 / File Message */}
                    {message.messageType === 'FILE' && message.fileUrl && (
                        <Chip
                            icon={<InsertDriveFileIcon />}
                            label={message.fileName || 'File'}
                            deleteIcon={<DownloadIcon />}
                            onDelete={() => window.open(message.fileUrl!, '_blank')}
                            variant="outlined"
                            sx={{
                                mb: message.content !== message.fileName ? 1 : 0,
                                borderColor: isOwn ? 'rgba(255,255,255,0.5)' : undefined,
                                color: isOwn ? 'white' : undefined,
                            }}
                        />
                    )}

                    {/* 文字內容 / Text Content */}
                    {message.messageType === 'TEXT' && (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {message.content}
                        </Typography>
                    )}
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block', textAlign: isOwn ? 'right' : 'left', mx: 1 }}>
                    {formatTime(message.createdAt)}
                </Typography>
            </Box>
        </Box>
    );
}

// ========================================
// 新對話彈窗 / New Conversation Dialog
// ========================================

function NewConversationDialog({ open, onClose, users, onStartConversation }: {
    open: boolean;
    onClose: () => void;
    users: ChatUser[];
    onStartConversation: (user: ChatUser) => void;
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>發起新對話</DialogTitle>
            <DialogContent dividers>
                <List>
                    {users.map((u) => (
                        <ListItem key={u.id} disablePadding>
                            <ListItemButton onClick={() => onStartConversation(u)}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>{u.name.charAt(0)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={u.name}
                                    secondary={u.role}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {users.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                            目前沒有其他使用者
                        </Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}

// ========================================
// 工具函式 / Utility Functions
// ========================================

function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
}
