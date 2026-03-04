import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Stack,
    CircularProgress
} from '@mui/material';
import axiosInstance from '../../api/axios';

/**
 * @file EmployeeList.tsx
 * @description 員工列表與外包管理 / Employee List & Outsourcing Management
 * @description_en Displays the list of all employees and their current roles/status
 * @description_zh 顯示所有員工名單，包含部門、角色與在職狀態，支援過濾
 */

interface Employee {
    id: string;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    isOnline: boolean;
    lastLoginAt?: string;
    avatar?: string;
}

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Assuming we have this endpoint or use /admin/users if applicable
                const response = await axiosInstance.get('/v1/hr/employees');
                const internalStaff = response.data;
                setEmployees(internalStaff);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const getRoleChipColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'error';
            case 'PM': return 'warning';
            case 'DEV': return 'info';
            default: return 'default';
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="600" color="primary.main" gutterBottom>
                員工列表 (Employee Directory)
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                檢視目前在職的內部員工與外包資源。
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>員工</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>編號 (ID)</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>聯絡信箱</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>系統角色</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>當前狀態</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>最近登入</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <TableRow key={emp.id} hover>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar src={emp.avatar}>{emp.name.charAt(0)}</Avatar>
                                        <Typography variant="body2" fontWeight="500">{emp.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{emp.employeeId || 'N/A'}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={emp.role}
                                        color={getRoleChipColor(emp.role) as any}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: emp.isOnline ? 'success.main' : 'action.disabled' }} />
                                        <Typography variant="body2" color={emp.isOnline ? 'success.main' : 'text.secondary'}>
                                            {emp.isOnline ? '在線上' : '離線'}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {emp.lastLoginAt ? new Date(emp.lastLoginAt).toLocaleString('zh-TW', {
                                            year: 'numeric', month: '2-digit', day: '2-digit',
                                            hour: '2-digit', minute: '2-digit'
                                        }) : '從未登入'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                        {employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">尚未有任何員工資料</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
