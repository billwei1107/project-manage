import React, { useState } from 'react';
import {
    Box, Typography, Button, IconButton, Grid, Avatar, AvatarGroup, Chip, Stack, CircularProgress, Divider, Menu, MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useNavigate } from 'react-router-dom';
import ApproveTaskModal from '../../components/projects/ApproveTaskModal';

export default function TaskDetails() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [status, setStatus] = useState('In Review');
    const [isApproveModalOpen, setApproveModalOpen] = useState(false);
    const openStatus = Boolean(anchorEl);

    const handleStatusClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleStatusClose = (newStatus?: string) => {
        setAnchorEl(null);
        if (typeof newStatus === 'string') {
            if (newStatus === 'Done' && status !== 'Done') {
                setApproveModalOpen(true);
            } else {
                setStatus(newStatus);
            }
        }
    };

    const handleConfirmApprove = () => {
        setStatus('Done');
        setApproveModalOpen(false);
    };

    const getStatusStyles = (statusStr: string) => {
        switch (statusStr) {
            case 'To Do': return { color: '#7D8592', bgcolor: 'rgba(125, 133, 146, 0.11)', dot: 'transparent' };
            case 'In Progress': return { color: '#3F8CFF', bgcolor: 'rgba(63, 140, 255, 0.11)', dot: '#3F8CFF' };
            case 'In Review': return { color: '#C418E6', bgcolor: 'rgba(196, 24, 230, 0.11)', dot: '#C418E6' };
            case 'Done': return { color: '#0AC947', bgcolor: 'rgba(10, 201, 71, 0.11)', dot: 'transparent' };
            default: return { color: '#7D8592', bgcolor: 'transparent', dot: 'transparent' };
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography
                        onClick={() => navigate('/admin/projects')}
                        sx={{
                            color: '#3F8CFF',
                            fontSize: 16,
                            fontFamily: 'Nunito Sans',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            mb: 1
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: 18, mr: 1 }} /> Back to Projects
                    </Typography>
                    <Typography sx={{ color: '#0A1629', fontSize: 36, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                        Medical App (iOS native)
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        bgcolor: '#3F8CFF',
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontFamily: 'Nunito Sans',
                        fontSize: 16,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)'
                    }}
                >
                    Add Task
                </Button>
            </Box>

            {/* Three Columns Layout */}
            <Grid container spacing={3}>

                {/* === LEFT COLUMN: Project Info === */}
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', position: 'relative' }}>

                        <IconButton sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                            <EditOutlinedIcon sx={{ color: '#0A1629' }} />
                        </IconButton>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                            Project Number
                        </Typography>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', mb: 3 }}>
                            PN0001245
                        </Typography>

                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 1 }}>
                            Description
                        </Typography>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', opacity: 0.7, lineHeight: 1.5, mb: 3 }}>
                            App for maintaining your medical record, making appointments with a doctor, storing prescriptions
                        </Typography>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Reporter
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar src="https://placehold.co/24x24" sx={{ width: 24, height: 24, mr: 1 }} />
                            <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                                Evan Yates
                            </Typography>
                        </Box>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Assignees
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <AvatarGroup max={4} sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12, border: '2px solid white' } }}>
                                <Avatar src="https://placehold.co/24x24" />
                                <Avatar src="https://placehold.co/24x24" />
                                <Avatar src="https://placehold.co/24x24" />
                                <Avatar sx={{ bgcolor: '#3F8CFF', color: 'white' }}>+2</Avatar>
                            </AvatarGroup>
                        </Box>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Priority
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ color: '#FFBD21', mr: 0.5 }}>↑</Typography>
                            <Typography sx={{ color: '#FFBD21', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                Medium
                            </Typography>
                        </Box>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Dead Line
                        </Typography>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', mb: 4 }}>
                            Feb 23, 2020
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                            <CalendarMonthOutlinedIcon sx={{ color: '#7D8592', fontSize: 20 }} />
                            <Typography sx={{ color: '#7D8592', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                Created May 28, 2020
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
                </Grid>

                {/* === MIDDLE COLUMN: Task Details === */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                            Task Details
                        </Typography>
                        <IconButton sx={{ bgcolor: 'white', borderRadius: '14px', width: 48, height: 48, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                            <EditOutlinedIcon sx={{ color: '#0A1629' }} />
                        </IconButton>
                    </Box>

                    <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 4, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                                    PN0001245
                                </Typography>
                                <Typography sx={{ color: '#0A1629', fontSize: 18, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                    UX Login + Registration
                                </Typography>
                            </Box>
                            <Box>
                                <Box
                                    onClick={handleStatusClick}
                                    sx={{
                                        bgcolor: getStatusStyles(status).bgcolor,
                                        borderRadius: '8px',
                                        px: 2,
                                        py: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {getStatusStyles(status).dot !== 'transparent' && (
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: getStatusStyles(status).dot, mr: 1 }} />
                                    )}
                                    <Typography sx={{ color: getStatusStyles(status).color, fontSize: 12, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                        {status}
                                    </Typography>
                                    <KeyboardArrowDownIcon sx={{ color: getStatusStyles(status).color, ml: 0.5, fontSize: 16 }} />
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openStatus}
                                    onClose={() => handleStatusClose()}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            borderRadius: '14px',
                                            boxShadow: '0px 6px 58px rgba(121, 144, 173, 0.20)',
                                            mt: 1,
                                            width: 140
                                        }
                                    }}
                                >
                                    {['To Do', 'In Progress', 'In Review', 'Done'].map((opt) => (
                                        <MenuItem
                                            key={opt}
                                            onClick={() => handleStatusClose(opt)}
                                            sx={{
                                                fontSize: 12,
                                                fontFamily: 'Nunito Sans',
                                                fontWeight: 600,
                                                color: status === opt ? '#0A1629' : '#7D8592',
                                                bgcolor: status === opt ? 'rgba(63, 140, 255, 0.12)' : 'transparent',
                                                borderRadius: '8px',
                                                mx: 1,
                                                my: 0.5,
                                                '&:hover': {
                                                    bgcolor: 'rgba(63, 140, 255, 0.12)',
                                                    color: '#0A1629'
                                                }
                                            }}
                                        >
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>

                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', opacity: 0.7, lineHeight: 1.5, mb: 3 }}>
                            Think over UX for Login and Registration, create a flow using wireframes. Upon completion, show the team and discuss. Attach the source to the task.
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                            <IconButton sx={{ bgcolor: 'rgba(109, 93, 211, 0.10)', borderRadius: '14px', width: 44, height: 44 }}>
                                <AttachFileIcon sx={{ color: '#6D5DD3', transform: 'rotate(45deg)' }} />
                            </IconButton>
                            <IconButton sx={{ bgcolor: 'rgba(33, 192, 230, 0.10)', borderRadius: '14px', width: 44, height: 44 }}>
                                <LinkIcon sx={{ color: '#21C0E6' }} />
                            </IconButton>
                        </Stack>

                        <Divider sx={{ borderColor: '#E4E6E8', mx: -4, mb: 4 }} />

                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 3 }}>
                            Task Attachments (3)
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                            {/* Attachment Card 1 */}
                            <Box sx={{ width: 156, flexShrink: 0, border: '1px solid #D8DDE5', borderRadius: '14px', overflow: 'hidden' }}>
                                <Box sx={{ height: 88, bgcolor: 'rgba(32, 85, 163, 0.16)', position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', opacity: 0.8, borderRadius: '10px', p: 0.5 }}>
                                        <AttachFileIcon sx={{ color: '#6D5DD3', fontSize: 18, transform: 'rotate(45deg)' }} />
                                    </Box>
                                    <img src="https://placehold.co/156x88" alt="doc" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 0.5 }} noWrap>
                                        site screens.png
                                    </Typography>
                                    <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans' }} noWrap>
                                        Sep 19, 2020 | 10:52 AM
                                    </Typography>
                                </Box>
                            </Box>
                            {/* Attachment Card 2 */}
                            <Box sx={{ width: 156, flexShrink: 0, border: '1px solid #D8DDE5', borderRadius: '14px', overflow: 'hidden' }}>
                                <Box sx={{ height: 88, bgcolor: 'rgba(32, 85, 163, 0.16)', position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', opacity: 0.8, borderRadius: '10px', p: 0.5 }}>
                                        <AttachFileIcon sx={{ color: '#6D5DD3', fontSize: 18, transform: 'rotate(45deg)' }} />
                                    </Box>
                                    <img src="https://placehold.co/156x88" alt="doc2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 0.5 }} noWrap>
                                        wireframes.png
                                    </Typography>
                                    <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans' }} noWrap>
                                        Sep 19, 2020 | 10:52 AM
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>

                        <Chip
                            icon={<LinkIcon sx={{ color: '#21C0E6' }} />}
                            label="Invision Prototype"
                            sx={{ bgcolor: 'rgba(33, 192, 230, 0.10)', color: '#21C0E6', borderRadius: '10px', fontFamily: 'Nunito Sans', fontWeight: 600, mb: 4 }}
                        />

                        <Divider sx={{ borderColor: '#E4E6E8', mx: -4, mb: 4 }} />

                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 3 }}>
                            Recent Activity
                        </Typography>

                        {/* Timeline Item 1 */}
                        <Box sx={{ display: 'flex', mb: 3 }}>
                            <Avatar src="https://placehold.co/40x40" sx={{ width: 40, height: 40, mr: 2 }} />
                            <Box flexGrow={1}>
                                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 0.5 }}>Oscar Holloway</Typography>
                                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>UI/UX Designer</Typography>
                                <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', p: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CloudUploadOutlinedIcon sx={{ color: '#3F8CFF', mr: 1.5 }} />
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                                        Updated the status of <b>Mind Map</b> task to <Typography component="span" sx={{ color: '#3F8CFF', fontWeight: 800 }}>In Progress</Typography>
                                    </Typography>
                                </Box>
                                <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', p: 2, display: 'inline-flex', alignItems: 'center' }}>
                                    <AttachFileIcon sx={{ color: '#6D5DD3', mr: 1.5, transform: 'rotate(45deg)' }} />
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                                        Attached files to <b>Mind Map</b> task
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Timeline Item 2 */}
                        <Box sx={{ display: 'flex', mb: 2 }}>
                            <Avatar src="https://placehold.co/40x40" sx={{ width: 40, height: 40, mr: 2 }} />
                            <Box flexGrow={1}>
                                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 0.5 }}>Emily Tyler</Typography>
                                <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>Copywriter</Typography>
                                <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', p: 2, display: 'flex', alignItems: 'center' }}>
                                    <CloudUploadOutlinedIcon sx={{ color: '#3F8CFF', mr: 1.5 }} />
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                                        Updated the status of <b>Mind Map</b> task to <Typography component="span" sx={{ color: '#3F8CFF', fontWeight: 800 }}>In Progress</Typography>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography sx={{ color: '#3F8CFF', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                View more <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />
                            </Typography>
                        </Box>

                    </Box>
                </Grid>

                {/* === RIGHT COLUMN: Task Info === */}
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Typography sx={{ color: '#0A1629', fontSize: 22, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 2, visibility: 'hidden' }}>
                        T
                    </Typography>

                    <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 3 }}>
                            Task Info
                        </Typography>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Reporter
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar src="https://placehold.co/24x24" sx={{ width: 24, height: 24, mr: 1 }} />
                            <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans' }}>
                                Evan Yates
                            </Typography>
                        </Box>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Assigned
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar src="https://placehold.co/24x24" sx={{ width: 24, height: 24, mr: 1 }} />
                            <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans' }}>
                                Blake Silva
                            </Typography>
                        </Box>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Priority
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Typography sx={{ color: '#FFBD21', mr: 0.5 }}>↑</Typography>
                            <Typography sx={{ color: '#FFBD21', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                Medium
                            </Typography>
                        </Box>

                        <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', p: 2, mb: 4 }}>
                            <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700, mb: 2 }}>
                                Time tracking
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                    <CircularProgress variant="determinate" value={100} sx={{ color: '#E6EDF5' }} size={38} thickness={2} />
                                    <CircularProgress variant="determinate" value={35} sx={{ color: '#3F8CFF', position: 'absolute', left: 0 }} size={38} thickness={2} />
                                </Box>
                                <Box>
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 400 }}>
                                        1d 3h 25m logged
                                    </Typography>
                                    <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans' }}>
                                        Original Estimate 3d 8h
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AccessTimeIcon />}
                                sx={{
                                    bgcolor: '#3F8CFF',
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontFamily: 'Nunito Sans',
                                    fontSize: 16,
                                    px: 2,
                                    py: 1,
                                    boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)'
                                }}
                            >
                                Log time
                            </Button>
                        </Box>

                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans', mb: 1 }}>
                            Dead Line
                        </Typography>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', mb: 4 }}>
                            Feb 23, 2020
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarMonthOutlinedIcon sx={{ color: '#7D8592', fontSize: 20 }} />
                            <Typography sx={{ color: '#7D8592', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                Created May 28, 2020
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

            </Grid>

            {/* Approve Task Confirmation Modal */}
            <ApproveTaskModal
                open={isApproveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                onApprove={handleConfirmApprove}
            />
        </Box>
    );
}
