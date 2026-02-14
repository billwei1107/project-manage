import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Avatar,
    Stack,
    ListItemIcon
} from '@mui/material';
import {
    Assignment,
    Autorenew,
    CheckCircle,
    CalendarToday,
    AccessTime,
    Person,
    Subject,
    Delete
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import type { Task, TaskStatus, UserInfo } from '../../types/project';
import { format, parseISO } from 'date-fns';

interface TaskDetailModalProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    team: UserInfo[];
    onSave: (taskId: string, updates: Partial<Task>) => Promise<void>;
    onDelete: (taskId: string) => Promise<void>;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'TODO', label: '待辦 (To Do)', icon: <Assignment fontSize="small" />, color: 'text.secondary' },
    { value: 'DOING', label: '進行中 (In Progress)', icon: <Autorenew fontSize="small" />, color: 'primary.main' },
    { value: 'DONE', label: '已完成 (Done)', icon: <CheckCircle fontSize="small" />, color: 'success.main' },
];

export default function TaskDetailModal({ open, onClose, task, team, onSave, onDelete }: TaskDetailModalProps) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setStatus(task.status);
            setAssigneeId(task.assignee?.id || '');
            setDescription(task.description || '');
            if (task.deadline) {
                try {
                    setDeadline(dayjs(task.deadline));
                } catch (e) {
                    console.error("Error parsing date", e);
                    setDeadline(null);
                }
            } else {
                setDeadline(null);
            }
        } else {
            setTitle('');
            setStatus('TODO');
            setAssigneeId('');
            setDescription('');
            setDeadline(null);
        }
    }, [task]);

    const handleSave = async () => {
        if (!task) return;
        setLoading(true);
        try {
            await onSave(task.id, {
                title,
                status,
                assigneeId: assigneeId || '',
                description,
                deadline: deadline ? deadline.toISOString() : undefined
            } as any);
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;
        if (confirm('確定要刪除此任務嗎？ (Are you sure you want to delete this task?)')) {
            setLoading(true);
            try {
                await onDelete(task.id);
                onClose();
            } catch (error) {
                console.error("Failed to delete task", error);
            } finally {
                setLoading(false);
            }
        }
    }

    if (!task) return null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        #{task.projectId.substring(0, 4)}
                    </Typography>
                    <Typography variant="h6" fontWeight="700">
                        {task.title}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
                        <TextField
                            label="任務標題 (Title)"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">狀態 (Status)</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={status}
                                label="狀態 (Status)"
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: opt.color }}>
                                            <Box sx={{ mr: 1, display: 'flex' }}>{opt.icon}</Box>
                                            {opt.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="assignee-select-label" shrink>負責人 (Assignee)</InputLabel>
                            <Select
                                labelId="assignee-select-label"
                                value={assigneeId}
                                label="負責人 (Assignee)"
                                onChange={(e) => setAssigneeId(e.target.value)}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <Typography color="text.secondary"><em>未指派 (Unassigned)</em></Typography>;
                                    }
                                    const user = team.find(u => u.id === selected);
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                                {user?.name.charAt(0)}
                                            </Avatar>
                                            {user?.name}
                                        </Box>
                                    );
                                }}
                            >
                                <MenuItem value="">
                                    <em>未指派 (Unassigned)</em>
                                </MenuItem>
                                {team.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                                {user.name.charAt(0)}
                                            </Avatar>
                                            {user.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <DateTimePicker
                            label="截止日期 (Deadline)"
                            value={deadline}
                            onChange={(newValue) => setDeadline(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    InputProps: {
                                        startAdornment: <AccessTime color="action" sx={{ mr: 1 }} />
                                    }
                                }
                            }}
                        />

                        <TextField
                            label="描述 / 備註 (Description)"
                            multiline
                            rows={4}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="輸入任務詳細內容..."
                        />

                        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                            <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday fontSize="inherit" sx={{ mr: 1 }} />
                                    建立時間: {task.createdAt ? format(parseISO(task.createdAt), 'yyyy-MM-dd HH:mm') : '-'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime fontSize="inherit" sx={{ mr: 1 }} />
                                    最後更新: {task.updatedAt ? format(parseISO(task.updatedAt), 'yyyy-MM-dd HH:mm') : '-'}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        disabled={loading}
                        sx={{ mr: 'auto' }}
                        startIcon={<Delete />}
                    >
                        刪除 (Delete)
                    </Button>
                    <Button onClick={onClose} disabled={loading} color="inherit">
                        取消 (Cancel)
                    </Button>
                    <Button onClick={handleSave} variant="contained" disabled={loading}>
                        儲存 (Save)
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
