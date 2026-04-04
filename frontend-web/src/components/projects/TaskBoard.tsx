import { Box, Typography } from '@mui/material';
import type { Task } from '../../pages/projects/dummyData';
import TaskCard from './TaskCard';

interface TaskBoardProps {
    tasks: Task[];
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
    const todoTasks = tasks.filter((t) => t.status === 'TODO');
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
    const inReviewTasks = tasks.filter((t) => t.status === 'IN_REVIEW');
    const doneTasks = tasks.filter((t) => t.status === 'DONE');
    const backlogTasks = tasks.filter((t) => t.status === 'BACKLOG');

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

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
            {/* Header / Tools area could go here */}
            
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
                {renderColumn('待辦事項 (To Do)', todoTasks)}
                {renderColumn('進行中 (In Progress)', inProgressTasks)}
                {renderColumn('審核中 (In Review)', inReviewTasks)}
                {renderColumn('已完成 (Done)', doneTasks)}
            </Box>

            {/* Backlog Section */}
            {backlogTasks.length > 0 && (
                <Box sx={{ mt: 2, bgcolor: '#E6EDF5', borderRadius: '14px', p: 3, position: 'relative' }}>
                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, textAlign: 'center', mb: 3 }}>
                        積壓任務 (Backlog)
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {backlogTasks.map(task => (
                            <Box key={task.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 245 } }}>
                                <TaskCard task={task} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
