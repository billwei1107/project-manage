import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import type { ProjectStatus } from '../../types/project';
import UserSelect from '../common/UserSelect';

interface AddProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (projectData: any) => void;
}

export default function AddProjectModal({ open, onClose, onSubmit }: AddProjectModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        budget: '',
        startDate: '',
        endDate: '',
        description: '',
        status: 'PLANNING' as ProjectStatus,
        teamIds: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            budget: Number(formData.budget),
        });
        onClose();
        // Reset form
        setFormData({
            title: '',
            client: '',
            budget: '',
            startDate: '',
            endDate: '',
            description: '',
            status: 'PLANNING',
            teamIds: [],
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>新增專案 (New Project)</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="專案名稱 (Project Name)"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="客戶名稱 (Client)"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="預算 (Budget)"
                            name="budget"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            value={formData.budget}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="開始日期 (Start Date)"
                            name="startDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="結束日期 (End Date)"
                            name="endDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <UserSelect
                            multiple
                            label="專案成員 (Team Members)"
                            valueArr={formData.teamIds}
                            onChange={(id) => { }} // Dummy for multiple mode
                            onChangeArr={(ids) => setFormData({ ...formData, teamIds: ids })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            select
                            label="狀態 (Status)"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="PLANNING">規劃中 (Planning)</MenuItem>
                            <MenuItem value="IN_PROGRESS">進行中 (In Progress)</MenuItem>
                            <MenuItem value="REVIEW">審核中 (Review)</MenuItem>
                            <MenuItem value="DONE">已完成 (Done)</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="專案描述 (Description)"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} color="inherit">
                    取消
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    建立專案
                </Button>
            </DialogActions>
        </Dialog>
    );
}
