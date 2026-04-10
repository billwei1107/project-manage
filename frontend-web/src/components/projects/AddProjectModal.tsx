import React, { useState } from 'react';
import {
    Dialog,
    IconButton,
    Button,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Box,
    useTheme,
    alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import type { Project, ProjectStatus } from '../../types/project';

interface AddProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (projectData: any) => void;
    project?: Project | null;
}

const PRESETS = [
    { type: 'pattern', color: '#FFD166' },
    { type: 'pattern', color: '#06D6A0' },
    { type: 'pattern', color: '#118AB2' },
    { type: 'pattern', color: '#A259FF' },
    { type: 'blob', color: '#3F8CFF' },
    { type: 'blob', color: '#8C52FF' },
    { type: 'blob', color: '#00C9FF' },
    { type: 'blob', color: '#00E676' },
    { type: 'blob', color: '#E040FB' },
    { type: 'blob', color: '#FFCA28' },
    { type: 'blob', color: '#FF5252' },
];

export default function AddProjectModal({ open, onClose, onSubmit, project }: AddProjectModalProps) {
    const theme = useTheme();
    
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        budget: '',
        startDate: null as Dayjs | null,
        endDate: null as Dayjs | null,
        description: '',
        priority: 'Medium',
        avatarId: 0,
        status: 'PLANNING' as ProjectStatus,
        teamIds: [] as string[],
        githubToken: '',
        fileLocation: '',
        githubRepo: '',
        githubBranch: '',
        backupConfig: '',
        createGithubRepo: false,
        githubRepoName: '',
        githubPrivate: true
    });

    React.useEffect(() => {
        if (open && project) {
            setFormData(prev => ({
                ...prev,
                title: project.title || '',
                client: project.client || '',
                budget: project.budget?.toString() || '',
                startDate: project.startDate ? dayjs(project.startDate) : null,
                endDate: project.endDate ? dayjs(project.endDate) : null,
                description: project.description || '',
                status: project.status || 'PLANNING',
                teamIds: project.team?.map(t => t.id) || [],
            }));
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

    const handleAvatarSelect = (idx: number) => {
        setFormData({ ...formData, avatarId: idx });
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
            priority: 'Medium',
            avatarId: 0,
            status: 'PLANNING',
            teamIds: [],
            githubToken: '',
            fileLocation: '',
            githubRepo: '',
            githubBranch: '',
            backupConfig: '',
            createGithubRepo: false,
            githubRepoName: '',
            githubPrivate: true
        });
    };

    const customInputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'transparent',
            '& fieldset': {
                borderColor: '#E6EDF5',
            },
            '&:hover fieldset': {
                borderColor: '#3F8CFF',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#3F8CFF',
                borderWidth: '1px',
                boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.1)',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#A0AEC0',
            fontWeight: 600,
            fontSize: '14px',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#3F8CFF',
        }
    };

    const CustomLabel = ({ text }: { text: string }) => (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#8898AA', mb: 1 }}>
            {text}
        </Typography>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                PaperProps={{
                    sx: { 
                        borderRadius: '24px',
                        p: 4,
                        maxWidth: '920px',
                        width: '100%',
                        boxShadow: '0px 20px 50px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <IconButton 
                    onClick={onClose}
                    sx={{ 
                        position: 'absolute', 
                        right: 24, 
                        top: 24,
                        bgcolor: '#F8F9FA',
                        color: '#0A1629',
                        '&:hover': { bgcolor: '#E2E8F0' }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A1629', mb: 5, mt: 1 }}>
                    Add Project
                </Typography>

                <Grid container spacing={6}>
                    {/* Left Column: Forms */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box sx={{ mb: 3 }}>
                            <CustomLabel text="Project Name" />
                            <TextField
                                fullWidth
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Project Name"
                                sx={customInputStyle}
                                size="medium"
                            />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CustomLabel text="Starts" />
                                <DatePicker
                                    value={formData.startDate}
                                    onChange={handleDateChange('startDate')}
                                    slotProps={{ 
                                        textField: { 
                                            fullWidth: true,
                                            placeholder: "Select Date",
                                            sx: customInputStyle
                                        } 
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CustomLabel text="Dead Line" />
                                <DatePicker
                                    value={formData.endDate}
                                    onChange={handleDateChange('endDate')}
                                    slotProps={{ 
                                        textField: { 
                                            fullWidth: true,
                                            placeholder: "Select Date",
                                            sx: customInputStyle
                                        } 
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 3 }}>
                            <CustomLabel text="Priority" />
                            <TextField
                                select
                                fullWidth
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                sx={customInputStyle}
                                SelectProps={{
                                    IconComponent: () => <Box sx={{ mx: 2, display: 'flex' }}><svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#718EBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Box>
                                }}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <CustomLabel text="Description" />
                            <TextField
                                fullWidth
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Add some description of the project"
                                sx={customInputStyle}
                            />
                        </Box>
                    </Grid>

                    {/* Right Column: Image Picker */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ 
                            border: '1px solid #E6EDF5', 
                            borderRadius: '24px', 
                            p: 3,
                            mb: 2,
                            position: 'relative'
                        }}>
                            <Typography sx={{ fontWeight: 800, color: '#0A1629', mb: 1 }}>
                                Select image
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: '#8898AA', mb: 3, lineHeight: 1.6 }}>
                                Select or upload an avatar for the project (available formats: jpg, png)
                            </Typography>

                            <Grid container spacing={2}>
                                {PRESETS.map((preset, idx) => (
                                    <Grid size={{ xs: 3 }} key={idx}>
                                        <Box 
                                            onClick={() => handleAvatarSelect(idx)}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '16px',
                                                bgcolor: preset.type === 'pattern' ? alpha(preset.color, 0.1) : alpha(preset.color, 0.1),
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: formData.avatarId === idx ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}
                                        >
                                            <Box sx={{ 
                                                width: 20, 
                                                height: 20, 
                                                bgcolor: preset.color,
                                                borderRadius: preset.type === 'pattern' ? '40% 60% 70% 30% / 40% 50% 60% 50%' : '50% 50% 50% 20% / 60% 40% 70% 40%',
                                                transform: `rotate(${idx * 45}deg)`,
                                                opacity: 0.8
                                            }} />
                                        </Box>
                                    </Grid>
                                ))}
                                <Grid size={{ xs: 3 }}>
                                    <Box 
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '16px',
                                            border: '2px dashed #3F8CFF',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'transparent',
                                            color: '#3F8CFF',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#3F8CFF', 0.05) }
                                        }}
                                    >
                                        <CloudUploadOutlinedIcon fontSize="small" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5, mb: { xs: 4, md: 0 } }}>
                            <IconButton sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#F4F7FE', color: '#8C52FF', '&:hover': { bgcolor: '#EBE3FF' } }}>
                                <AttachFileIcon fontSize="small" />
                            </IconButton>
                            <IconButton sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#E6F9F5', color: '#06D6A0', '&:hover': { bgcolor: '#D1F4EC' } }}>
                                <LinkIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: { xs: 2, md: 8 } }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    bgcolor: '#3F8CFF',
                                    color: 'white',
                                    borderRadius: '12px',
                                    py: 1.5,
                                    px: 4,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                                    '&:hover': { bgcolor: '#3377E6' }
                                }}
                            >
                                Save Project
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>
        </LocalizationProvider>
    );
}
