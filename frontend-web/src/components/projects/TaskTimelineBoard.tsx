import { Box, Typography, Stack, Tooltip, tooltipClasses } from '@mui/material';
import type { TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { TaskItem } from '../../pages/projects/ProjectDetail';

/**
 * @file TaskTimelineBoard.tsx
 * @description 專案的第二週/月等 Timeline 甘特圖視圖 / Timeline Gantt chart view for projects
 */

interface Props {
    tasks: TaskItem[];
}

const TimelineTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: '#0A1629',
        maxWidth: 220,
        border: '1px solid #E6EBF5',
        boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
        borderRadius: '14px',
        padding: '12px 16px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#ffffff',
        "&::before": {
            border: '1px solid #E6EBF5',
        }
    },
}));

export default function TaskTimelineBoard({ tasks }: Props) {
    const DAYS_COUNT = 30; // Figma 顯示 20-30 天

    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: '24px',
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 600 }}>
                {/* Header Row */}
                <Box sx={{ display: 'flex', width: 'max-content', minWidth: '100%', borderBottom: '1px solid #E6EBF5' }}>
                    {/* Sticky Left Header */}
                    <Box sx={{
                        position: 'sticky', left: 0, zIndex: 2, bgcolor: 'white',
                        width: 216, borderRight: '1px solid #E6EBF5',
                        p: 2, pt: 3, flexShrink: 0
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                All Tasks
                            </Typography>
                            <KeyboardArrowDownIcon sx={{ color: '#0A1629' }} />
                        </Box>
                        <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', mt: 0.5 }}>
                            {tasks.length} issues
                        </Typography>
                    </Box>

                    {/* Scrollable Right Header */}
                    <Box sx={{ p: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 2 }}>
                            First month (September)
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            {Array.from({ length: DAYS_COUNT }).map((_, idx) => (
                                <Box key={idx} sx={{
                                    width: 28, height: 28,
                                    bgcolor: '#F4F9FD',
                                    borderRadius: '7px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Typography sx={{ color: '#7D8593', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                        {idx + 1}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* Tasks Rows */}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: 'max-content', minWidth: '100%' }}>
                    {tasks.map((task) => {
                        const sDay = task.startDay || 1;
                        const duration = task.duration || 1;

                        return (
                            <Box key={task.id} sx={{ display: 'flex', borderBottom: '1px solid #E6EBF5' }}>
                                {/* Sticky Left Task Name */}
                                <Box sx={{
                                    position: 'sticky', left: 0, zIndex: 1, bgcolor: 'white',
                                    width: 216, borderRight: '1px solid #E6EBF5', flexShrink: 0,
                                    height: 60, display: 'flex', alignItems: 'center', px: 3
                                }}>
                                    <Typography noWrap sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans' }}>
                                        {task.title}
                                    </Typography>
                                </Box>

                                {/* Task Timeline Blocks */}
                                <Box sx={{ p: 2, height: 60, display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={0.5}>
                                        {Array.from({ length: DAYS_COUNT }).map((_, idx) => {
                                            const day = idx + 1;
                                            const isActive = day >= sDay && day < sDay + duration;

                                            const tooltipContent = isActive && task.assignee ? (
                                                <Box sx={{ width: 156 }}>
                                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 1 }}>
                                                        Assignee
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <img
                                                            src={task.assignee.avatar}
                                                            alt={task.assignee.name}
                                                            style={{ width: 24, height: 24, borderRadius: '50%', outline: '2px solid white' }}
                                                        />
                                                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 400 }}>
                                                            {task.assignee.name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : null;

                                            const blockBox = (
                                                <Box sx={{
                                                    width: 28, height: 44,
                                                    bgcolor: isActive ? '#A7CAFF' : '#F4F9FD',
                                                    borderRadius: '7px',
                                                    flexShrink: 0,
                                                    cursor: isActive ? 'pointer' : 'default'
                                                }} />
                                            );

                                            return (
                                                <Box key={day}>
                                                    {isActive && tooltipContent ? (
                                                        <TimelineTooltip title={tooltipContent} placement="top" arrow>
                                                            {blockBox}
                                                        </TimelineTooltip>
                                                    ) : blockBox}
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            </Box>
                        );
                    })}

                    {/* Bottom Scroll Controls Track (Visual only, aligned with timeline) */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: '216px' }}>
                            <Box sx={{ width: 300, height: 8, bgcolor: '#D3DBEB', borderRadius: 4, position: 'relative', ml: 2 }}>
                                <Box sx={{ width: 100, height: 8, bgcolor: '#C9CCD1', borderRadius: 4, position: 'absolute', left: 20 }} />
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                                <ArrowBackIcon sx={{ color: '#C9CCD1', fontSize: 20 }} />
                                <ArrowForwardIcon sx={{ color: '#3F8CFF', fontSize: 20 }} />
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
