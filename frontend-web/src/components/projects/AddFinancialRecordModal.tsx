import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Grid,
    InputAdornment,
    Box,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { type FinancialType, type FinanceCategory } from '../../types/finance';
import { useAuthStore } from '../../stores/useAuthStore';
import api from '../../api/axios';

interface AddFinancialRecordModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    onSave: () => void;
    onManageCategories: () => void;
}

const AddFinancialRecordModal: React.FC<AddFinancialRecordModalProps> = ({
    open,
    onClose,
    projectId,
    onSave,
    onManageCategories,
}) => {
    const { user } = useAuthStore();
    const [type, setType] = useState<FinancialType>('EXPENSE');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState<Dayjs | null>(dayjs());
    const [taxIncluded, setTaxIncluded] = useState(false);
    const [taxRate, setTaxRate] = useState<number>(5);
    const [loading, setLoading] = useState(false);

    const [availableCategories, setAvailableCategories] = useState<FinanceCategory[]>([]);

    useEffect(() => {
        if (open) {
            fetchCategories(type);
        }
    }, [open, type]);

    const fetchCategories = async (filterType: FinancialType) => {
        try {
            const res = await api.get(`/v1/finance-categories?type=${filterType}`);
            setAvailableCategories(res.data.data);
            setCategory(''); // reset category on type change
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !category || !transactionDate) return;

        setLoading(true);
        try {
            const request = {
                projectId,
                type,
                amount: parseFloat(amount),
                category,
                description,
                transactionDate: transactionDate.format('YYYY-MM-DD'),
                createdBy: user?.id || 'unknown',
                taxIncluded,
                taxRate: taxIncluded ? taxRate : undefined
            };

            await api.post(`/projects/${projectId}/finance`, request);
            onSave();
            handleClose();
        } catch (error) {
            console.error('Failed to add record:', error);
            alert('Failed to add record');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setType('EXPENSE');
        setAmount('');
        setCategory('');
        setDescription('');
        setTransactionDate(dayjs());
        setTaxIncluded(false);
        setTaxRate(5);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>新增收支記錄 (Add Financial Record)</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            select
                            label="類型 (Type)"
                            value={type}
                            onChange={(e) => setType(e.target.value as FinancialType)}
                            fullWidth
                        >
                            <MenuItem value="INCOME">收入 (Income)</MenuItem>
                            <MenuItem value="EXPENSE">支出 (Expense)</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                select
                                label="分類 (Category)"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                fullWidth
                                required
                            >
                                {availableCategories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="outlined"
                                onClick={onManageCategories}
                                sx={{ minWidth: 'auto', px: 2 }}
                                title="管理分類"
                            >
                                <SettingsIcon />
                            </Button>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="日期 (Date)"
                                value={transactionDate}
                                onChange={(newValue) => setTransactionDate(newValue)}
                                slotProps={{ textField: { fullWidth: true, required: true } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="金額 (Amount)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={taxIncluded}
                                        onChange={(e) => setTaxIncluded(e.target.checked)}
                                    />
                                }
                                label="含稅 (Tax Included)"
                            />
                            {taxIncluded && (
                                <TextField
                                    label="稅率 (Tax Rate)"
                                    type="number"
                                    size="small"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    sx={{ width: 120 }}
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="描述 (Description)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading || !category}>
                    儲存
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFinancialRecordModal;
