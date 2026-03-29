import { Box, Typography, Avatar, Stack } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { TaskItem } from './TaskRowCard';

/**
 * @file TaskKanbanCard.tsx
 * @description 垂直看板任務卡片 / Vertical Task Kanban Card
 */

const priorityConfigs = {
    low: { color: '#0AC947', icon: ArrowDownwardIcon },
    medium: { color: '#FFBD21', icon: ArrowUpwardIcon },
    high: { color: '#F76659', icon: ArrowUpwardIcon },
};

export default function TaskKanbanCard({ task }: { task: TaskItem }) {
    const pConf = priorityConfigs[task.priority];
    const PriorityIcon = pConf.icon;

    return (
        <Stack sx={{
            bgcolor: 'white',
            borderRadius: '24px',
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
            p: 2.5,
            height: '100%',
            justifyContent: 'space-between',
            minHeight: 146
        }}>
            <Box>
                <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    TS00{task.id.padStart(5, '0')}
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 400, lineHeight: 1.5 }}>
                    {task.name}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        bgcolor: '#F4F9FD',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        color: '#7D8592',
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: 'Nunito Sans'
                    }}>
                        {task.estimate}
                    </Box>
                    <PriorityIcon sx={{ color: pConf.color, fontSize: 16 }} />
                </Box>
                <Avatar src={task.assigneeAvatar} sx={{ width: 24, height: 24 }} />
            </Box>
        </Stack>
    );
}
