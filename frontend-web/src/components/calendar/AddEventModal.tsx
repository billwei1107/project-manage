import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    Switch,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    alpha,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useEventStore } from '../../stores/useEventStore';
import type { EventRequest, Priority, RepeatType } from '../../types/event';

/**
 * @file AddEventModal.tsx
 * @description 新增/編輯事件彈窗 / Add Event Modal
 * @description_en Modal for creating and editing calendar events
 * @description_zh 用於新增與編輯行事曆事件的彈出視窗
 */

interface AddEventModalProps {
    open: boolean;
    onClose: () => void;
    // targetDate?: Date; // Optional: pre-fill date if clicked on calendar grid
}

export default function AddEventModal({ open, onClose }: AddEventModalProps) {
    const theme = useTheme();
    const { createEvent, loading, error } = useEventStore();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Corporate Event');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());
    const [description, setDescription] = useState('');
    const [isRepeat, setIsRepeat] = useState(false);
    const [repeatType, setRepeatType] = useState<RepeatType>('None');

    // Reset form when opened
    useEffect(() => {
        if (open) {
            setTitle('');
            setCategory('Corporate Event');
            setPriority('Medium');
            setDate(dayjs());
            setTime(dayjs());
            setDescription('');
            setIsRepeat(false);
            setRepeatType('None');
        }
    }, [open]);

    const handleSave = async () => {
        if (!title || !date || !time) return;

        // Combine date and time
        const startDateTime = date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);

        // Default end time to 1 hour after start
        const endDateTime = startDateTime.add(1, 'hour');

        const eventData: EventRequest = {
            title,
            category,
            priority,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            description,
            repeatType: isRepeat ? repeatType : 'None',
        };

        try {
            await createEvent(eventData);
            onClose();
        } catch (err) {
            console.error('Failed to create event', err);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Event</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.1) }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>Event Name</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="e.g. Katy's Birthday"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>Event Category</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="Corporate Event">Corporate Event</MenuItem>
                                    <MenuItem value="Meeting">Meeting</MenuItem>
                                    <MenuItem value="Personal">Personal</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>Priority</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>Date</Typography>
                                <DatePicker
                                    value={date}
                                    onChange={(newValue) => setDate(newValue as Dayjs | null)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } } }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>Time</Typography>
                                <TimePicker
                                    value={time}
                                    onChange={(newValue) => setTime(newValue as Dayjs | null)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } } }}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>Description</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Add some description of the event"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={4}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        {/* Repeat Toggle UI */}
                        <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 600 }}>Repeat Event</Typography>
                                <Switch checked={isRepeat} onChange={(e) => setIsRepeat(e.target.checked)} color="primary" />
                            </Box>

                            {isRepeat && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>Complete this task</Typography>
                                    <ToggleButtonGroup
                                        value={repeatType}
                                        exclusive
                                        onChange={(_, newVal) => { if (newVal) setRepeatType(newVal); }}
                                        fullWidth
                                        size="small"
                                        sx={{
                                            '& .MuiToggleButton-root': {
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                borderColor: theme.palette.divider,
                                                '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="Daily">Daily</ToggleButton>
                                        <ToggleButton value="Weekly">Weekly</ToggleButton>
                                        <ToggleButton value="Monthly">Monthly</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            )}
                        </Box>

                        {error && (
                            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading || !title || !date || !time}
                        sx={{ borderRadius: 2, px: 4, py: 1, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Event'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
