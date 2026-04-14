import { Box, Typography, Avatar, AvatarGroup, alpha, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ProjectRowCardProps {
    pn: string; // e.g. 'PN0001245'
    title: string;
    progressType: string;
    progressColor: string;
    allTasks: number;
    activeTasks: number;
    assignees: { name: string, avatar?: string }[];
}

export default function ProjectRowCard({
    pn,
    title,
    progressType,
    progressColor,
    allTasks,
    activeTasks,
    assignees
}: ProjectRowCardProps) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            mb: 1.5,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
            gap: 3,
            border: `1px solid ${alpha('#7D8592', 0.1)}`
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '25%' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha(progressColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: progressColor, borderRadius: '50%' }} />
                </Box>
                <Box>
                    <Typography sx={{ color: '#0A1629', fontWeight: 800, fontSize: 16, fontFamily: 'Nunito Sans' }}>
                        {title}
                    </Typography>
                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        {pn}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ width: '15%' }}>
                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 600, mb: 0.5, fontFamily: 'Nunito Sans' }}>
                    進度
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 6, height: 6, bgcolor: progressColor, borderRadius: '50%' }} />
                    <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        {progressType}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ width: '15%' }}>
                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 600, mb: 0.5, fontFamily: 'Nunito Sans' }}>
                    所有任務
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                    {allTasks}
                </Typography>
            </Box>

            <Box sx={{ width: '15%' }}>
                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 600, mb: 0.5, fontFamily: 'Nunito Sans' }}>
                    進行中任務
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                    {activeTasks}
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 600, mb: 0.5, fontFamily: 'Nunito Sans' }}>
                    負責人
                </Typography>
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12, border: '2px solid #fff' } }}>
                    {assignees.map((a, i) => (
                        <Avatar key={i} src={a.avatar} alt={a.name}>{a.name.charAt(0)}</Avatar>
                    ))}
                </AvatarGroup>
            </Box>

            <IconButton size="small">
                <MoreVertIcon sx={{ color: '#7D8592' }} />
            </IconButton>
        </Box>
    );
}
