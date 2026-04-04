import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { projectApi } from '../../api/projects';
import AddProjectModal from '../../components/projects/AddProjectModal';

// 引入新建立的元件與假資料
import ProjectSidebar from '../../components/projects/ProjectSidebar';
import TaskBoard from '../../components/projects/TaskBoard';
import { dummyProjects, dummyTasks } from './dummyData';

export default function ProjectList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 使用中文假資料以便預覽 UI
    const [activeProjectId, setActiveProjectId] = useState<string>(dummyProjects[0].id);

    const handleSaveProject = async (projectData: any) => {
        try {
            await projectApi.createProject(projectData);
            setIsModalOpen(false);
            // 此處後續可以串接 real data state
        } catch (err) {
            console.error('Failed to save project:', err);
            alert('儲存失敗 (Failed to save)');
        }
    };

    return (
        <Box sx={{ 
            p: { xs: 2, md: 3 }, 
            height: 'calc(100vh - 64px)', // 扣掉頂部 Navbar 的大約高度，使內容填滿並防止全頁滾動
            display: 'flex', 
            flexDirection: 'column', 
            bgcolor: '#F4F9FD', 
            overflow: 'hidden' 
        }}>
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexShrink: 0 }}>
                <Typography sx={{ color: '#0A1629', fontSize: { xs: 24, md: 36 }, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    專案 (Projects)
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
                        新增專案 (Add Project)
                    </Button>
                </Box>
            </Box>

            {/* Main Content Area: Sidebar + Kanban Board */}
            <Box sx={{ display: 'flex', gap: 3, flex: 1, overflow: 'hidden' }}>
                {/* 側邊專案列表 */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }}>
                    <ProjectSidebar 
                        projects={dummyProjects} 
                        activeProjectId={activeProjectId} 
                        onSelectProject={setActiveProjectId} 
                    />
                </Box>

                {/* 任務看板 */}
                <Box sx={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {/* Header line for Tasks */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                            任務 (Tasks)
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

                    {/* 看板的主體，傳入當前選中專案的假 tasks 資料 */}
                    <TaskBoard tasks={dummyTasks} />
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
