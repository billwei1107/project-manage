import React, { useState } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FinancialCategory, type FinancialType } from '../../types/finance';
import { useAuthStore } from '../../stores/useAuthStore'; // To get current user ID
import api from '../../api/axios';

interface AddFinancialRecordModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    onSave: () => void;
}

const AddFinancialRecordModal: React.FC<AddFinancialRecordModalProps> = ({
    open,
    onClose,
    projectId,
    onSave,
}) => {
    const { user } = useAuthStore();
    const [type, setType] = useState<FinancialType>('EXPENSE');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<FinancialCategory | ''>('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState<Dayjs | null>(dayjs());
    const [taxIncluded, setTaxIncluded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!amount || !category || !transactionDate) return;

        setLoading(true);
        try {
            const request = {
                projectId,
                type,
                amount: parseFloat(amount),
                category: category as FinancialCategory,
                description,
                transactionDate: transactionDate.format('YYYY-MM-DD'),
                createdBy: user?.id || 'unknown',
                taxIncluded,
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
        // Reset form
        setType('EXPENSE');
        setAmount('');
        setCategory('');
        setDescription('');
        setTransactionDate(dayjs());
        setTaxIncluded(false);
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
                        <TextField
                            select
                            label="分類 (Category)"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as FinancialCategory)}
                            fullWidth
                            required
                        >
                            {Object.values(FinancialCategory).map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>
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
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={taxIncluded}
                                    onChange={(e) => setTaxIncluded(e.target.checked)}
                                />
                            }
                            label="含稅 (Tax Included) - 自動計算 5% 稅額"
                        />
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
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    儲存
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFinancialRecordModal;
