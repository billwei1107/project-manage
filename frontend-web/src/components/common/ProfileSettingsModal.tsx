import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Avatar,
    Typography,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuthStore } from '../../stores/useAuthStore';
import axiosInstance from '../../api/axios';

/**
 * @file ProfileSettingsModal.tsx
 * @description 使用者個人設定與大頭貼上傳彈窗 / User Profile Settings & Avatar Upload
 */
interface Props {
    open: boolean;
    onClose: () => void;
}

export default function ProfileSettingsModal({ open, onClose }: Props) {
    const { user, checkAuth } = useAuthStore();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation max 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError('圖片大小不能超過 5MB');
            return;
        }

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axiosInstance.post('/v1/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // 重新拉取帳號資訊，以刷新全站大頭貼
            await checkAuth();
        } catch (err) {
            console.error('Failed to upload avatar', err);
            setError('上傳頭像失敗，請稍後再試');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>個人設定</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={user.avatar}
                            onClick={!isUploading ? handleAvatarClick : undefined}
                            sx={{
                                width: 100,
                                height: 100,
                                fontSize: '3rem',
                                bgcolor: 'primary.main',
                                cursor: isUploading ? 'default' : 'pointer',
                                transition: 'opacity 0.2s',
                                '&:hover': { opacity: isUploading ? 1 : 0.8 }
                            }}
                        >
                            {user.name.charAt(0)}
                        </Avatar>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            onClick={handleAvatarClick}
                            disabled={isUploading}
                            sx={{
                                position: 'absolute',
                                right: -10,
                                bottom: -10,
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': { bgcolor: 'background.paper' }
                            }}
                        >
                            {isUploading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                        </IconButton>
                    </Box>

                    <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email || user.username}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">關閉</Button>
            </DialogActions>
        </Dialog>
    );
}
