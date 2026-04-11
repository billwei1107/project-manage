import {
    Box,
    Grid,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { projectApi } from '../api/projects';
import type { Project } from '../types/project';
import AddIcon from '@mui/icons-material/Add';
import WorkloadCard from '../components/dashboard/WorkloadCard';
import ProjectRowCard from '../components/dashboard/ProjectRowCard';
import NearestEvents from '../components/dashboard/NearestEvents';
import ActivityStream from '../components/dashboard/ActivityStream';

/**
 * @file Dashboard.tsx
 * @description Modern CRM Dashboard - Refactored for Figma Match
 * @description_en Dashboard with workload, active projects, and stream
 * @description_zh 現代化 CRM 儀表板，符合 Figma 視覺設計
 */

const MOCK_WORKLOAD = [
    { name: 'Shawn Stone', role: 'UI/UX 設計師', level: '中階', progress: 45, color: '#3F8CFF' },
    { name: 'Randy Delgado', role: 'UX 設計師', level: '初階', progress: 60, color: '#0AC947' },
    { name: 'Emily Jones', role: '前端工程師', level: '資深', progress: 85, color: '#FFBD21' },
    { name: 'Jasson Pan', role: '專案經理', level: '中階', progress: 30, color: '#E78175' },
];

const MOCK_EVENTS = [
    { time: '10:30 AM', title: '新部門簡報會議' },
    { time: '11:00 AM', title: "Anna 的生日派對" },
    { time: '02:00 PM', title: "Ray 的歡送會" },
];

const MOCK_ACTIVITIES = [
    { user: 'Shawn Stone', action: '更新了狀態：', target: '心智圖', time: '剛剛' },
    { user: 'Randy Delgado', action: '上傳了檔案至：', target: '醫療 App 專案', time: '2 小時前' },
    { user: 'Emily Jones', action: '新增了留言於：', target: '外送服務架構', time: '3 小時前' },
    { user: 'Jasson Pan', action: '完成了任務：', target: 'UI 元件庫', time: '1 天前' },
];

export default function Dashboard() {
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await projectApi.getProjects();
            const projects = response.data;
            const active = projects.filter(p => p.status !== 'DONE');
            setRecentProjects(active.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Box>
                    <Typography sx={{ color: '#0A1629', fontSize: { xs: 24, md: 32 }, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                        歡迎回來！
                    </Typography>
                    <Typography sx={{ color: '#7D8592', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans', mt: 0.5 }}>
                        儀表板
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        bgcolor: '#3F8CFF',
                        color: '#fff',
                        borderRadius: '14px',
                        px: { xs: 2, md: 3 },
                        py: 1.5,
                        boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                        fontWeight: 800,
                        fontFamily: 'Nunito Sans',
                        textTransform: 'none',
                        fontSize: 16
                    }}
                >
                    新增專案
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    {/* Workload Section */}
                    <Box sx={{ mb: 5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ color: '#0A1629', fontSize: 24, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                團隊工作量
                            </Typography>
                            <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', cursor: 'pointer' }}>
                                查看全部
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            overflowX: 'auto',
                            pb: 2,
                            '&::-webkit-scrollbar': { display: 'none' }
                        }}>
                            {MOCK_WORKLOAD.map((w, i) => (
                                <WorkloadCard key={i} {...w} />
                            ))}
                        </Box>
                    </Box>

                    {/* Projects Section */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ color: '#0A1629', fontSize: 24, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                專案列表
                            </Typography>
                        </Box>
                        <Box>
                            {recentProjects.length > 0 ? recentProjects.map((project, idx) => (
                                <ProjectRowCard
                                    key={project.id}
                                    pn={`PN0001${idx}${4}`}
                                    title={project.title}
                                    progressType={project.progress > 70 ? '高' : (project.progress > 30 ? '中' : '低')}
                                    progressColor={project.progress > 70 ? '#0AC947' : (project.progress > 30 ? '#FFBD21' : '#E78175')}
                                    allTasks={Math.floor(Math.random() * 50) + 10}
                                    activeTasks={Math.floor(Math.random() * 20) + 5}
                                    assignees={[
                                        { name: 'A' }, { name: 'B' }, { name: 'C' }
                                    ]}
                                />
                            )) : (
                                <Box sx={{
                                    p: 4,
                                    bgcolor: '#fff',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    border: '1px dashed #7D8592'
                                }}>
                                    <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                        目前沒有進行中的專案。
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <NearestEvents events={MOCK_EVENTS} />
                    <ActivityStream activities={MOCK_ACTIVITIES} />
                </Grid>
            </Grid>
        </Box>
    );
}
