import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import api from '../../api/axios';

/**
 * @file ChangePasswordModal.tsx
 * @description 修改密碼彈窗組件 / Change Password Modal
 * @description_en Modal for users to change their account password
 * @description_zh 提供使用者修改自己密碼的彈窗介面
 */

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError('兩次輸入的新密碼不一致');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('密碼長度至少需 6 個字元');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await api.post('/v1/auth/change-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });

            setSuccess(true);

            // Reset form
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Auto close after success
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error('Failed to change password', err);
            setError(err.response?.data?.message || '修改密碼失敗，請確認舊密碼是否正確。');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!success) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>修改個人密碼</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>密碼修改成功！</Alert>}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="舊密碼"
                            type="password"
                            fullWidth
                            required
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        />

                        <TextField
                            label="新密碼 (至少6個字元)"
                            type="password"
                            fullWidth
                            required
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        />

                        <TextField
                            label="再次確認新密碼"
                            type="password"
                            fullWidth
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit" disabled={loading || success}>
                        取消
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading || success}>
                        {loading ? <CircularProgress size={24} /> : '確認修改'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
