import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Box, Typography, IconButton,
    TextField, Button, InputAdornment, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CircularProgress from '@mui/material/CircularProgress';

interface LogTimeModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
}

export default function LogTimeModal({ open, onClose, onSave }: LogTimeModalProps) {
    const [timeSpent, setTimeSpent] = useState('1w 4d 6h 40m');
    const [date, setDate] = useState('Dec 20, 2020');
    const [time, setTime] = useState('2:00 PM');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        if (onSave) {
            onSave({ timeSpent, date, time, description });
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '24px', p: 1, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.20)' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    Time Tracking
                </Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                    <CloseIcon sx={{ color: '#0A1629' }} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {/* Illustration Banner */}
                <Box sx={{
                    height: 140,
                    bgcolor: 'rgba(32, 85, 163, 0.05)', // Very light blue background placeholder for illustration
                    borderRadius: '14px',
                    mb: 3,
                    mt: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Decorative abstract elements to mimic illustration */}
                    <Box sx={{ position: 'absolute', left: 20, top: 40, width: 30, height: 60, bgcolor: '#FFD166', borderRadius: '4px', transform: 'rotate(-15deg)' }} />
                    <Box sx={{ position: 'absolute', right: 20, bottom: -10, width: 40, height: 80, bgcolor: '#3F8CFF', borderRadius: '4px' }} />
                    <Box sx={{ position: 'absolute', right: 40, top: 20, width: 24, height: 24, bgcolor: '#0AC947', borderRadius: '50%' }} />

                    {/* Stats Card Overlay */}
                    <Box sx={{
                        bgcolor: '#F4F9FD',
                        borderRadius: '14px',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        minWidth: '80%',
                        zIndex: 1,
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate" value={100} sx={{ color: 'rgba(125, 133, 146, 0.20)' }} size={40} thickness={4} />
                            <CircularProgress variant="determinate" value={35} sx={{ color: '#3F8CFF', position: 'absolute', left: 0 }} size={40} thickness={4} />
                        </Box>
                        <Box>
                            <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                1d 3h 25m logged
                            </Typography>
                            <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans' }}>
                                Original Estimate 3d 8h
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Form Fields */}
                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                    Time spent
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="1w 4d 6h 40m"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                    }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Date
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Dec 20, 2020"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <CalendarMonthOutlinedIcon sx={{ color: '#7D8592' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Time
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="2:00 PM"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccessTimeOutlinedIcon sx={{ color: '#7D8592' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                </Grid>

                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                    Work Description
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Add some description of the task"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            bgcolor: '#3F8CFF',
                            color: 'white',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontFamily: 'Nunito Sans',
                            px: 4,
                            py: 1.2,
                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                            '&:hover': { bgcolor: '#2b78e4' }
                        }}
                    >
                        Save Task
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
