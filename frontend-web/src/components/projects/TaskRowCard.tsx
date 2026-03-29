import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    done: { label: '已完成', color: '#00D097', bgcolor: '#E0F9F2' },
    in_progress: { label: '進行中', color: '#3F8CFF', bgcolor: 'rgba(63, 140, 255, 0.12)' },
    in_review: { label: '審核中', color: '#C418E6', bgcolor: 'rgba(196, 24, 230, 0.11)' },
    todo: { label: '待處理', color: '#7D8592', bgcolor: 'rgba(125, 133, 146, 0.14)' },
};

const priorityConfigs = {
    low: { label: '低', color: '#0AC947', icon: ArrowDownwardIcon },
    medium: { label: '中', color: '#FFBD21', icon: ArrowUpwardIcon },
    high: { label: '高', color: '#F76659', icon: ArrowUpwardIcon },
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
                    任務名稱
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                    {task.name}
                </Typography>
            </Box>

            {/* Estimate */}
            <Box sx={{ flex: 1, minWidth: 80, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    預估時間
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {task.estimate}
                </Typography>
            </Box>

            {/* Spent Time */}
            <Box sx={{ flex: 1, minWidth: 80, display: { xs: 'none', md: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    花費時間
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {task.spentTime}
                </Typography>
            </Box>

            {/* Assignee */}
            <Box sx={{ flex: 1, minWidth: 60, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    負責人
                </Typography>
                <Avatar src={task.assigneeAvatar} sx={{ width: 28, height: 28 }} />
            </Box>

            {/* Priority */}
            <Box sx={{ flex: 1, minWidth: 80 }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    優先級
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
                    {task.status === 'done' ? (
                        <CheckCircleIcon sx={{ color: '#3F8CFF' }} />
                    ) : (
                        <RadioButtonUncheckedIcon sx={{ color: 'rgba(125, 133, 146, 0.4)' }} />
                    )}
                </IconButton>
            </Box>
        </Box>
    );
}
