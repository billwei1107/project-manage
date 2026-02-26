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
    Autocomplete,
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
    event?: any; // If provided, modal is in edit mode
}

export default function AddEventModal({ open, onClose, event }: AddEventModalProps) {
    const theme = useTheme();
    const { createEvent, updateEvent, loading, error } = useEventStore();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<string | null>('公司活動');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());
    const [description, setDescription] = useState('');
    const [isRepeat, setIsRepeat] = useState(false);
    const [repeatType, setRepeatType] = useState<RepeatType>('None');

    const categoryOptions = ['公司活動', '會議', '個人', '其他'];

    // Reset or populate form when opened
    useEffect(() => {
        if (open) {
            if (event) {
                setTitle(event.title);
                setCategory(event.category || '公司活動');
                setPriority(event.priority);
                setDate(dayjs(event.startDate));
                setTime(dayjs(event.startDate));
                setDescription(event.description || '');
                setIsRepeat(event.repeatType !== 'None');
                setRepeatType(event.repeatType || 'None');
            } else {
                setTitle('');
                setCategory('公司活動');
                setPriority('Medium');
                setDate(dayjs());
                setTime(dayjs());
                setDescription('');
                setIsRepeat(false);
                setRepeatType('None');
            }
        }
    }, [open, event]);

    const handleSave = async () => {
        if (!title || !date || !time) return;

        // Combine date and time
        const startDateTime = date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);

        // Default end time to 1 hour after start
        const endDateTime = startDateTime.add(1, 'hour');

        const eventData: EventRequest = {
            title,
            category: category || '未分類',
            priority,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            description,
            repeatType: isRepeat ? repeatType : 'None',
        };

        try {
            if (event) {
                await updateEvent(event.id, eventData);
            } else {
                await createEvent(eventData);
            }
            onClose();
        } catch (err) {
            console.error('Failed to save event', err);
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
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{event ? '編輯事件' : '新增事件'}</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.1) }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>事件名稱</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="例如：部門會議"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>事件類別</Typography>
                            <Autocomplete
                                freeSolo
                                options={categoryOptions}
                                value={category}
                                onChange={(_, newValue) => setCategory(newValue)}
                                onInputChange={(_, newInputValue) => setCategory(newInputValue)}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                )}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>優先級</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Priority)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="Low">低</MenuItem>
                                    <MenuItem value="Medium">中</MenuItem>
                                    <MenuItem value="High">高</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>日期</Typography>
                                <DatePicker
                                    value={date}
                                    onChange={(newValue) => setDate(newValue as Dayjs | null)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } } }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>時間</Typography>
                                <TimePicker
                                    value={time}
                                    onChange={(newValue) => setTime(newValue as Dayjs | null)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } } }}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>詳細描述</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="請輸入事件描述"
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
                                <Typography sx={{ fontWeight: 600 }}>重複事件</Typography>
                                <Switch checked={isRepeat} onChange={(e) => setIsRepeat(e.target.checked)} color="primary" />
                            </Box>

                            {isRepeat && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>重複頻率</Typography>
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
                                        <ToggleButton value="Daily">每天</ToggleButton>
                                        <ToggleButton value="Weekly">每週</ToggleButton>
                                        <ToggleButton value="Monthly">每月</ToggleButton>
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : (event ? '儲存變更' : '建立事件')}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
