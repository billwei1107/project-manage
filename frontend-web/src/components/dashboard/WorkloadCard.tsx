import { Box, Typography, Avatar, CircularProgress, alpha } from '@mui/material';

interface WorkloadCardProps {
    name: string;
    role: string;
    level: string; // e.g., 'Junior', 'Middle', 'Senior'
    avatarUrl?: string;
    progress: number;
    color: string;
}

export default function WorkloadCard({ name, role, level, avatarUrl, progress, color }: WorkloadCardProps) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            minWidth: 160,
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
            gap: 1.5,
            border: `1px solid ${alpha('#7D8592', 0.1)}`
        }}>
            {/* Avatar with Circular Progress Ring */}
            <Box sx={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    thickness={4}
                    sx={{ color: alpha(color, 0.1), position: 'absolute' }}
                />
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={80}
                    thickness={4}
                    sx={{ color: color, position: 'absolute', strokeLinecap: 'round' }}
                />
                <Avatar src={avatarUrl} sx={{ width: 62, height: 62 }}>
                    {name.charAt(0)}
                </Avatar>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography sx={{ fontWeight: 800, color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {name}
                </Typography>
                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                    {role}
                </Typography>
            </Box>

            {/* Level Tag (e.g., Junior, Middle, Senior) */}
            <Box sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                bgcolor: alpha(color, 0.1),
                color: color,
                fontSize: 12,
                fontWeight: 800,
                fontFamily: 'Nunito Sans'
            }}>
                {level}
            </Box>
        </Box>
    );
}
