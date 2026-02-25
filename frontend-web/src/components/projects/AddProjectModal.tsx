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
    Assignment,
    Autorenew,
    RateReview,
    CheckCircle
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import type { Project, ProjectStatus } from '../../types/project';
import UserSelect from '../common/UserSelect';

interface AddProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (projectData: any) => void;
    project?: Project | null;
}

export default function AddProjectModal({ open, onClose, onSubmit, project }: AddProjectModalProps) {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        budget: '',
        startDate: null as Dayjs | null,
        endDate: null as Dayjs | null,
        description: '',
        status: 'PLANNING' as ProjectStatus,
        teamIds: [] as string[],
        githubToken: '',
        fileLocation: '',
        githubRepo: '',
        githubBranch: '',
        backupConfig: ''
    });

    React.useEffect(() => {
        if (open && project) {
            setFormData({
                title: project.title || '',
                client: project.client || '',
                budget: project.budget?.toString() || '',
                startDate: project.startDate ? dayjs(project.startDate) : null,
                endDate: project.endDate ? dayjs(project.endDate) : null,
                description: project.description || '',
                status: project.status || 'PLANNING',
                teamIds: project.team?.map(t => t.id) || [],
                githubToken: project.githubToken || '',
                fileLocation: project.fileLocation || '',
                githubRepo: project.githubRepo || '',
                githubBranch: project.githubBranch || '',
                backupConfig: project.backupConfig || ''
            });
        } else if (open && !project) {
            clearFormData();
        }
    }, [open, project]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (name: 'startDate' | 'endDate') => (value: Dayjs | null) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            budget: Number(formData.budget),
            startDate: formData.startDate ? formData.startDate.toISOString() : null,
            endDate: formData.endDate ? formData.endDate.toISOString() : null,
        });
        clearFormData();
        onClose();
    };

    const clearFormData = () => {
        setFormData({
            title: '',
            client: '',
            budget: '',
            startDate: null,
            endDate: null,
            description: '',
            status: 'PLANNING',
            teamIds: [],
            githubToken: '',
            fileLocation: '',
            githubRepo: '',
            githubBranch: '',
            backupConfig: ''
        });
    };

    const resetForm = () => {
        clearFormData();
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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
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
                            {project ? '編輯專案 (Edit Project)' : '新增專案 (New Project)'}
                            <Typography variant="body2" color="text.secondary" fontWeight="400">
                                {project ? '修改專案資訊與狀態' : '建立一個新專案以開始追蹤進度與資源'}
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
                                    label="專案名稱"
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
                                    label="客戶名稱"
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
                                    label="專案階段"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Assignment fontSize="small" color="action" /></InputAdornment>,
                                    }}
                                >
                                    <MenuItem value="PLANNING">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Assignment fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                                            規劃中
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="IN_PROGRESS">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Autorenew fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                            進行中
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="REVIEW">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <RateReview fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                                            審核中
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="DONE">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                                            已完成
                                        </Box>
                                    </MenuItem>
                                </TextField>
                            </Stack>
                        </Grid>

                        {/* Right Column: Schedule & Budget */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <SectionHeader icon={<DateRange fontSize="small" />} text="時程與預算 (Schedule & Budget)" />
                            <Stack spacing={2.5}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <DatePicker
                                        label="開始日期"
                                        value={formData.startDate}
                                        onChange={handleDateChange('startDate')}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                    <DatePicker
                                        label="結束日期"
                                        value={formData.endDate}
                                        onChange={handleDateChange('endDate')}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </Stack>
                                <TextField
                                    fullWidth
                                    label="專案預算"
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
                                    label="指派專案成員"
                                    valueArr={formData.teamIds}
                                    onChange={(_id) => { }}
                                    onChangeArr={(ids) => setFormData({ ...formData, teamIds: ids })}
                                />
                                <TextField
                                    fullWidth
                                    label="專案詳細描述"
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
                        {project ? '確認修改 (Update)' : '確認建立 (Create)'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
