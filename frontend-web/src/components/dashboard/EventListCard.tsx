import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface EventListCardProps {
    title: string;
    timeLabel: string;
    duration: string;
    color: string;
    trend: 'up' | 'down';
}

export default function EventListCard({ title, timeLabel, duration, color, trend }: EventListCardProps) {
    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: '#FFFFFF',
            borderRadius: '24px',
            p: 3,
            pl: 4,
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
            minHeight: 129
        }}>
            {/* 左側彩色指示線 */}
            <Box sx={{
                position: 'absolute',
                left: 24,
                top: 24,
                bottom: 24,
                width: 4,
                bgcolor: color,
                borderRadius: 2
            }} />

            {/* 上層：圖示 + 標題 + 趨勢箭頭 */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start' }}>
                    {/* 行事曆/活動小圖示 */}
                    <Box sx={{
                        width: 24, height: 24, mr: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.2
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 2V6" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 2V6" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 10H21" stroke="#3F8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Box>
                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans', lineHeight: 1.5 }}>
                        {title}
                    </Typography>
                </Box>
                {trend === 'up' ? (
                    <ArrowUpwardIcon sx={{ color: '#FFBD21', fontSize: 20 }} />
                ) : (
                    <ArrowDownwardIcon sx={{ color: '#0AC947', fontSize: 20 }} />
                )}
            </Box>

            {/* 下層：時間 + 經過時長 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ml: 5 }}>
                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans' }}>
                    {timeLabel}
                </Typography>

                <Box sx={{
                    bgcolor: '#F4F9FD',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#7D8592' }} />
                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        {duration}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
