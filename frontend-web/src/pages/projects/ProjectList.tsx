import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Avatar,
    AvatarGroup,
    LinearProgress,
    TextField,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    MoreVert as MoreVertIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';
import AddProjectModal from '../../components/projects/AddProjectModal';
import { statusColors, statusLabels } from '../../utils/project';
import { getProjects, createProject, deleteProject } from '../../api/projects';

export default function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch projects:', err);
            const msg = err.response?.data?.message || err.message || '無法載入專案列表 (Failed to load projects)';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedProjectId(projectId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProjectId(null);
    };

    const handleDeleteProject = async () => {
        if (selectedProjectId) {
            if (window.confirm('確定要刪除此專案嗎？ (Are you sure?)')) {
                try {
                    await deleteProject(selectedProjectId);
                    setProjects(projects.filter(p => p.id !== selectedProjectId));
                } catch (err) {
                    console.error('Failed to delete project:', err);
                    alert('刪除失敗 (Failed to delete)');
                }
            }
        }
        handleMenuClose();
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleAddProject = async (newProjectData: any) => {
        try {
            const createdProject = await createProject(newProjectData);
            setProjects([...projects, createdProject]);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to create project:', err);
            alert('建立專案失敗 (Failed to create project)');
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Custom Empty State Component
    const EmptyState = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 12,
                px: 3,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider',
            }}
        >
            <Avatar
                sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    mb: 3
                }}
            >
                <CalendarIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="700" color="text.primary" gutterBottom>
                即使沒有專案，也要美美的！
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 4 }}>
                目前還沒有任何專案。您可以點擊下方按鈕建立您的第一個專案，開始追蹤進度與團隊協作。
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={() => setIsModalOpen(true)}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: 4
                }}
            >
                立即建立專案
            </Button>
        </Box>
    );

    // Custom Error State Component
    const ErrorState = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 3,
                textAlign: 'center',
            }}
        >
            <Avatar
                sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'error.lighter',
                    color: 'error.main',
                    mb: 2
                }}
            >
                <FilterListIcon sx={{ fontSize: 32 }} /> {/* Using a generic icon as placeholder, ideally error icon */}
            </Avatar>
            <Typography variant="h6" fontWeight="700" color="error.main" gutterBottom>
                無法載入專案列表
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {error || '伺服器連線發生問題，請稍後再試。'}
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => { setError(null); fetchProjects(); }}
                sx={{ borderRadius: 2 }}
            >
                重新嘗試
            </Button>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <ErrorState />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="700" color="text.primary">
                        專案管理 (Projects)
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        管理您的進行中專案並追蹤進度。
                    </Typography>
                </Box>
                {projects.length > 0 && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="large"
                        onClick={() => setIsModalOpen(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        新增專案
                    </Button>
                )}
            </Box>

            {/* Filter Bar - Only show if there are projects */}
            {projects.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        placeholder="搜尋專案..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300, bgcolor: 'background.paper' }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        color="inherit"
                        sx={{ borderColor: 'divider' }}
                    >
                        篩選
                    </Button>
                </Box>
            )}

            {/* Content Area */}
            {projects.length === 0 ? (
                <EmptyState />
            ) : (
                <Grid container spacing={3}>
                    {filteredProjects.map((project) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                        cursor: 'pointer'
                                    },
                                }}
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip
                                            label={statusLabels[project.status]}
                                            color={statusColors[project.status]}
                                            size="small"
                                            sx={{ fontWeight: 600, borderRadius: 1 }}
                                        />
                                        <Box>
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, project.id)}>
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        {project.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {project.client}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" paragraph sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        height: 40
                                    }}>
                                        {project.description}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" fontWeight="600">進度</Typography>
                                            <Typography variant="caption" fontWeight="600">{project.progress}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={project.progress}
                                            sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover' }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.875rem' } }}>
                                            {project.team.map((member) => (
                                                <Avatar key={member.id} alt={member.name} src={member.avatar || undefined}>
                                                    {member.name.charAt(0)}
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>

                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                            <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                                            <Typography variant="caption">
                                                {new Date(project.endDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {/* Show message if filter returns no results but projects exist */}
                    {projects.length > 0 && filteredProjects.length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                            <Typography variant="body1" color="text.secondary">
                                找不到符合 "{searchTerm}" 的專案
                            </Typography>
                        </Box>
                    )}
                </Grid>
            )}

            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem onClick={handleMenuClose}>編輯</MenuItem>
                <MenuItem onClick={handleDeleteProject}>刪除</MenuItem>
            </Menu>

            <AddProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddProject}
            />
        </Box>
    );
}
