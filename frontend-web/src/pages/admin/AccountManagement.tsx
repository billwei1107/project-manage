import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api/axios';
import type { User } from '../../stores/useAuthStore';
import AddUserModal from '../../components/admin/AddUserModal';
import EditUserModal from '../../components/admin/EditUserModal';

export default function AccountManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/v1/accounts');
            setUsers(response.data.data || []);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch accounts', err);
            setError('無法獲取帳號列表。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleResetPassword = async (userId: string, userName: string) => {
        if (!window.confirm(`確定要將用戶 ${userName} 的密碼重設為預設密碼嗎？`)) {
            return;
        }

        try {
            await api.post(`/v1/accounts/${userId}/reset-password`);
            setSuccessMessage(`已將 ${userName} 的密碼重設為預設密碼。`);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('Reset password failed', err);
            setError('密碼重設失敗。');
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    帳號管理
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ borderRadius: 2 }}
                >
                    新增帳號
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>名稱</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>層級 (Role)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>員工編號</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>用戶名</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>電子郵件</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            color={user.role === 'ADMIN' ? 'error' : 'primary'}
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </TableCell>
                                    <TableCell>{user.employeeId || '-'}</TableCell>
                                    <TableCell>{user.username || '-'}</TableCell>
                                    <TableCell>{user.email || '-'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => setEditingUser(user)}
                                            title="編輯帳號資訊"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="warning"
                                            onClick={() => handleResetPassword(user.id, user.name)}
                                            title="重設密碼為預設"
                                        >
                                            <LockResetIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        目前沒有使用者資料
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <AddUserModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchUsers();
                    setSuccessMessage('新增使用者成功！預設密碼為 ERP@123456');
                    setTimeout(() => setSuccessMessage(null), 5000);
                }}
            />

            <EditUserModal
                open={!!editingUser}
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onSuccess={(updatedUser) => {
                    setEditingUser(null);
                    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                    setSuccessMessage('帳號資訊更新成功！');
                    setTimeout(() => setSuccessMessage(null), 3000);
                }}
            />
        </Box>
    );
}
