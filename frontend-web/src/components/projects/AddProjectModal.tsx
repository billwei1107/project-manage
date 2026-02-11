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
    Typography,
    Box,
    Divider,
    Stack,
    // FormLabel removed
    useTheme,
    alpha
} from '@mui/material';
import {
    Description,
    AttachMoney,
    DateRange,
    Person,
    Work,
    Title,
    Business,
    Assignment
} from '@mui/icons-material';
import type { ProjectStatus } from '../../types/project';
import UserSelect from '../common/UserSelect';

interface AddProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (projectData: any) => void;
}

export default function AddProjectModal({ open, onClose, onSubmit }: AddProjectModalProps) {
    const theme = useTheme();
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
        resetForm();
    };

    const resetForm = () => {
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
        onClose();
    };

    const SectionHeader = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, mt: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    p: 0.8,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                }}
            >
                {icon}
            </Box>
            <Typography variant="subtitle1" fontWeight="700" color="text.primary">
                {text}
            </Typography>
        </Stack>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2
            }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 1,
                        borderRadius: 2,
                        display: 'flex'
                    }}>
                        <Work />
                    </Box>
                    <Box>
                        新增專案 (New Project)
                        <Typography variant="body2" color="text.secondary" fontWeight="400">
                            建立一個新專案以開始追蹤進度與資源
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Grid container spacing={4}>
                    {/* Left Column: Core Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SectionHeader icon={<Business fontSize="small" />} text="基本資訊 (Basic Info)" />
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="專案名稱 (Project Name)"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="例如：企業資源規劃系統 ERP"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Title fontSize="small" color="action" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="客戶名稱 (Client)"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                placeholder="例如：ABC 科技有限公司"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Business fontSize="small" color="action" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="專案階段 (Status)"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Assignment fontSize="small" color="action" /></InputAdornment>,
                                }}
                            >
                                <MenuItem value="PLANNING">📝 規劃中 (Planning)</MenuItem>
                                <MenuItem value="IN_PROGRESS">🚀 進行中 (In Progress)</MenuItem>
                                <MenuItem value="REVIEW">👀 審核中 (Review)</MenuItem>
                                <MenuItem value="DONE">✅ 已完成 (Done)</MenuItem>
                            </TextField>
                        </Stack>
                    </Grid>

                    {/* Right Column: Schedule & Details */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SectionHeader icon={<DateRange fontSize="small" />} text="時程與預算 (Schedule & Budget)" />
                        <Stack spacing={2.5}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    fullWidth
                                    label="開始日期"
                                    name="startDate"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                                <TextField
                                    fullWidth
                                    label="結束日期"
                                    name="endDate"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />
                            </Stack>
                            <TextField
                                fullWidth
                                label="專案預算 (Budget)"
                                name="budget"
                                type="number"
                                value={formData.budget}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><AttachMoney fontSize="small" color="action" /></InputAdornment>,
                                }}
                            />
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Full Width: Team & Description */}
                    <Grid size={{ xs: 12 }}>
                        <SectionHeader icon={<Person fontSize="small" />} text="團隊與描述 (Team & Details)" />
                        <Stack spacing={2.5}>
                            <UserSelect
                                multiple
                                label="指派專案成員 (Assign Team Members)"
                                valueArr={formData.teamIds}
                                onChange={(_id) => { }}
                                onChangeArr={(ids) => setFormData({ ...formData, teamIds: ids })}
                            />
                            <TextField
                                fullWidth
                                label="專案詳細描述 (Description)"
                                name="description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="輸入專案的詳細說明、目標與備註..."
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ mt: 1.5 }}><Description fontSize="small" color="action" /></InputAdornment>,
                                }}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.default' }}>
                <Button
                    onClick={resetForm}
                    color="inherit"
                    size="large"
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    取消 (Cancel)
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={!formData.title}
                    startIcon={<Work />}
                    sx={{ borderRadius: 2, px: 4, boxShadow: 4 }}
                >
                    確認建立 (Create)
                </Button>
            </DialogActions>
        </Dialog>
    );
}
