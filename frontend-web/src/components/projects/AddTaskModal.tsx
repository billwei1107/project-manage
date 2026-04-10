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
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (taskData: any) => void;
}

export default function AddTaskModal({ open, onClose, onSubmit }: AddTaskModalProps) {
    const [formData, setFormData] = useState({
        taskName: '',
        taskGroup: 'Design',
        estimate: '',
        deadLine: null as Dayjs | null,
        priority: 'Medium',
        assignee: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (value: Dayjs | null) => {
        setFormData({ ...formData, deadLine: value });
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formData);
        }
        onClose();
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

    const selectIconComponent = () => (
        <Box sx={{ mx: 2, display: 'flex' }}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#718EBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </Box>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { 
                        borderRadius: '24px',
                        p: 4,
                        maxWidth: '600px',
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

                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1629', mb: 4, mt: 1 }}>
                    Add Task
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <CustomLabel text="Task Name" />
                    <TextField
                        fullWidth
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleChange}
                        placeholder="Task Name"
                        sx={customInputStyle}
                        size="medium"
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <CustomLabel text="Task Group" />
                    <TextField
                        select
                        fullWidth
                        name="taskGroup"
                        value={formData.taskGroup}
                        onChange={handleChange}
                        sx={customInputStyle}
                        SelectProps={{ IconComponent: selectIconComponent }}
                    >
                        <MenuItem value="Design">Design</MenuItem>
                        <MenuItem value="Development">Development</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                    </TextField>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6 }}>
                        <CustomLabel text="Estimate" />
                        <TextField
                            fullWidth
                            name="estimate"
                            value={formData.estimate}
                            onChange={handleChange}
                            placeholder="Select duration"
                            sx={customInputStyle}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccessTimeIcon sx={{ color: '#7D8592' }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <CustomLabel text="Dead Line" />
                        <DatePicker
                            value={formData.deadLine}
                            onChange={handleDateChange}
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
                        SelectProps={{ IconComponent: selectIconComponent }}
                    >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                    </TextField>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <CustomLabel text="Assignee" />
                    <TextField
                        select
                        fullWidth
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        sx={customInputStyle}
                        SelectProps={{ displayEmpty: true, IconComponent: selectIconComponent }}
                    >
                        <MenuItem value="" disabled sx={{ color: '#8898AA' }}>
                            Select Assignee
                        </MenuItem>
                        <MenuItem value="Evan Yates">Evan Yates</MenuItem>
                        <MenuItem value="Emily Chen">Emily Chen</MenuItem>
                    </TextField>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <CustomLabel text="Description" />
                    <TextField
                        fullWidth
                        name="description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add some description of the task"
                        sx={customInputStyle}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <IconButton sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#F4F7FE', color: '#8C52FF', '&:hover': { bgcolor: '#EBE3FF' } }}>
                            <AttachFileIcon sx={{ transform: 'rotate(45deg)' }} fontSize="small"  />
                        </IconButton>
                        <IconButton sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#E6F9F5', color: '#06D6A0', '&:hover': { bgcolor: '#D1F4EC' } }}>
                            <LinkIcon fontSize="small" />
                        </IconButton>
                    </Box>
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
                        Save Task
                    </Button>
                </Box>
            </Dialog>
        </LocalizationProvider>
    );
}
