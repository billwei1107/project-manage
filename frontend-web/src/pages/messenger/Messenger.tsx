/**
 * @file Messenger.tsx
 * @description 即時通訊主頁面 / Messenger Main Page
 * @description_en Layout wrapping ConversationsList and ChatArea
 * @description_zh 即時通訊介面主結構，負責串接左側對話清單與右側聊天區塊
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { useMessengerStore, type ChatUser, type ConversationItem } from '../../stores/useMessengerStore';
import { useAuthStore } from '../../stores/useAuthStore';
import ConversationsList from '../../components/messenger/ConversationsList';
import ChatArea from '../../components/messenger/ChatArea';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getConversationName = useCallback((conv: ConversationItem) => {
        if (conv.type === 'GROUP') return conv.name || '群組對話';
        const otherMember = conv.members?.find(m => m.userId !== currentUser?.id);
        return otherMember?.name || conv.name || '未知使用者';
    }, [currentUser]);

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
        <Box className="flex flex-col h-full w-full bg-[#F4F9FD] p-6 lg:p-8" sx={{ minHeight: 'calc(100vh - 64px)' }}>
            
            {/* Page Header Area (Mirrors the absolute top left "Messenger" text from design) */}
            <Box className="mb-6 flex justify-between items-center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0A1629', fontFamily: 'Nunito Sans' }}>
                    訊息中心
                </Typography>
            </Box>

            {/* Main Messenger UI Card */}
            <Box className="flex flex-1 rounded-3xl overflow-hidden bg-white shadow-[0px_6px_58px_rgba(195.86,203.28,214.36,0.1)]">
                
                {/* Left Side: Conversations */}
                <ConversationsList
                    conversations={conversations}
                    activeId={activeConversationId}
                    onSelect={setActiveConversation}
                    onNewChat={() => setNewMessageDialogOpen(true)}
                    getConversationName={getConversationName}
                />
                
                {/* Right Side: Chat Area or Placeholder */}
                {activeConversationId ? (
                    <Box className="flex-1 flex flex-col">
                        <ChatArea
                            conversationId={activeConversationId}
                            conversationName={getConversationName(conversations.find(c => c.id === activeConversationId)!)}
                            messages={messages}
                            currentUserId={currentUser?.id || ''}
                            isLoading={isLoading}
                            onSendMessage={sendMessage}
                        />
                    </Box>
                ) : (
                    <Box className="flex-1 flex flex-col items-center justify-center text-[#7D8592] bg-white border-l border-[#E6EBF5] rounded-r-3xl">
                        <Avatar sx={{ width: 80, height: 80, bgcolor: '#F4F9FD', color: '#3F8CFF', mb: 3 }}>
                            💬
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#0A1629' }}>歡迎來到訊息中心</Typography>
                        <Typography variant="body2">請從左側選擇一個對話，或發起新的聊天來開始吧！</Typography>
                    </Box>
                )}

            </Box>

            <NewConversationDialog
                open={newMessageDialogOpen}
                onClose={() => setNewMessageDialogOpen(false)}
                users={users}
                onStartConversation={handleStartConversation}
            />
        </Box>
    );
}

function NewConversationDialog({ open, onClose, users, onStartConversation }: {
    open: boolean;
    onClose: () => void;
    users: ChatUser[];
    onStartConversation: (user: ChatUser) => void;
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 700, color: '#0A1629' }}>發起新對話</DialogTitle>
            <DialogContent dividers>
                <List>
                    {users.map((u) => (
                        <ListItem key={u.id} disablePadding>
                            <ListItemButton onClick={() => onStartConversation(u)} sx={{ borderRadius: 2, mb: 1 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#3F8CFF' }}>{u.name.charAt(0)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>}
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
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ color: '#7D8592' }}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}
