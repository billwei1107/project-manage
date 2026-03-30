import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

/**
 * @file TaskRowCard.tsx
 * @description 水平任務列表卡片 / Horizontal Task Row Card
 */

export interface TaskItem {
    id: string;
    name: string;
    status: 'done' | 'in_progress' | 'in_review' | 'todo';
    estimate: string;
    spentTime: string;
    assigneeAvatar?: string;
    priority: 'low' | 'medium' | 'high';
}

const statusConfigs = {
    done: { label: 'Done', color: '#00D097', bgcolor: '#E0F9F2' },
    in_progress: { label: 'In Progress', color: '#3F8CFF', bgcolor: 'rgba(63, 140, 255, 0.12)' },
    in_review: { label: 'In Review', color: '#C418E6', bgcolor: 'rgba(196, 24, 230, 0.11)' },
    todo: { label: 'To Do', color: '#7D8592', bgcolor: 'rgba(125, 133, 146, 0.14)' },
};

const priorityConfigs = {
    low: { label: 'Low', color: '#0AC947', icon: ArrowDownwardIcon },
    medium: { label: 'Medium', color: '#FFBD21', icon: ArrowUpwardIcon },
    high: { label: 'High', color: '#F76659', icon: ArrowUpwardIcon },
};

export default function TaskRowCard({ task }: { task: TaskItem }) {
    const sConf = statusConfigs[task.status];
    const pConf = priorityConfigs[task.priority];
    const PriorityIcon = pConf.icon;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'white',
            borderRadius: '24px',
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
            p: { xs: 2, md: 3 },
            minHeight: 91,
            gap: 2
        }}>
            {/* Task Name */}
            <Box sx={{ flex: 2, minWidth: 150 }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    Task Name
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 400 }}>
                    {task.name}
                </Typography>
            </Box>

            {/* Estimate */}
            <Box sx={{ flex: 1, minWidth: 80, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    Estimate
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {task.estimate}
                </Typography>
            </Box>

            {/* Spent Time */}
            <Box sx={{ flex: 1, minWidth: 80, display: { xs: 'none', md: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    Spent Time
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {task.spentTime}
                </Typography>
            </Box>

            {/* Assignee */}
            <Box sx={{ flex: 1, minWidth: 60, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    Assignee
                </Typography>
                <Avatar src={task.assigneeAvatar} sx={{ width: 24, height: 24 }} />
            </Box>

            {/* Priority */}
            <Box sx={{ flex: 1, minWidth: 80 }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    Priority
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PriorityIcon sx={{ color: pConf.color, fontSize: 16 }} />
                    <Typography sx={{ color: pConf.color, fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        {pConf.label}
                    </Typography>
                </Box>
            </Box>

            {/* Status Badge */}
            <Box sx={{ flex: 1, minWidth: 100, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                    bgcolor: sConf.bgcolor,
                    color: sConf.color,
                    borderRadius: '8px',
                    px: 2,
                    py: 0.75,
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'Nunito Sans',
                    textAlign: 'center',
                    minWidth: 80
                }}>
                    {sConf.label}
                </Box>
            </Box>

            {/* Check Circle */}
            <Box sx={{ ml: 'auto' }}>
                <IconButton>
                    <RadioButtonUncheckedIcon sx={{ color: task.status === 'done' ? '#3F8CFF' : 'rgba(125, 133, 146, 0.4)' }} />
                </IconButton>
            </Box>
        </Box>
    );
}
