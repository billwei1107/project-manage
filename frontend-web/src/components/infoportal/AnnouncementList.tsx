import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, Divider, Chip, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';

import { useInfoPortalStore } from '../../stores/useInfoPortalStore';
import { useAuthStore } from '../../stores/useAuthStore';
import api from '../../api/axios';

const AnnouncementList: React.FC = () => {
    const store = useInfoPortalStore();
    const { user } = useAuthStore();

    useEffect(() => {
        store.fetchAnnouncements();
    }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('ANNOUNCEMENT');

    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) return;
        try {
            await api.post('/v1/announcements', { title, content, type });
            setOpenDialog(false);
            setTitle('');
            setContent('');
            setType('ANNOUNCEMENT');
            store.fetchAnnouncements();
        } catch (error) {
            console.error('Error creating announcement', error);
            alert('發布失敗');
        }
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header Toolbar */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight="bold">系統公告與說明指南</Typography>

                {user?.role === 'ADMIN' && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        發布公告 / 指南
                    </Button>
                )}
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc' }}>
                {store.announcements.length === 0 ? (
                    <Box sx={{ width: '100%', py: 10, textAlign: 'center' }}>
                        <Typography color="text.secondary">目前沒有任何公告或說明文件</Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 800, mx: 'auto' }}>
                        {store.announcements.map(item => (
                            <Card key={item.id} variant="outlined" sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {item.type === 'ANNOUNCEMENT' ? (
                                                <Chip icon={<CampaignIcon />} label="系統公告" color="error" size="small" />
                                            ) : (
                                                <Chip icon={<MenuBookIcon />} label="操作指南" color="primary" size="small" />
                                            )}
                                            <Typography variant="caption" color="text.secondary">
                                                發布於 {new Date(item.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {item.title}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                                        {item.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Create Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>發布新公告 / 指南</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>類型</InputLabel>
                            <Select
                                value={type}
                                label="類型"
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value="ANNOUNCEMENT">系統公告</MenuItem>
                                <MenuItem value="DOCUMENT_GUIDE">操作說明</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="標題"
                            fullWidth
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="內文 (支援多行)"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>取消</Button>
                    <Button onClick={handleCreate} variant="contained" disabled={!title.trim() || !content.trim()}>發布</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AnnouncementList;
