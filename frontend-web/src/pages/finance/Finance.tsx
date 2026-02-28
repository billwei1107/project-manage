import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, Button, Paper, Tabs, Tab, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
    Tooltip, CircularProgress, Select, MenuItem, FormControl, InputLabel, Card, CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useFinanceStore } from '../../stores/useFinanceStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { AddTransactionModal } from '../../components/finance/AddTransactionModal';
import type { FinancialRecordResponse } from '../../types/finance';
import dayjs from 'dayjs';

/**
 * @file Finance.tsx
 * @description 財務管理主頁面 / Finance Dashboard
 */
export const Finance: React.FC = () => {
    const { records, summary, loading, fetchRecords, fetchSummary, deleteRecord, exportCsv, importCsv } = useFinanceStore();
    const { projects, fetchProjects } = useProjectStore();

    const [tabIndex, setTabIndex] = useState(0); // 0: All, 1: Income, 2: Expense
    const [selectedProject, setSelectedProject] = useState<string>('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<FinancialRecordResponse | undefined>(undefined);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (selectedProject !== 'ALL') {
                await fetchRecords(selectedProject);
                await fetchSummary(selectedProject);
            } else {
                await fetchRecords();
            }
        };
        fetchProjectData();
    }, [selectedProject, fetchRecords, fetchSummary]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleEdit = (record: FinancialRecordResponse) => {
        setEditRecord(record);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('確定要刪除這筆財務記錄嗎？')) {
            await deleteRecord(id, selectedProject === 'ALL' ? undefined : selectedProject);
        }
    };

    const handleExport = async () => {
        try {
            await exportCsv(selectedProject === 'ALL' ? undefined : selectedProject);
        } catch (error) {
            alert('匯出 CSV 失敗');
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && selectedProject !== 'ALL') {
            try {
                const count = await importCsv(file, selectedProject);
                alert(`成功匯入 ${count} 筆記錄`);
            } catch (error) {
                alert('匯入失敗，請確認模板格式正確');
            }
        } else if (file && selectedProject === 'ALL') {
            alert('請先選擇一個特定的專案再進行匯入');
        }
    };

    const filteredRecords = useMemo(() => {
        let result = records;
        if (tabIndex === 1) result = result.filter(r => r.type === 'INCOME');
        if (tabIndex === 2) result = result.filter(r => r.type === 'EXPENSE');
        return result;
    }, [records, tabIndex]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatRate = (rate?: number) => {
        return rate != null ? `${rate.toFixed(1)}%` : '0%';
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">財務與報價管理</Typography>

                <Box display="flex" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <InputLabel>選擇專案</InputLabel>
                        <Select
                            value={selectedProject}
                            label="選擇專案"
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <MenuItem value="ALL">全部專案 (All Projects)</MenuItem>
                            {projects.map((p: any) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Tooltip title="下載財務報表">
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                        >
                            匯出 CSV
                        </Button>
                    </Tooltip>

                    <Tooltip title="需選擇特定專案才能匯入">
                        <span>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadIcon />}
                                disabled={selectedProject === 'ALL' || loading}
                            >
                                匯入 CSV
                                <input
                                    type="file"
                                    hidden
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </span>
                    </Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditRecord(undefined);
                            setIsAddModalOpen(true);
                        }}
                    >
                        新增紀錄
                    </Button>
                </Box>
            </Box>

            {/* Dashboard Summary Cards */}
            {selectedProject !== 'ALL' && summary && (
                <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 4 }}>
                    <Box flex={1} minWidth={240}>
                        <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>專案總預算</Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{formatCurrency(summary.budget)}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={240}>
                        <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>已實現收入</Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{formatCurrency(summary.totalIncome)}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={240}>
                        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>已認列支出</Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{formatCurrency(summary.totalExpense)}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box flex={1} minWidth={240}>
                        <Card sx={{ bgcolor: summary.netProfit >= 0 ? 'info.light' : 'warning.light', color: 'info.contrastText', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>專案淨利 (Burn Rate)</Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                                    {formatCurrency(summary.netProfit)} ({formatRate(summary.burnRate)})
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            {/* Main Content Area */}
            <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="全部紀錄 (All)" />
                        <Tab label="收入 (Income)" />
                        <Tab label="支出 (Expenses)" />
                    </Tabs>
                </Box>

                {loading && records.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }}>
                            <TableHead sx={{ bgcolor: '#fafafa' }}>
                                <TableRow>
                                    <TableCell>日期</TableCell>
                                    <TableCell>類型</TableCell>
                                    <TableCell>分類</TableCell>
                                    <TableCell width="25%">說明</TableCell>
                                    {selectedProject === 'ALL' && <TableCell>專案</TableCell>}
                                    <TableCell align="right">金額</TableCell>
                                    <TableCell align="center">憑證</TableCell>
                                    <TableCell align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>{dayjs(row.transactionDate).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.type === 'INCOME' ? '收入' : '支出'}
                                                    color={row.type === 'INCOME' ? 'success' : 'error'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.category} size="small" />
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.description}
                                            </TableCell>

                                            {selectedProject === 'ALL' && (
                                                <TableCell>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {projects.find((p: any) => p.id === row.projectId)?.name || 'Unknown'}
                                                    </Typography>
                                                </TableCell>
                                            )}

                                            <TableCell align="right">
                                                <Typography
                                                    fontWeight="medium"
                                                    color={row.type === 'INCOME' ? 'success.main' : 'error.main'}
                                                >
                                                    {row.type === 'INCOME' ? '+' : '-'}{formatCurrency(row.amount)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                {row.receiptUrl ? (
                                                    <Tooltip title="檢視憑證">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            component="a"
                                                            href={row.receiptUrl.startsWith('http') ? row.receiptUrl : `${import.meta.env.VITE_API_URL}${row.receiptUrl}`}
                                                            target="_blank"
                                                        >
                                                            <ReceiptIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography variant="caption" color="textSecondary">-</Typography>
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Tooltip title="編輯">
                                                    <IconButton size="small" onClick={() => handleEdit(row)} color="primary">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="刪除">
                                                    <IconButton size="small" onClick={() => handleDelete(row.id)} color="error">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={selectedProject === 'ALL' ? 8 : 7} align="center" sx={{ py: 6 }}>
                                            <Typography variant="body1" color="textSecondary">
                                                目前沒有財務紀錄
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <AddTransactionModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                editRecordId={editRecord?.id}
                initialData={editRecord ? {
                    projectId: editRecord.projectId,
                    type: editRecord.type,
                    amount: editRecord.amount,
                    category: editRecord.category,
                    description: editRecord.description || '',
                    transactionDate: editRecord.transactionDate,
                    receiptUrl: editRecord.receiptUrl,
                    taxIncluded: false, // Default to false when editing as we show base amount usually
                    taxRate: 5
                } : undefined}
            />
        </Box>
    );
};
