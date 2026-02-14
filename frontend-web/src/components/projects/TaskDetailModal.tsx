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
    Avatar
} from '@mui/material';
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

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'TODO', label: '待辦 (To Do)' },
    { value: 'DOING', label: '進行中 (In Progress)' },
    { value: 'DONE', label: '已完成 (Done)' },
];

export default function TaskDetailModal({ open, onClose, task, team, onSave, onDelete }: TaskDetailModalProps) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setStatus(task.status);
            setAssigneeId(task.assignee?.id || '');
            setDescription(task.description || '');
            // Format for datetime-local: YYYY-MM-DDTHH:mm
            if (task.deadline) {
                try {
                    // task.deadline from backend might be ISO string or array depending on JSON serialization
                    // Assuming ISO string from current TaskResponse
                    // Date-fns parseISO handles ISO strings well
                    const d = parseISO(task.deadline);
                    // Format to what datetime-local expects
                    setDeadline(format(d, "yyyy-MM-dd'T'HH:mm"));
                } catch (e) {
                    console.error("Error parsing date", e);
                    setDeadline('');
                }
            } else {
                setDeadline('');
            }
        } else {
            setTitle('');
            setStatus('TODO');
            setAssigneeId('');
            setDescription('');
            setDeadline('');
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
                deadline: deadline ? new Date(deadline).toISOString() : undefined
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
        if (confirm('Are you sure you want to delete this task?')) {
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {task.projectId.substring(0, 4)} - Task Details
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <TextField
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Assignee</InputLabel>
                        <Select
                            value={assigneeId}
                            label="Assignee"
                            onChange={(e) => setAssigneeId(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>Unassigned</em>
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

                    <TextField
                        label="Deadline"
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Description / Remark"
                        multiline
                        rows={4}
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add details about this task..."
                    />

                    <Typography variant="caption" color="text.secondary">
                        Created: {task.createdAt ? format(parseISO(task.createdAt), 'yyyy-MM-dd HH:mm') : '-'}
                        <br />
                        Last Updated: {task.updatedAt ? format(parseISO(task.updatedAt), 'yyyy-MM-dd HH:mm') : '-'}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error" disabled={loading} sx={{ mr: 'auto' }}>
                    Delete
                </Button>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" disabled={loading}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
