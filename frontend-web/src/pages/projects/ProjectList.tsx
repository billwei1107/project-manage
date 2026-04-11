import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { projectApi } from '../../api/projects';
import AddProjectModal from '../../components/projects/AddProjectModal';

// 引入新建立的元件
import ProjectSidebar from '../../components/projects/ProjectSidebar';
import TaskBoard from '../../components/projects/TaskBoard';
import type { Task } from '../../types/project';
import { useProjectStore } from '../../stores/useProjectStore';
import { useEffect } from 'react';

export default function ProjectList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { projects, fetchProjects, loading } = useProjectStore();
    const [activeProjectId, setActiveProjectId] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (projects.length > 0 && !activeProjectId) {
            setActiveProjectId(projects[0].id);
        }
    }, [projects, activeProjectId]);

    useEffect(() => {
        if (activeProjectId) {
            projectApi.getTasks(activeProjectId)
                .then(setTasks)
                .catch(err => console.error('Failed to fetch tasks:', err));
        } else {
            setTasks([]);
        }
    }, [activeProjectId]);

    const handleSaveProject = async (projectData: any) => {
        try {
            await projectApi.createProject(projectData);
            setIsModalOpen(false);
            fetchProjects();
        } catch (err) {
            console.error('Failed to save project:', err);
            alert('儲存失敗 (Failed to save)');
        }
    };

    return (
        <Box sx={{ 
            p: { xs: 2, md: 3 }, 
            minHeight: 'calc(100vh - 64px)',
            display: 'flex', 
            flexDirection: 'column', 
            bgcolor: '#F4F9FD'
        }}>
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#0A1629', fontSize: { xs: 24, md: 36 }, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    專案管理
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                            fontSize: 16,
                            '&:hover': {
                                bgcolor: '#2e75e6'
                            }
                        }}
                    >
                        新增專案
                    </Button>
                </Box>
            </Box>

            {/* Main Content Area: Sidebar + Kanban Board */}
            <Box sx={{ display: 'flex', gap: 3, flex: 1, alignItems: 'flex-start' }}>
                {/* 側邊專案列表 */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 24 }}>
                    <ProjectSidebar 
                        projects={projects} 
                        activeProjectId={activeProjectId} 
                        onSelectProject={setActiveProjectId} 
                    />
                </Box>

                {/* 任務看板 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header line for Tasks */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                            任務列表
                        </Typography>
                        
                        {/* Fake Toolbar Icons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Box sx={{ width: 48, height: 48, bgcolor: 'white', borderRadius: '14px', boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ width: 20, height: 2, bgcolor: '#0A1629', mb: 1, position: 'relative' }}>
                                    <Box sx={{ width: 20, height: 2, bgcolor: '#0A1629', position: 'absolute', top: 6 }} />
                                    <Box sx={{ width: 20, height: 2, bgcolor: '#0A1629', position: 'absolute', top: 12 }} />
                                </Box>
                            </Box>
                            <Box sx={{ width: 48, height: 48, bgcolor: 'white', border: '1px solid #3F8CFF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '4px', border: '2px solid #3F8CFF' }} />
                            </Box>
                        </Box>
                    </Box>

                    {/* 看板的主體，傳入當前選中專案的 tasks 資料 */}
                    <TaskBoard tasks={tasks as any} />
                </Box>
            </Box>

            {/* 新增專案彈窗 */}
            <AddProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveProject}
            />
        </Box>
    );
}
