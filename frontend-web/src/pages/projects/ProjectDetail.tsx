import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import { NavigateNext as NavigateNextIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import ProjectKanban from '../../components/projects/ProjectKanban';
import { GitHubConfig } from '../../components/projects/GitHubConfig';
import { statusLabels } from '../../utils/project';
import { projectApi } from '../../api/projects';
import type { Project } from '../../api/projects'; // Updated import source

// Placeholder components
import {
    Paper,
    Grid,
    Stack,
    Divider,
    Button,
    Avatar,
} from '@mui/material';
import {
    AttachMoney,
    DateRange,
    AccessTime,
    Flag,
    Group,
    ArrowForward
} from '@mui/icons-material';

// --- Sub-components for Overview ---

const OverviewCard = ({ title, icon, children, color = 'primary.main' }: any) => (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', boxShadow: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: `${color}15` as any, // 15% opacity
                color: color,
                display: 'flex'
            }}>
                {icon}
            </Box>
            <Typography variant="h6" fontWeight="700">
                {title}
            </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {children}
    </Paper>
);

const StatisticItem = ({ label, value, subtext }: any) => (
    <Box>
        <Typography variant="caption" color="text.secondary" fontWeight="600">
            {label}
        </Typography>
        <Typography variant="h5" fontWeight="700" color="text.primary">
            {value}
        </Typography>
        {subtext && (
            <Typography variant="caption" color="text.secondary">
                {subtext}
            </Typography>
        )}
    </Box>
);

function ProjectOverview({ project, setCurrentTab }: { project: Project, setCurrentTab: (index: number) => void }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);
    };

    const daysRemaining = () => {
        if (!project.endDate) return 'N/A';
        const end = new Date(project.endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} 天` : '已過期';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* 1. Budget Card */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <OverviewCard title="財務概況 (Finance)" icon={<AttachMoney />} color="#10b981">
                        <Stack spacing={3}>
                            <StatisticItem
                                label="總預算 (Total Budget)"
                                value={formatCurrency(project.budget || 0)}
                                subtext="含稅 (Tax Included)"
                            />
                            <StatisticItem
                                label="預算消耗 (Burn Rate)"
                                value="0%"
                                subtext="目前尚無支出紀錄"
                            />
                            <Button variant="outlined" color="success" size="small" endIcon={<ArrowForward />}>
                                查看財務報表
                            </Button>
                        </Stack>
                    </OverviewCard>
                </Grid>

                {/* 2. Timeline Card */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <OverviewCard title="專案時程 (Timeline)" icon={<DateRange />} color="#3b82f6">
                        <Stack spacing={3}>
                            <Stack direction="row" justifyContent="space-between">
                                <StatisticItem
                                    label="開始日期 (Start)"
                                    value={project.startDate ? new Date(project.startDate).toLocaleDateString() : '未設定'}
                                />
                                <StatisticItem
                                    label="結束日期 (End)"
                                    value={project.endDate ? new Date(project.endDate).toLocaleDateString() : '未設定'}
                                />
                            </Stack>
                            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <AccessTime fontSize="small" color="info" />
                                    <Typography variant="body2" fontWeight="600">
                                        剩餘時間：{daysRemaining()}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" fontWeight="600">總體進度</Typography>
                                    <Typography variant="caption" fontWeight="600">{project.progress}%</Typography>
                                </Box>
                                <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4 }}>
                                    <Box sx={{ width: `${project.progress}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 4 }} />
                                </Box>
                            </Box>
                        </Stack>
                    </OverviewCard>
                </Grid>

                {/* 3. Team Card */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <OverviewCard title="專案成員 (Team)" icon={<Group />} color="#8b5cf6">
                        <Stack spacing={2}>
                            {project.team && project.team.length > 0 ? (
                                project.team.map((member: any) => (
                                    <Stack key={member.id} direction="row" alignItems="center" spacing={2}>
                                        <Avatar src={member.avatar} alt={member.name}>
                                            {member.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="600">
                                                {member.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {member.role || 'Member'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    尚未指派成員
                                </Typography>
                            )}
                            <Button variant="outlined" color="secondary" size="small" endIcon={<ArrowForward />}>
                                管理成員
                            </Button>
                        </Stack>
                    </OverviewCard>
                </Grid>

                {/* 4. GitHub Repo Card */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#24292f', color: 'white' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <GitHubIcon fontSize="large" />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight="700">
                                    GitHub Repository
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {project.githubRepo || '尚未連結代碼倉庫'}
                                </Typography>
                                {project.githubBranch && (
                                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                                        分支: {project.githubBranch}
                                    </Typography>
                                )}
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' } }}
                                onClick={() => setCurrentTab(2)} // Switch to GitHub Setting tab
                            >
                                {project.githubRepo ? '管理 Repo' : '連結 Repo'}
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* 5. Description */}
                <Grid size={{ xs: 12 }}>
                    <OverviewCard title="專案詳情 (Details)" icon={<Flag />} color="#f59e0b">
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {project.description || '無描述資訊'}
                        </Typography>
                    </OverviewCard>
                </Grid>
            </Grid>
        </Box>
    );
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
            const data = await projectApi.getProject(projectId);
            setProject(data.data as any);
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
                    <Link underline="hover" color="inherit" href="/admin/projects">
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
                    {project.client} • {(statusLabels as any)[project.status]}
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="概覽 (Overview)" />
                    <Tab label="看板 (Kanban)" />
                    <Tab label="GitHub 設定" />
                    <Tab label="文件 (Files)" />
                    <Tab label="財務 (Finance)" />
                </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}>
                {currentTab === 0 && <ProjectOverview project={project} setCurrentTab={setCurrentTab} />}
                {currentTab === 1 && <ProjectKanban projectId={project.id} />}
                {currentTab === 2 && <GitHubConfig project={project} onUpdate={(updated) => setProject(updated)} />}
                {currentTab === 3 && <ProjectFiles />}
                {currentTab === 4 && <Typography sx={{ p: 3 }}>財務管理 (Finance - Coming Soon)</Typography>}
            </Box>
        </Box>
    );
}
