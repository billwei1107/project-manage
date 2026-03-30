import React, { useState } from 'react';
import {
    Drawer, Box, Typography, IconButton, Divider, TextField, InputAdornment,
    Checkbox, FormControlLabel, Avatar, Button, Stack, Chip, Select, MenuItem,
    FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
    open: boolean;
    onClose: () => void;
}

const TASK_GROUPS = ['Design', 'Development', 'Testing', 'Marketing', 'Project Management'];
const REPORTERS = [
    { name: 'Oscar Holloway', avatar: 'https://placehold.co/24x24' },
    { name: 'Leonard Rodriquez', avatar: 'https://placehold.co/24x24' },
    { name: 'Owen Chambers', avatar: 'https://placehold.co/24x24' },
    { name: 'Gabriel Flowers', avatar: 'https://placehold.co/24x24' },
    { name: 'Violet Robbins', avatar: 'https://placehold.co/24x24' },
];
const SELECTED_ASSIGNEES_MOCK = [
    { name: 'Violet Robbins', avatar: 'https://placehold.co/24x24' },
    { name: 'Ronald Robbins', avatar: 'https://placehold.co/24x24' },
    { name: 'Birdie Garner', avatar: 'https://placehold.co/24x24' },
    { name: 'Marvin Cooper', avatar: 'https://placehold.co/24x24' },
];

export default function TaskFilterDrawer({ open, onClose }: Props) {
    const [selectedGroups, setSelectedGroups] = useState<string[]>(['Design']);
    const [selectedReporters, setSelectedReporters] = useState<string[]>(['Oscar Holloway']);
    const [priority, setPriority] = useState('Medium');

    const handleGroupToggle = (group: string) => {
        setSelectedGroups(prev =>
            prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
        );
    };

    const handleReporterToggle = (reporterName: string) => {
        setSelectedReporters(prev =>
            prev.includes(reporterName) ? prev.filter(r => r !== reporterName) : [...prev, reporterName]
        );
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 413 },
                    borderTopLeftRadius: { xs: 0, sm: 24 },
                    borderBottomLeftRadius: { xs: 0, sm: 24 },
                    boxShadow: '0px 6px 58px rgba(121, 144, 173, 0.20)',
                    bgcolor: 'white'
                }
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, py: 3, borderBottom: '1px solid #E4E6E8' }}>
                <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    Filters
                </Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}>
                    <CloseIcon sx={{ color: '#0A1629' }} />
                </IconButton>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ p: 4, overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Period */}
                <Box>
                    <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                        Period
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Select Period"
                        variant="outlined"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <CalendarMonthIcon sx={{ color: '#7D8592' }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '14px', color: '#7D8592', bgcolor: 'white', '& fieldset': { borderColor: '#D8E0F0' } }
                            }
                        }}
                    />
                </Box>

                {/* Task Group */}
                <Box>
                    <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 2 }}>
                        Task Group
                    </Typography>
                    <Stack spacing={1}>
                        {TASK_GROUPS.map((group) => (
                            <FormControlLabel
                                key={group}
                                control={
                                    <Checkbox
                                        checked={selectedGroups.includes(group)}
                                        onChange={() => handleGroupToggle(group)}
                                        sx={{
                                            color: '#C9CCD1',
                                            '&.Mui-checked': { color: '#3F8CFF' },
                                            '& .MuiSvgIcon-root': { fontSize: 24 }
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                                        {group}
                                    </Typography>
                                }
                            />
                        ))}
                    </Stack>
                </Box>

                {/* Reporter */}
                <Box>
                    <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 2 }}>
                        Reporter
                    </Typography>
                    <Stack spacing={1}>
                        {REPORTERS.map((rep) => (
                            <Box key={rep.name} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                    checked={selectedReporters.includes(rep.name)}
                                    onChange={() => handleReporterToggle(rep.name)}
                                    sx={{
                                        color: '#C9CCD1',
                                        '&.Mui-checked': { color: '#3F8CFF' },
                                        p: 1, ml: -1
                                    }}
                                />
                                <Avatar src={rep.avatar} alt={rep.name} sx={{ width: 24, height: 24, mr: 1.5 }} />
                                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                                    {rep.name}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                    <Typography
                        sx={{ color: '#3F8CFF', fontSize: 16, fontWeight: 600, fontFamily: 'Nunito Sans', mt: 2, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        View more <KeyboardArrowDownIcon sx={{ ml: 0.5, fontSize: 20 }} />
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: '#E4E6E8', mx: -4 }} />

                {/* Assignees */}
                <Box>
                    <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                        Assignees
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Search"
                        variant="outlined"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#7D8592' }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '14px', mb: 2, color: '#0A1629', '& fieldset': { borderColor: '#D8E0F0' } }
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {SELECTED_ASSIGNEES_MOCK.map((assignee) => (
                            <Chip
                                key={assignee.name}
                                avatar={<Avatar src={assignee.avatar} alt={assignee.name} />}
                                label={<Typography sx={{ fontFamily: 'Nunito Sans', fontSize: 14 }}>{assignee.name}</Typography>}
                                onDelete={() => { }}
                                deleteIcon={<CloseIcon sx={{ color: '#7D8592', fontSize: 16 }} />}
                                sx={{
                                    bgcolor: '#F4F9FD',
                                    borderRadius: '16px',
                                    height: 32,
                                    '& .MuiChip-label': { px: 1 },
                                    '& .MuiChip-avatar': { width: 24, height: 24, ml: 0.5 }
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#E4E6E8', mx: -4 }} />

                {/* Estimate */}
                <Box>
                    <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                        Estimate
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Select duration"
                        variant="outlined"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccessTimeIcon sx={{ color: '#7D8592' }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '14px', color: '#7D8592', '& fieldset': { borderColor: '#D8E0F0' } }
                            }
                        }}
                    />
                </Box>

                {/* Priority */}
                <Box>
                    <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                        Priority
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            displayEmpty
                            sx={{ borderRadius: '14px', color: '#0A1629', '& fieldset': { borderColor: '#D8E0F0' } }}
                        >
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

            </Box>

            {/* Footer */}
            <Box sx={{
                p: 3,
                borderTop: '1px solid #E4E6E8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: '#3F8CFF', fontSize: 24 }} />
                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                        10 matches found
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#3F8CFF',
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        fontSize: 16,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)'
                    }}
                >
                    Save Filters (3)
                </Button>
            </Box>
        </Drawer>
    );
}
