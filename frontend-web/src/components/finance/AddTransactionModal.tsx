import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, MenuItem, FormControl, InputLabel, Select,
    Typography, IconButton, Switch, FormControlLabel, Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFinanceStore } from '../../stores/useFinanceStore';
import { useProjectStore } from '../../stores/useProjectStore';
import type { FinancialRecordRequest, FinancialType } from '../../types/finance';
import dayjs, { Dayjs } from 'dayjs';

interface AddTransactionModalProps {
    open: boolean;
    onClose: () => void;
    editRecordId?: string;
    initialData?: FinancialRecordRequest;
}

const CATEGORIES = {
    INCOME: ['專案款項', '顧問費', '授權費', '其他收入'],
    EXPENSE: ['硬體設備', '軟體訂閱', '外包成本', '人事費用', '差旅費', '行銷費用', '其他支出']
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose, editRecordId, initialData }) => {
    const { addRecord, updateRecord, uploadReceipt, loading } = useFinanceStore();
    const { projects, fetchProjects } = useProjectStore();

    const [projectId, setProjectId] = useState('');
    const [type, setType] = useState<FinancialType>('EXPENSE');
    const [amount, setAmount] = useState<number | ''>('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState<Dayjs>(dayjs());
    const [taxIncluded, setTaxIncluded] = useState(false);
    const [taxRate, setTaxRate] = useState<number | ''>(5);

    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setProjectId(initialData.projectId);
                setType(initialData.type);
                setAmount(initialData.amount);
                setCategory(initialData.category);
                setDescription(initialData.description || '');
                setTransactionDate(dayjs(initialData.transactionDate));
                setTaxIncluded(initialData.taxIncluded || false);
                setTaxRate(initialData.taxRate || 5);
                setReceiptUrl(initialData.receiptUrl);
                setReceiptFile(null);
            } else {
                clearForm();
            }
        }
    }, [open, initialData]);

    const clearForm = () => {
        setProjectId(projects.length > 0 ? projects[0].id : '');
        setType('EXPENSE');
        setAmount('');
        setCategory('');
        setDescription('');
        setTransactionDate(dayjs());
        setTaxIncluded(false);
        setTaxRate(5);
        setReceiptFile(null);
        setReceiptUrl(undefined);
        setSubmitError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitError(null);
        let finalReceiptUrl = receiptUrl;

        // Upload the new file if one was selected
        if (receiptFile) {
            try {
                finalReceiptUrl = await uploadReceipt(receiptFile);
            } catch (error: any) {
                console.error("Failed to upload receipt", error);
                setSubmitError(error.response?.data?.message || error.message || "上傳憑證失敗，請檢查檔案大小或格式");
                return; // Stop form submission
            }
        }

        const requestData: FinancialRecordRequest = {
            projectId,
            type,
            amount: Number(amount),
            category,
            description,
            transactionDate: transactionDate.format('YYYY-MM-DD'),
            taxIncluded,
            taxRate: taxIncluded && taxRate !== '' ? Number(taxRate) : undefined,
            receiptUrl: finalReceiptUrl
        };

        try {
            if (editRecordId) {
                await updateRecord(editRecordId, requestData);
            } else {
                await addRecord(requestData);
            }
            onClose();
        } catch (error: any) {
            console.error(error);
            setSubmitError(error.response?.data?.message || error.message || '儲存失敗');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{editRecordId ? '編輯財務記錄' : '新增財務記錄'}</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>

                        {submitError && (
                            <Typography color="error" variant="body2" sx={{ bgcolor: 'error.light', p: 1, borderRadius: 1, color: 'error.contrastText' }}>
                                儲存失敗: {submitError}
                            </Typography>
                        )}

                        <FormControl fullWidth>
                            <InputLabel>關聯專案 (選填)</InputLabel>
                            <Select
                                value={projectId}
                                label="關聯專案 (選填)"
                                onChange={(e) => setProjectId(e.target.value)}
                            >
                                <MenuItem value="">無專案 (公司收支)</MenuItem>
                                {projects.map((p: any) => (
                                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>收支類型</InputLabel>
                            <Select
                                value={type}
                                label="收支類型"
                                onChange={(e) => {
                                    setType(e.target.value as FinancialType);
                                    setCategory(''); // Reset category when type changes
                                }}
                            >
                                <MenuItem value="INCOME">收入 (Income)</MenuItem>
                                <MenuItem value="EXPENSE">支出 (Expense)</MenuItem>
                            </Select>
                        </FormControl>

                        <Autocomplete
                            freeSolo
                            options={CATEGORIES[type]}
                            value={category}
                            onChange={(_e, newValue) => setCategory(newValue || '')}
                            onInputChange={(_e, newInputValue) => setCategory(newInputValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="分類 (可自訂填寫)" required fullWidth />
                            )}
                        />

                        <Box display="flex" gap={2} alignItems="center">
                            <TextField
                                label="金額 (未稅)"
                                type="number"
                                fullWidth
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={taxIncluded}
                                        onChange={(e) => setTaxIncluded(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="含稅"
                            />
                            {taxIncluded && (
                                <TextField
                                    label="稅率 (%)"
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(e.target.value ? Number(e.target.value) : '')}
                                    inputProps={{ min: 0, step: "0.1" }}
                                    sx={{ width: 100 }}
                                />
                            )}
                        </Box>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="交易日期"
                                value={transactionDate}
                                onChange={(newValue) => setTransactionDate(newValue || dayjs())}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>

                        <TextField
                            label="備註說明"
                            multiline
                            rows={3}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="請填寫財務記錄備註（例如：廠商名稱、統一編號等）"
                        />

                        {/* File Upload Section */}
                        <Box mt={1} p={2} border="1px dashed #ccc" borderRadius={1}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {type === 'INCOME' ? '上傳發票/收據副本 (選填)' : '上傳憑證/收據副本 (選填)'}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    選擇檔案
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/png, image/jpeg, application/pdf"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <Typography variant="body2" color="textSecondary" noWrap>
                                    {receiptFile ? receiptFile.name : (receiptUrl ? '已上傳現有檔案' : '尚未選擇檔案')}
                                </Typography>
                            </Box>

                            {receiptUrl && !receiptFile && (
                                <Box mt={1}>
                                    <Button
                                        size="small"
                                        href={receiptUrl.startsWith('http') ? receiptUrl : `${import.meta.env.VITE_API_URL}${receiptUrl}`}
                                        target="_blank"
                                    >
                                        檢視現有憑證
                                    </Button>
                                </Box>
                            )}
                        </Box>

                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit"> 取消 </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading || !category || amount === '' || amount <= 0}
                    >
                        {loading ? '儲存中...' : '儲存'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
