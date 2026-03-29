import { Box, Typography, alpha } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface EventItem {
    time: string;
    title: string;
}

export default function NearestEvents({ events }: { events: EventItem[] }) {
    return (
        <Box sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '24px',
            p: 3,
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
            mb: 3
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#0A1629', fontSize: 20, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                    Nearest Events
                </Typography>
                <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', cursor: 'pointer' }}>
                    View All
                </Typography>
            </Box>

            {events.map((ev, i) => (
                <Box key={i} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    mb: 2,
                    borderRadius: '16px',
                    border: `1px solid ${alpha('#7D8592', 0.15)}`
                }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: '12px',
                        bgcolor: '#F4F9FD', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <AccessTimeIcon sx={{ color: '#3F8CFF' }} />
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                            {ev.time}
                        </Typography>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 800, fontFamily: 'Nunito Sans', lineHeight: 1.2 }}>
                            {ev.title}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
