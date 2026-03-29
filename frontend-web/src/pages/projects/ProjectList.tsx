import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Stack,
    IconButton
} from '@mui/material';
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
import TaskRowCard, { TaskItem } from '../../components/projects/TaskRowCard';

const MOCK_TASKS: TaskItem[] = [
    { id: '1', name: 'Research', estimate: '2d 4h', spentTime: '1d 2h', priority: 'medium', status: 'done' },
    { id: '2', name: 'Mind Map', estimate: '1d 2h', spentTime: '4h 25m', priority: 'medium', status: 'in_progress' },
    { id: '3', name: 'UX sketches', estimate: '4d', spentTime: '2d 2h 20m', priority: 'low', status: 'in_progress' },
    { id: '4', name: 'UI Login + Registration', estimate: '1d 2h', spentTime: '4h', priority: 'medium', status: 'in_review' },
    { id: '5', name: 'UI for other screens', estimate: '4d', spentTime: '2d 2h 20m', priority: 'low', status: 'in_progress' },
];

const MOCK_BACKLOG: TaskItem[] = [
    { id: '6', name: 'Animation for buttons', estimate: '6h', spentTime: '0h', priority: 'medium', status: 'todo' },
    { id: '7', name: 'Preloader', estimate: '2d', spentTime: '0h', priority: 'low', status: 'todo' },
];

export default function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: '0 auto' }}>
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
                <Box sx={{ flexGrow: 1 }}>
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

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            任務列表
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #3F8CFF', color: '#3F8CFF' }}>
                                <ViewListIcon />
                            </IconButton>
                            <IconButton sx={{ bgcolor: 'white', borderRadius: 2 }}>
                                <ViewColumnIcon sx={{ color: '#7D8592' }} />
                            </IconButton>
                            <IconButton sx={{ bgcolor: 'white', borderRadius: 2 }}>
                                <FilterAltIcon sx={{ color: '#7D8592' }} />
                            </IconButton>
                        </Box>
                    </Box>

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
