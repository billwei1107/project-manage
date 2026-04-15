import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

/**
 * @file TaskRowCard.tsx
 * @description 水平任務列表卡片 / Horizontal Task Row Card
 */

import type { Task } from '../../types/project';

// Map missing frontend-only properties gracefully if they don't exist
// Task extends real backend task with optional UI properties if needed
export type TaskItem = Task & {
    spentTime?: string;
    priority?: 'low' | 'medium' | 'high';
    section?: 'active' | 'backlog';
    group?: string;
    startDay?: number;
    duration?: number;
};

const statusConfigs: Record<string, { label: string, color: string, bgcolor: string }> = {
    DONE: { label: '已完成', color: '#00D097', bgcolor: '#E0F9F2' },
    DOING: { label: '進行中', color: '#3F8CFF', bgcolor: 'rgba(63, 140, 255, 0.12)' },
    TODO: { label: '待辦', color: '#7D8592', bgcolor: 'rgba(125, 133, 146, 0.14)' },
};

const priorityConfigs = {
    low: { label: 'Low', color: '#0AC947', icon: ArrowDownwardIcon },
    medium: { label: 'Medium', color: '#FFBD21', icon: ArrowUpwardIcon },
    high: { label: 'High', color: '#F76659', icon: ArrowUpwardIcon },
};

export default function TaskRowCard({ task }: { task: TaskItem }) {
    const sConf = statusConfigs[task.status] || statusConfigs['TODO'];
    const pConf = task.priority ? priorityConfigs[task.priority] : null;
    const PriorityIcon = pConf?.icon;

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
                    任務名稱
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 400 }}>
                    {task.title}
                </Typography>
            </Box>

            {/* Estimate / Deadline */}
            <Box sx={{ flex: 1, minWidth: 80, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    預計期限
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {task.deadline || '無期限'}
                </Typography>
            </Box>

            {/* Spent Time */}
            <Box sx={{ flex: 1, minWidth: 80, display: { xs: 'none', md: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    花費時間
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {task.spentTime || '--'}
                </Typography>
            </Box>

            {/* Assignee */}
            <Box sx={{ flex: 1, minWidth: 60, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    負責人
                </Typography>
                <Avatar src={task.assignee?.avatar} sx={{ width: 24, height: 24 }} />
            </Box>

            {/* Priority */}
            <Box sx={{ flex: 1, minWidth: 80 }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    優先度
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {PriorityIcon && <PriorityIcon sx={{ color: pConf?.color, fontSize: 16 }} />}
                    <Typography sx={{ color: pConf?.color || '#91929E', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        {pConf?.label || '--'}
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
                    <RadioButtonUncheckedIcon sx={{ color: task.status === 'DONE' ? '#3F8CFF' : 'rgba(125, 133, 146, 0.4)' }} />
                </IconButton>
            </Box>
        </Box>
    );
}
