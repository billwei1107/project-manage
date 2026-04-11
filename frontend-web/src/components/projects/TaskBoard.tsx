import { Box, Typography } from '@mui/material';
import type { Task } from '../../types/project';
import TaskCard from './TaskCard';
import emptyTasksIllustration from '../../assets/empty_tasks.png';

interface TaskBoardProps {
    tasks: Task[];
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
    const todoTasks = tasks.filter((t) => t.status === 'TODO');
    const inProgressTasks = tasks.filter((t) => t.status === 'DOING');
    const doneTasks = tasks.filter((t) => t.status === 'DONE');

    const renderColumn = (title: string, columnTasks: Task[], isBacklog = false) => (
        <Box sx={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
                sx={{
                    bgcolor: 'white',
                    borderRadius: '24px',
                    py: 1.5,
                    textAlign: 'center',
                    boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)'
                }}
            >
                <Box
                    sx={{
                        mx: 0.5,
                        bgcolor: '#F4F9FD',
                        borderRadius: '24px',
                        py: 1,
                    }}
                >
                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                        {title}
                    </Typography>
                </Box>
            </Box>

            {!isBacklog && (
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Box>
            )}
        </Box>
    );

    if (tasks.length === 0) {
        return (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', borderRadius: '24px', p: 4, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                <Box 
                    component="img" 
                    src={emptyTasksIllustration} 
                    alt="No Tasks" 
                    sx={{ width: '100%', maxWidth: 300, height: 'auto', mb: 3 }} 
                />
                <Typography sx={{ color: '#0A1629', fontSize: 18, fontFamily: 'Nunito Sans', fontWeight: 800, textAlign: 'center' }}>
                    這個專案還沒有任何任務
                </Typography>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mt: 1, textAlign: 'center' }}>
                    （請前往專案詳情頁面新增任務）
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header / Tools area could go here */}
            
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
                {renderColumn('待辦事項 (To Do)', todoTasks)}
                {renderColumn('進行中 (In Progress)', inProgressTasks)}
                {renderColumn('已完成 (Done)', doneTasks)}
            </Box>

        </Box>
    );
}
