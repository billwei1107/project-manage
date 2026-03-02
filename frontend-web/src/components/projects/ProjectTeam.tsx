import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Delete, Add, Person, Sync } from '@mui/icons-material';
import { projectApi } from '../../api/projects';
import api from '../../api/axios';
import type { Project } from '../../api/projects';

interface ProjectTeamProps {
    project: Project;
    onUpdate: (updatedProject: Project) => void;
}

export const ProjectTeam = ({ project, onUpdate }: ProjectTeamProps) => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/v1/users');
                setAllUsers(response.data.data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        fetchUsers();
    }, []);

    const handleAddMember = async () => {
        if (!selectedUserId) return;
        setLoading(true);
        setError(null);
        try {
            const currentTeamIds = project.team ? project.team.map((u: any) => u.id) : [];
            if (currentTeamIds.includes(selectedUserId)) {
                setError('該成員已在團隊中');
                setLoading(false);
                return;
            }
            const updatedTeamIds = [...currentTeamIds, selectedUserId];
            const updated = await projectApi.updateProject(project.id, {
                teamIds: updatedTeamIds
            });
            onUpdate(updated.data);
            setOpenAddModal(false);
            setSelectedUserId('');
        } catch (err: any) {
            setError(err.response?.data?.message || '新增成員失敗');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const currentTeamIds = project.team ? project.team.map((u: any) => u.id) : [];
            const updatedTeamIds = currentTeamIds.filter((id: string) => id !== userId);
            const updated = await projectApi.updateProject(project.id, {
                teamIds: updatedTeamIds
            });
            onUpdate(updated.data);
        } catch (err: any) {
            setError(err.response?.data?.message || '移除成員失敗');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncGithub = async () => {
        if (!project.githubRepo) {
            setError('請先於 GitHub 設定分頁綁定倉庫');
            return;
        }
        setSyncing(true);
        setError(null);
        try {
            await projectApi.syncGithubMembers(project.id);
            alert('GitHub 權限同步成功！');
        } catch (err: any) {
            setError(err.response?.data?.message || '同步 GitHub 失敗');
        } finally {
            setSyncing(false);
        }
    };

    // Filter out users already in the team
    const availableUsers = allUsers.filter(u => !(project.team || []).find((t: any) => t.id === u.id));

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="h6">專案成員管理</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={syncing ? <CircularProgress size={20} /> : <Sync />}
                            onClick={handleSyncGithub}
                            disabled={syncing || !project.githubRepo}
                        >
                            同步 GitHub (雙向)
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenAddModal(true)}
                            disabled={loading}
                        >
                            新增成員
                        </Button>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <List>
                    {project.team && project.team.length > 0 ? (
                        project.team.map((member: any) => (
                            <ListItem
                                key={member.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleRemoveMember(member.id)} disabled={loading}>
                                        <Delete />
                                    </IconButton>
                                }
                                sx={{ borderBottom: '1px solid #eee' }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={member.avatar || undefined}>
                                        {member.name.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={member.name}
                                    secondary={
                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                            <Typography variant="body2" component="span">{member.email}</Typography>
                                            {member.githubUsername ? (
                                                <Chip size="small" label={`GitHub: ${member.githubUsername}`} color="info" />
                                            ) : (
                                                <Chip size="small" label="未綁定 GitHub" color="warning" />
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            尚未有任何專案成員
                        </Typography>
                    )}
                </List>
            </Paper>

            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>新增專案成員</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>選擇用戶</InputLabel>
                        <Select
                            value={selectedUserId}
                            label="選擇用戶"
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            {availableUsers.map((u) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.name} ({u.email})
                                </MenuItem>
                            ))}
                            {availableUsers.length === 0 && (
                                <MenuItem disabled value="">
                                    沒有可供新增的用戶
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddModal(false)}>取消</Button>
                    <Button onClick={handleAddMember} variant="contained" disabled={!selectedUserId || loading}>
                        新增
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
