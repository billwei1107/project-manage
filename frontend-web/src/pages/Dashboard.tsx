import {
    Box,
    Grid,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { projectApi } from '../api/projects';
import { eventApi } from '../api/events';
import { hrApi } from '../api/hr';
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

const COLORS = ['#3F8CFF', '#0AC947', '#FFBD21', '#E78175', '#F55B5D', '#8C3FFF'];

const MOCK_ACTIVITIES = [
    { user: '系統助理', action: '準備了', target: '最新的專案資料', time: '剛剛' },
    { user: 'Shawn Stone', action: '更新了狀態：', target: '心智圖', time: '剛剛' },
    { user: 'Randy Delgado', action: '上傳了檔案至：', target: '醫療 App 專案', time: '2 小時前' },
    { user: 'Emily Jones', action: '新增了留言於：', target: '外送服務架構', time: '3 小時前' },
    { user: 'Jasson Pan', action: '完成了任務：', target: 'UI 元件庫', time: '1 天前' },
];

export default function Dashboard() {
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [workload, setWorkload] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>(MOCK_ACTIVITIES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projRes, employeesRes, eventsRes] = await Promise.all([
                projectApi.getProjects(),
                hrApi.getEmployees().catch(() => []),
                eventApi.getEvents().catch(() => [])
            ]);
            
            if (projRes?.data) {
                const active = projRes.data.filter(p => p.status !== 'DONE');
                setRecentProjects(active.slice(0, 5));
                
                // 根據最新專案建立一些動態
                const recentActs = active.slice(0, 3).map(p => ({
                    user: '系統',
                    action: '正在追蹤專案：',
                    target: p.title,
                    time: '最近更新'
                }));
                if(recentActs.length > 0) setActivities(recentActs);
            }

            if (employeesRes && employeesRes.length > 0) {
                const mappedWorkload = employeesRes.slice(0, 8).map((emp, idx) => ({
                    name: emp.name,
                    role: emp.role === 'ROLE_ADMIN' ? '管理員' : '一般員工',
                    level: '活躍',
                    progress: Math.floor(Math.random() * 60) + 20, // Mock progress for now
                    color: COLORS[idx % COLORS.length]
                }));
                setWorkload(mappedWorkload);
            }

            if (eventsRes && eventsRes.length > 0) {
                const mappedEvents = eventsRes.slice(0, 5).map(ev => ({
                    time: ev.startTime || ev.date || '今日',
                    title: ev.title
                }));
                setEvents(mappedEvents);
            }

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
                            {workload.length > 0 ? workload.map((w, i) => (
                                <WorkloadCard key={i} {...w} />
                            )) : (
                                <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans', p: 2 }}>
                                    暫無成員資料
                                </Typography>
                            )}
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
                    <NearestEvents events={events.length > 0 ? events : [{ time: '今日', title: '目前沒有近期活動' }]} />
                    <ActivityStream activities={activities} />
                </Grid>
            </Grid>
        </Box>
    );
}
