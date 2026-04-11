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
    Switch,
    alpha,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';

interface AddEventModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: any) => void;
}

export default function AddEventModal({ open, onClose, onSubmit }: AddEventModalProps) {
    const [formData, setFormData] = useState({
        eventName: '',
        category: 'Corporate Event',
        priority: 'Medium',
        date: null as Dayjs | null,
        time: null as Dayjs | null,
        description: '',
        repeatEvent: true, // as per screenshot, it's expanded
        repeatType: 'Daily',
        repeatDays: ['Tue', 'Fri'],
        repeatEveryDay: true,
        repeatTime: null as Dayjs | null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (value: Dayjs | null) => setFormData({ ...formData, date: value });
    const handleTimeChange = (value: Dayjs | null) => setFormData({ ...formData, time: value });

    const handleSubmit = () => {
        if (onSubmit) onSubmit(formData);
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
                        p: { xs: 3, md: 4 },
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
                    Add Event
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <CustomLabel text="Event Name" />
                    <TextField
                        fullWidth
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        placeholder="Katy's Birthday"
                        sx={customInputStyle}
                        size="medium"
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <CustomLabel text="Event Category" />
                    <TextField
                        select
                        fullWidth
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        sx={customInputStyle}
                        SelectProps={{ IconComponent: selectIconComponent }}
                    >
                        <MenuItem value="Corporate Event">Corporate Event</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                        <MenuItem value="Meeting">Meeting</MenuItem>
                    </TextField>
                </Box>

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

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6 }}>
                        <CustomLabel text="Date" />
                        <DatePicker
                            value={formData.date}
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
                    <Grid size={{ xs: 6 }}>
                        <CustomLabel text="Time" />
                        <TimePicker
                            value={formData.time}
                            onChange={handleTimeChange}
                            slotProps={{ 
                                textField: { 
                                    fullWidth: true,
                                    placeholder: "Select Time",
                                    sx: customInputStyle
                                } 
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mb: 4 }}>
                    <CustomLabel text="Description" />
                    <TextField
                        fullWidth
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add some description of the event"
                        sx={customInputStyle}
                    />
                </Box>

                <Box sx={{ 
                    bgcolor: '#F8F9FA', 
                    borderRadius: '16px', 
                    p: 2.5, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        Repeat Event
                    </Typography>
                    <Switch 
                        checked={formData.repeatEvent}
                        onChange={(e) => setFormData({...formData, repeatEvent: e.target.checked})}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#3F8CFF',
                                '&:hover': {
                                    backgroundColor: alpha('#3F8CFF', 0.08),
                                },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#3F8CFF',
                            },
                            '& .MuiSwitch-track': {
                                backgroundColor: '#D1D5DB',
                            }
                        }}
                    />
                </Box>

                {formData.repeatEvent && (
                    <Box sx={{ mb: 4 }}>
                        <CustomLabel text="Complete this task" />
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            {['Daily', 'Weekly', 'Monthly'].map(type => (
                                <Button
                                    key={type}
                                    variant={formData.repeatType === type ? "contained" : "outlined"}
                                    onClick={() => setFormData({ ...formData, repeatType: type })}
                                    sx={{
                                        flex: 1,
                                        borderRadius: '12px',
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontFamily: 'Nunito Sans',
                                        fontSize: 14,
                                        bgcolor: formData.repeatType === type ? '#3F8CFF' : 'transparent',
                                        color: formData.repeatType === type ? 'white' : '#A0AEC0',
                                        borderColor: formData.repeatType === type ? '#3F8CFF' : '#E6EDF5',
                                        boxShadow: formData.repeatType === type ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none',
                                        '&:hover': {
                                            bgcolor: formData.repeatType === type ? '#3377E6' : '#F8F9FA'
                                        }
                                    }}
                                >
                                    {type}
                                </Button>
                            ))}
                        </Box>

                        <CustomLabel text="On these days" />
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                const isActive = formData.repeatDays.includes(day);
                                return (
                                    <Button
                                        key={day}
                                        onClick={() => {
                                            const newDays = isActive 
                                                ? formData.repeatDays.filter(d => d !== day)
                                                : [...formData.repeatDays, day];
                                            setFormData({ ...formData, repeatDays: newDays });
                                        }}
                                        sx={{
                                            minWidth: 0,
                                            width: 44,
                                            height: 44,
                                            borderRadius: '12px',
                                            bgcolor: isActive ? '#3F8CFF' : '#F8F9FA',
                                            color: isActive ? 'white' : '#A0AEC0',
                                            fontWeight: 700,
                                            fontSize: 14,
                                            fontFamily: 'Nunito Sans',
                                            textTransform: 'none',
                                            p: 0,
                                            '&:hover': {
                                                bgcolor: isActive ? '#3377E6' : '#E2E8F0'
                                            }
                                        }}
                                    >
                                        {day}
                                    </Button>
                                );
                            })}
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={formData.repeatEveryDay}
                                        onChange={(e) => setFormData({ ...formData, repeatEveryDay: e.target.checked })}
                                        sx={{ 
                                            color: '#E6EDF5',
                                            '&.Mui-checked': {
                                                color: '#0A1629',
                                            },
                                            '& .MuiSvgIcon-root': { fontSize: 28 }
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                        Repeat every day
                                    </Typography>
                                }
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <CustomLabel text="Time" />
                            <TimePicker
                                value={formData.repeatTime}
                                onChange={(val) => setFormData({ ...formData, repeatTime: val })}
                                slotProps={{ 
                                    textField: { 
                                        fullWidth: true,
                                        placeholder: "Select Time",
                                        sx: customInputStyle
                                    } 
                                }}
                            />
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                        Save Event
                    </Button>
                </Box>
            </Dialog>
        </LocalizationProvider>
    );
}
