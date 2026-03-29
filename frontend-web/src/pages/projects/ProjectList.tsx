import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Stack,
    IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';
import AddProjectModal from '../../components/projects/AddProjectModal';
import { projectApi } from '../../api/projects';
import TaskRowCard from '../../components/projects/TaskRowCard';
import type { TaskItem } from '../../components/projects/TaskRowCard';
import TaskKanbanCard from '../../components/projects/TaskKanbanCard';

const MOCK_TASKS: TaskItem[] = [
    { id: '1', name: 'Research', estimate: '2d 4h', spentTime: '1d 2h', priority: 'medium', status: 'done' },
    { id: '2', name: 'Mind Map', estimate: '1d 2h', spentTime: '4h 25m', priority: 'medium', status: 'in_progress' },
    { id: '3', name: 'UX sketches', estimate: '4d', spentTime: '2d 2h 20m', priority: 'low', status: 'in_progress' },
    { id: '4', name: 'UI Login + Registration', estimate: '1d 2h', spentTime: '4h', priority: 'medium', status: 'in_review' },
    { id: '5', name: 'UI for other screens', estimate: '4d', spentTime: '2d 2h 20m', priority: 'low', status: 'in_progress' },
    { id: '8', name: 'Research reports (presentation for client)', estimate: '6h', spentTime: '4h', priority: 'low', status: 'in_review' },
    { id: '10', name: 'UI Login + Registration (+ other screens)', estimate: '1d 6h', spentTime: '1d', priority: 'medium', status: 'in_progress' }
];

const MOCK_BACKLOG: TaskItem[] = [
    { id: '6', name: 'Animation for buttons', estimate: '8h', spentTime: '0h', priority: 'low', status: 'todo' },
    { id: '7', name: 'Preloader', estimate: '6h', spentTime: '0h', priority: 'low', status: 'todo' },
    { id: '9', name: 'Animation for Landing page', estimate: '8h', spentTime: '0h', priority: 'low', status: 'todo' }
];

const KANBAN_COLUMNS = [
    { id: 'todo', label: '待處理' },
    { id: 'in_progress', label: '進行中' },
    { id: 'in_review', label: '審核中' },
    { id: 'done', label: '已完成' }
];

export default function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'board'>('board'); // Defaulting to board as per new request

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getProjects();
            setProjects(response.data);
            if (response.data.length > 0) {
                setSelectedProjectId(response.data[0].id);
            }
        } catch (err: any) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProject = async (projectData: any) => {
        try {
            const response = await projectApi.createProject(projectData);
            setProjects([...projects, response.data]);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save project:', err);
            alert('儲存失敗 (Failed to save)');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    const renderKanbanBoard = () => {
        return (
            <Box>
                {/* Board Headers */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {KANBAN_COLUMNS.map(col => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={col.id}>
                            <Box sx={{ bgcolor: 'white', borderRadius: '24px', py: 0.5, px: 0.5, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                                <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '24px', py: 1.5 }}>
                                    <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                        {col.label}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Active Tasks Banner */}
                <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 3 }}>
                    <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        進行中的任務
                    </Typography>
                </Box>

                {/* Active Tasks Board Content */}
                <Grid container spacing={3} sx={{ mb: 4, alignItems: 'flex-start' }}>
                    {KANBAN_COLUMNS.map(col => {
                        const colTasks = MOCK_TASKS.filter(t => t.status === col.id);
                        return (
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`active-${col.id}`}>
                                <Stack spacing={2}>
                                    {colTasks.map(task => <TaskKanbanCard key={task.id} task={task} />)}
                                </Stack>
                            </Grid>
                        )
                    })}
                </Grid>

                {/* Backlog Banner */}
                <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 3 }}>
                    <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        待辦事項
                    </Typography>
                </Box>

                {/* Backlog Board Content */}
                <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                    {KANBAN_COLUMNS.map(col => {
                        const colTasks = MOCK_BACKLOG.filter(t => t.status === col.id);
                        return (
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`backlog-${col.id}`}>
                                <Stack spacing={2}>
                                    {colTasks.map(task => <TaskKanbanCard key={task.id} task={task} />)}
                                </Stack>
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        );
    };

    const renderListBoard = () => {
        return (
            <Box>
                {/* Active Tasks Group */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            進行中的任務
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        {MOCK_TASKS.map(t => <TaskRowCard key={t.id} task={t} />)}
                    </Stack>
                </Box>

                {/* Backlog Group */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            待辦事項
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        {MOCK_BACKLOG.map(t => <TaskRowCard key={t.id} task={t} />)}
                    </Stack>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

                {/* Left Sidebar: Current Projects */}
                <Box sx={{
                    width: { xs: '100%', md: 265 },
                    flexShrink: 0,
                    bgcolor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
                    overflow: 'hidden',
                    height: 'fit-content'
                }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #E4E6E8' }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            當前專案
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        {projects.map((p) => {
                            const isSelected = p.id === selectedProjectId;
                            return (
                                <Box
                                    key={p.id}
                                    onClick={() => setSelectedProjectId(p.id)}
                                    sx={{
                                        position: 'relative',
                                        p: 2,
                                        pl: 3,
                                        cursor: 'pointer',
                                        borderRadius: '14px',
                                        bgcolor: isSelected ? '#F4F9FD' : 'transparent',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F4F9FD' }
                                    }}
                                >
                                    {isSelected && (
                                        <Box sx={{ position: 'absolute', left: 4, top: '20%', bottom: '20%', width: 4, bgcolor: '#3F8CFF', borderRadius: 2 }} />
                                    )}
                                    <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                        PN{p.id.substring(0, 7) || '0001245'}
                                    </Typography>
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: isSelected ? 700 : 400, fontFamily: 'Nunito Sans', mb: isSelected ? 1 : 0 }}>
                                        {p.title}
                                    </Typography>
                                    {isSelected && (
                                        <Box
                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/projects/${p.id}`); }}
                                            sx={{ display: 'flex', alignItems: 'center', color: '#3F8CFF', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                                                查看詳情
                                            </Typography>
                                            <ArrowRightAltIcon sx={{ fontSize: 18, ml: 0.5 }} />
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Right Content: Tasks for selected project */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 36, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            專案列表
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsModalOpen(true)}
                            sx={{
                                bgcolor: '#3F8CFF',
                                color: '#fff',
                                borderRadius: '14px',
                                px: 3,
                                height: 48,
                                boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                                fontWeight: 700,
                                fontFamily: 'Nunito Sans',
                                textTransform: 'none',
                                fontSize: 16
                            }}
                        >
                            新增專案
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            任務列表
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                onClick={() => setViewMode('list')}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    border: viewMode === 'list' ? '1px solid #3F8CFF' : 'none',
                                    color: viewMode === 'list' ? '#3F8CFF' : '#7D8592'
                                }}
                            >
                                <ViewListIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setViewMode('board')}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    border: viewMode === 'board' ? '1px solid #3F8CFF' : 'none',
                                    color: viewMode === 'board' ? '#3F8CFF' : '#7D8592'
                                }}
                            >
                                <ViewColumnIcon />
                            </IconButton>
                            <IconButton sx={{ bgcolor: 'white', borderRadius: 2 }}>
                                <FilterAltIcon sx={{ color: '#7D8592' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    {viewMode === 'list' ? renderListBoard() : renderKanbanBoard()}
                </Box>
            </Box>

            <AddProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveProject}
                project={null}
            />
        </Box>
    );
}
