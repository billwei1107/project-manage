import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import api from '../../api/axios';
import type { UserRole } from '../../stores/useAuthStore';

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddUserModal({ open, onClose, onSuccess }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        username: '',
        email: '',
        githubUsername: '',
        role: 'CLIENT' as UserRole
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            setError('名稱為必填欄位');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await api.post('/v1/accounts', formData);

            // Reset form
            setFormData({
                name: '',
                employeeId: '',
                username: '',
                email: '',
                githubUsername: '',
                role: 'CLIENT'
            });
            onSuccess();
        } catch (err: any) {
            console.error('Failed to create account', err);
            setError(err.response?.data?.message || '建立帳號失敗，可能是員工編號、用戶名或信箱已存在。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>新增使用者帳號</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Alert severity="info" sx={{ mb: 3 }}>
                        新建立的帳號將會使用系統預設密碼：<strong>ERP@123456</strong>
                    </Alert>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="姓名 (必填)"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <FormControl fullWidth>
                            <InputLabel>權限角色</InputLabel>
                            <Select
                                value={formData.role}
                                label="權限角色"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            >
                                <MenuItem value="CLIENT">一般員工 (CLIENT)</MenuItem>
                                <MenuItem value="ADMIN">管理員 (ADMIN)</MenuItem>
                                <MenuItem value="DEV">開發人員 (DEV)</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}>
                            登入識別資訊 (若皆留空，系統將自動產生一組員工編號)
                        </Typography>

                        <TextField
                            label="員工編號 (選填，作為登入帳號)"
                            fullWidth
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            placeholder="例如: EMP-001"
                        />

                        <TextField
                            label="用戶名 (選填，作為登入帳號)"
                            fullWidth
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />

                        <TextField
                            label="電子郵件 (選填，作為登入帳號)"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <TextField
                            label="GitHub 用戶名 (選填，用於自動綁定程式碼權限)"
                            fullWidth
                            value={formData.githubUsername}
                            onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                            placeholder="例如: octocat"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit" disabled={loading}>
                        取消
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : '建立帳號'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
