import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Button,
    LinearProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    TrendingUp,
    TrendingDown,
    AttachMoney,
    AccountBalanceWallet,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { FinancialRecord, FinancialSummary } from '../../types/finance';
import AddFinancialRecordModal from './AddFinancialRecordModal';
import api from '../../api/axios';

const ProjectFinance: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [summary, setSummary] = useState<FinancialSummary>({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        burnRate: 0,
    });
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Group records for Pie Chart (Expense by Category)
    const expenseData = React.useMemo(() => {
        const expenses = records.filter(r => r.type === 'EXPENSE');
        const grouped = expenses.reduce((acc, curr) => {
            const cat = curr.category;
            acc[cat] = (acc[cat] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort descending
    }, [records]);

    // Colors for chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            const [summaryRes, recordsRes] = await Promise.all([
                api.get(`/projects/${id}/finance/summary`),
                api.get(`/projects/${id}/finance`),
            ]);

            setSummary(summaryRes.data.data);
            setRecords(recordsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch finance data', error);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddRecord = () => {
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchData();
        setIsModalOpen(false);
    };

    const handleDelete = async (recordId: string) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`/projects/${id}/finance/${recordId}`);
            fetchData();
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete record');
        }
    };

    const getBurnRateColor = (rate: number) => {
        if (rate >= 90) return 'error';
        if (rate >= 80) return 'warning';
        return 'success';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Summary Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, md: 3 }}>
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
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
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
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
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
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
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
                </Grid>
            </Grid>

            {/* Burn Rate & Charts */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
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
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                支出分類 (Expense Breakdown)
                            </Typography>
                            <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {expenseData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expenseData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {expenseData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">暫無支出數據 / No Expenses</Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">收支明細 (Transactions)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRecord} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
                    新增記錄 (Add Record)
                </Button>
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
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={id!}
                onSave={handleSave}
            />
        </Box>
    );
};

export default ProjectFinance;
