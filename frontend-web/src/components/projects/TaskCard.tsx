import { Box, Typography, Avatar } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { Task } from '../../types/project';

export default function TaskCard({ task }: { task: Task }) {
    return (
        <Box
            sx={{
                bgcolor: 'white',
                borderRadius: '24px',
                p: 2.5,
                boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                mb: 2, // 確保卡片列表之間有間距
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                }
            }}
        >
            {/* Task Code */}
            <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', fontWeight: 400 }}>
                {task.id.substring(0, 8)}
            </Typography>

            {/* Title */}
            <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 600, lineHeight: '21px', mb: 2 }}>
                {task.title}
            </Typography>

            {/* Bottom Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Duration Badge */}
                    <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '8px', px: 1, py: 0.5 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 12, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                            {task.deadline || '無期限'}
                        </Typography>
                    </Box>
                </Box>

                {/* Assignee Avatar */}
                {task.assignee?.avatar && (
                    <Avatar
                        src={task.assignee?.avatar}
                        sx={{ width: 24, height: 24, border: '2px solid white' }}
                    />
                )}
            </Box>
        </Box>
    );
}
