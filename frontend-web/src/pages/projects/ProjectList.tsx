import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions, Chip } from '@mui/material';
import { Add as AddIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../api/projects';
import { projectApi } from '../../api/projects';
import AddProjectModal from '../../components/projects/AddProjectModal';

export default function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getProjects();
            setProjects(response.data);
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
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography sx={{ color: '#0A1629', fontSize: 36, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    專案列表 (Projects)
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

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
                        <Card sx={{ borderRadius: '24px', boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans' }}>
                                        PN{project.id ? project.id.substring(0, 7) : '0001245'}
                                    </Typography>
                                    <Chip
                                        label={project.status === 'IN_PROGRESS' ? '進行中' : '已完成'}
                                        size="small"
                                        sx={{
                                            bgcolor: project.status === 'IN_PROGRESS' ? 'rgba(63, 140, 255, 0.1)' : 'rgba(10, 201, 71, 0.1)',
                                            color: project.status === 'IN_PROGRESS' ? '#3F8CFF' : '#0AC947',
                                            fontWeight: 700,
                                            fontFamily: 'Nunito Sans',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Box>
                                <Typography sx={{ color: '#0A1629', fontSize: 20, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                                    {project.title}
                                </Typography>
                                <Typography sx={{ color: '#7D8592', fontSize: 14, fontFamily: 'Nunito Sans', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {project.description || '暫無描述...'}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => navigate(`/admin/projects/${project.id}`)}
                                    sx={{
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontFamily: 'Nunito Sans',
                                        fontWeight: 700,
                                        borderColor: '#E6EDF5',
                                        color: '#3F8CFF',
                                        '&:hover': {
                                            borderColor: '#3F8CFF',
                                            bgcolor: 'rgba(63, 140, 255, 0.04)'
                                        }
                                    }}
                                >
                                    進入專案
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 新增專案彈窗 */}
            <AddProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveProject}
            />
        </Box>
    );
}
