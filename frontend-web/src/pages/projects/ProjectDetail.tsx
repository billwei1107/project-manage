import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import ProjectKanban from '../../components/projects/ProjectKanban';
import { statusLabels } from '../../utils/project';
import { getProject } from '../../api/projects';
import type { Project } from '../../types/project';

// Placeholder components
function ProjectOverview() {
    return <Typography sx={{ p: 3 }}>專案概覽 (Overview Content - Coming Soon)</Typography>;
}

function ProjectFiles() {
    return <Typography sx={{ p: 3 }}>文件庫 (Files - Coming Soon)</Typography>;
}

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [currentTab, setCurrentTab] = useState(0);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProject(id);
        }
    }, [id]);

    const fetchProject = async (projectId: string) => {
        try {
            setLoading(true);
            const data = await getProject(projectId);
            setProject(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch project:', err);
            setError('無法載入專案詳情 (Failed to load project)');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || 'Project not found'}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Breadcrumbs */}
            <Box sx={{ px: 3, pt: 2 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">
                        儀表板
                    </Link>
                    <Link underline="hover" color="inherit" href="/projects">
                        專案列表
                    </Link>
                    <Typography color="text.primary">{project.title}</Typography>
                </Breadcrumbs>
            </Box>

            {/* Header */}
            <Box sx={{ px: 3, py: 2 }}>
                <Typography variant="h4" fontWeight="700">
                    {project.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {project.client} • {statusLabels[project.status]}
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="概覽 (Overview)" />
                    <Tab label="看板 (Kanban)" />
                    <Tab label="文件 (Files)" />
                    <Tab label="財務 (Finance)" />
                </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}>
                {currentTab === 0 && <ProjectOverview />}
                {currentTab === 1 && <ProjectKanban projectId={project.id} />}
                {currentTab === 2 && <ProjectFiles />}
                {currentTab === 3 && <Typography sx={{ p: 3 }}>財務管理 (Finance - Coming Soon)</Typography>}
            </Box>
        </Box>
    );
}
