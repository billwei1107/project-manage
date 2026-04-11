import { Box, Typography, Avatar, alpha } from '@mui/material';

interface ActivityItem {
    user: string;
    action: string;
    target: string;
    time: string;
    avatarUrl?: string;
}

export default function ActivityStream({ activities }: { activities: ActivityItem[] }) {
    return (
        <Box sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '24px',
            p: 3,
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography sx={{ color: '#0A1629', fontSize: 20, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                    最新動態
                </Typography>
                <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', cursor: 'pointer' }}>
                    查看全部
                </Typography>
            </Box>

            <Box sx={{ position: 'relative' }}>
                {activities.map((act, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3.5, position: 'relative' }}>
                        {/* Timeline line */}
                        {i !== activities.length - 1 && (
                            <Box sx={{ position: 'absolute', left: 20, top: 40, bottom: -28, width: 2, bgcolor: alpha('#7D8592', 0.15) }} />
                        )}
                        <Avatar src={act.avatarUrl} sx={{ width: 42, height: 42, border: '2px solid #fff', zIndex: 1 }}>
                            {act.user.charAt(0)}
                        </Avatar>
                        <Box sx={{ mt: 0.5 }}>
                            <Typography sx={{ color: '#0A1629', fontSize: 15, fontWeight: 800, fontFamily: 'Nunito Sans', display: 'inline' }}>
                                {act.user}{' '}
                            </Typography>
                            <Typography sx={{ color: '#7D8592', fontSize: 15, fontWeight: 600, fontFamily: 'Nunito Sans', display: 'inline' }}>
                                {act.action}{' '}
                            </Typography>
                            <Typography sx={{ color: '#3F8CFF', fontSize: 15, fontWeight: 800, fontFamily: 'Nunito Sans', display: 'inline' }}>
                                {act.target}
                            </Typography>
                            <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mt: 0.5, display: 'block' }}>
                                {act.time}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
