import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, CircularProgress,
    Button, Card, CardContent, LinearProgress, IconButton
} from '@mui/material';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    TrendingUp,
    TrendingDown,
    AttachMoney,
    AccountBalanceWallet,
    Download as DownloadIcon
} from '@mui/icons-material';
import api from '../../api/axios';
import type { FinancialRecordResponse, FinancialSummaryResponse } from '../../types/finance';
import AddFinancialRecordModal from './AddFinancialRecordModal';
import ManageCategoriesModal from './ManageCategoriesModal';

interface ProjectFinanceProps {
    projectId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const ProjectFinance: React.FC<ProjectFinanceProps> = ({ projectId }) => {
    const [records, setRecords] = useState<FinancialRecordResponse[]>([]);
    const [summary, setSummary] = useState<FinancialSummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const [recordsRes, summaryRes] = await Promise.all([
                api.get(`/finance/projects/${projectId}`),
                api.get(`/finance/projects/${projectId}/summary`)
            ]);

            if (recordsRes.data.success) {
                setRecords(recordsRes.data.data);
            }
            if (summaryRes.data.success) {
                setSummary(summaryRes.data.data);
            }
        } catch (err: any) {
            console.error("Error fetching finance data", err);
            setError(err.response?.data?.message || 'Failed to initialize finance data');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleExport = async () => {
        try {
            const response = await api.get(`/finance/export/csv?projectId=${projectId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `financial_report_${projectId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (exportError) {
            console.error("Export failed", exportError);
            alert("匯出失敗");
        }
    };

    const handleDelete = async (recordId: string) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`/finance/${recordId}`);
            fetchData();
        } catch (deleteError) {
            console.error('Failed to delete', deleteError);
            alert('Failed to delete record');
        }
    };

    const expenseByCategory = useMemo(() => {
        if (!records) return [];
        const expenses = records.filter(r => r.type === 'EXPENSE');
        const grouped = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort descending
    }, [records]);

    const getBurnRateColor = (rate: number) => {
        if (rate >= 90) return 'error';
        if (rate >= 80) return 'warning';
        return 'success';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);
    };

    if (loading && !summary) {
        return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;
    }

    if (error) {
        return <Box p={3}><Typography color="error">{error}</Typography></Box>;
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5">專案財務 (Project Finance)</Typography>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
                    匯出 CSV
                </Button>
            </Box>

            {/* Summary Cards */}
            {summary && (
                <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
                    <Box flex={1} minWidth={240}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    總預算 (Budget)
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {formatCurrency(summary.budget)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <AccountBalanceWallet fontSize="small" color="primary" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={240}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    總收入 (Income)
                                </Typography>
                                <Typography variant="h5" component="div" color="success.main">
                                    {formatCurrency(summary.totalIncome)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <TrendingUp fontSize="small" color="success" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={240}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    總支出 (Expense)
                                </Typography>
                                <Typography variant="h5" component="div" color="error.main">
                                    {formatCurrency(summary.totalExpense)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <TrendingDown fontSize="small" color="error" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={240}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    淨利 (Net Profit)
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {formatCurrency(summary.netProfit)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <AttachMoney fontSize="small" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            {/* Burn Rate & Charts */}
            {summary && (
                <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
                    <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 12px)' }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    預算消耗率 (Burn Rate)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ width: '100%', mr: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(summary.burnRate, 100)}
                                            color={getBurnRateColor(summary.burnRate)}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>
                                    <Box sx={{ minWidth: 50 }}>
                                        <Typography variant="body2" color="textSecondary">{`${summary.burnRate.toFixed(1)}%`}</Typography>
                                    </Box>
                                </Box>
                                {summary.burnRate >= 90 && (
                                    <Typography variant="caption" color="error">
                                        警告：預算已消耗超過 90%！ / Warning: Budget usage over 90%
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 12px)' }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    支出分類 (Expense Breakdown)
                                </Typography>
                                <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {expenseByCategory.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={expenseByCategory}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={80}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {expenseByCategory.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">暫無支出數據 / No Expenses</Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">收支明細 (Transactions)</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => setIsManageModalOpen(true)} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
                        管理分類 (Manage Categories)
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddModalOpen(true)} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
                        新增記錄 (Add Record)
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>日期 (Date)</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>類別 (Category)</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>描述 (Description)</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>金額 (Amount)</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>類型 (Type)</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>操作 (Actions)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">暫無記錄 / No records found</TableCell>
                            </TableRow>
                        ) : (
                            records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.transactionDate}</TableCell>
                                    <TableCell>
                                        <Chip label={record.category} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{record.description}</TableCell>
                                    <TableCell align="right" sx={{ color: record.type === 'INCOME' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                                        {record.type === 'INCOME' ? '+' : '-'}{formatCurrency(record.amount)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={record.type}
                                            color={record.type === 'INCOME' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDelete(record.id)} color="error" size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Modal */}
            <AddFinancialRecordModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                projectId={projectId}
                onSave={() => { setIsAddModalOpen(false); fetchData(); }}
                onManageCategories={() => setIsManageModalOpen(true)}
            />

            {/* Manage Categories Modal */}
            <ManageCategoriesModal
                open={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
            />
        </Box>
    );
};

export default ProjectFinance;
