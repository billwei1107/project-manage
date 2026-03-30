import { Box, Typography, IconButton, Avatar, AvatarGroup, Stack } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

interface ProjectContextSidebarProps {
    projectNumber?: string;
    description?: string;
    reporter?: { name: string; avatar: string };
    assignees?: Array<{ avatar: string }>;
    priority?: string;
    deadLine?: string;
    createdDate?: string;
}

export default function ProjectContextSidebar({
    projectNumber = 'PN0001245',
    description = 'App for maintaining your medical record, making appointments with a doctor, storing prescriptions',
    reporter = { name: 'Evan Yates', avatar: 'https://placehold.co/24x24' },
    assignees = [{ avatar: 'https://placehold.co/24x24' }, { avatar: 'https://placehold.co/24x24' }, { avatar: 'https://placehold.co/24x24' }],
    priority = 'Medium',
    deadLine = 'Feb 23, 2020',
    createdDate = 'May 28, 2020'
}: ProjectContextSidebarProps) {
    return (
        <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', position: 'relative' }}>
            <IconButton sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                <EditOutlinedIcon sx={{ color: '#0A1629' }} />
            </IconButton>

            <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                Project Number
            </Typography>
            <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', mb: 3 }}>
                {projectNumber}
            </Typography>

            <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 1 }}>
                Description
            </Typography>
            <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', opacity: 0.7, lineHeight: 1.5, mb: 3 }}>
                {description}
            </Typography>

            <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                Reporter
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar src={reporter.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                    {reporter.name}
                </Typography>
            </Box>

            <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                Assignees
            </Typography>
            <Box sx={{ mb: 3 }}>
                <AvatarGroup max={4} sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12, border: '2px solid white' } }}>
                    {assignees.map((a, i) => (
                        <Avatar key={i} src={a.avatar} />
                    ))}
                    <Avatar sx={{ bgcolor: '#3F8CFF', color: 'white' }}>+2</Avatar>
                </AvatarGroup>
            </Box>

            <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                Priority
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#FFBD21', mr: 0.5 }}>↑</Typography>
                <Typography sx={{ color: '#FFBD21', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                    {priority}
                </Typography>
            </Box>

            <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                Dead Line
            </Typography>
            <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', mb: 4 }}>
                {deadLine}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <CalendarMonthOutlinedIcon sx={{ color: '#7D8592', fontSize: 20 }} />
                <Typography sx={{ color: '#7D8592', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                    Created {createdDate}
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                <IconButton sx={{ bgcolor: 'rgba(109, 93, 211, 0.10)', borderRadius: '14px', width: 44, height: 44 }}>
                    <AttachFileIcon sx={{ color: '#6D5DD3', transform: 'rotate(45deg)' }} />
                </IconButton>
                <IconButton sx={{ bgcolor: 'rgba(33, 192, 230, 0.10)', borderRadius: '14px', width: 44, height: 44 }}>
                    <LinkIcon sx={{ color: '#21C0E6' }} />
                </IconButton>
            </Stack>
        </Box>
    );
}

