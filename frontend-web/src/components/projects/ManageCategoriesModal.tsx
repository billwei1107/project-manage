import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Box,
    Typography,
    Tabs,
    Tab,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../api/axios';
import { type FinanceCategory, type FinancialType } from '../../types/finance';

interface ManageCategoriesModalProps {
    open: boolean;
    onClose: () => void;
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ open, onClose }) => {
    const [categories, setCategories] = useState<FinanceCategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [currentTab, setCurrentTab] = useState<FinancialType>('EXPENSE');

    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/finance-categories');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleAdd = async () => {
        if (!newCategoryName.trim()) return;
        try {
            await api.post('/finance-categories', {
                name: newCategoryName.trim(),
                type: currentTab
            });
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Failed to add category. Name might already exist.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('確定要刪除此分類嗎？ (Are you sure you want to delete this category?)')) return;
        try {
            await api.delete(`/finance-categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Failed to delete category');
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: FinancialType) => {
        setCurrentTab(newValue);
    };

    const filteredCategories = categories.filter(c => c.type === currentTab);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>管理收支分類 (Manage Categories)</DialogTitle>
            <DialogContent>
                <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="支出 (Expense)" value="EXPENSE" />
                    <Tab label="收入 (Income)" value="INCOME" />
                </Tabs>

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="新增分類名稱 (New Category Name)"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <Button variant="contained" onClick={handleAdd} startIcon={<AddIcon />}>
                        新增
                    </Button>
                </Box>

                <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    {filteredCategories.length === 0 ? (
                        <ListItem>
                            <ListItemText primary={<Typography color="textSecondary" align="center">暫無分類 (No categories)</Typography>} />
                        </ListItem>
                    ) : (
                        filteredCategories.map((cat) => (
                            <ListItem
                                key={cat.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(cat.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
                            >
                                <ListItemText primary={cat.name} />
                            </ListItem>
                        ))
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">完成 (Done)</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageCategoriesModal;
