import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    AvatarGroup,
    IconButton,
    Button,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * @file EmployeeProfile.tsx
 * @description 員工個人檔案頁面 / Employee Profile
 */

interface MockProjectInfo {
    id: string;
    code: string;
    name: string;
    date: string;
    priority: 'Medium' | 'Low';
    allTasks: number;
    activeTasks: number;
    assigneeAvatars: string[];
    extraAssignees: number;
    logoColor: string;
}

const MOCK_PROJECTS: MockProjectInfo[] = [
    {
        id: '1', code: 'PN0001265', name: 'Medical App (iOS native)', date: 'Created Sep 12, 2020',
        priority: 'Medium', allTasks: 34, activeTasks: 13,
        assigneeAvatars: ['/avatars/user1.png', '/avatars/user2.png', '/avatars/user3.png'], extraAssignees: 2,
        logoColor: '#F5F8FE'
    },
    {
        id: '2', code: 'PN0001221', name: 'Food Delivery Service', date: 'Created Sep 10, 2020',
        priority: 'Medium', allTasks: 50, activeTasks: 24,
        assigneeAvatars: ['/avatars/user4.png', '/avatars/user5.png', '/avatars/user6.png'], extraAssignees: 0,
        logoColor: '#FDF7EB'
    },
    {
        id: '3', code: 'PN0001290', name: 'Internal Project', date: 'Created May 28, 2020',
        priority: 'Low', allTasks: 23, activeTasks: 20,
        assigneeAvatars: ['/avatars/user1.png', '/avatars/user3.png', '/avatars/user4.png'], extraAssignees: 5,
        logoColor: '#3F8CFF'
    }
];

export default function EmployeeProfile() {
    const [activeTab, setActiveTab] = useState<'Projects' | 'Team' | 'My vacations'>('Projects');

    const ProfileField = ({ label, value, icon, fullWidth = true }: { label: string, value: string, icon?: React.ReactNode, fullWidth?: boolean }) => (
        <Box sx={{ mb: 2.5, width: fullWidth ? '100%' : 'auto' }}>
            <Typography sx={{ color: '#A0AABF', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                {label}
            </Typography>
            <Box sx={{
                border: '1px solid #E6EDF5', borderRadius: '12px', bgcolor: 'white', p: '14px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                    {value}
                </Typography>
                {icon && (
                    <Box sx={{ color: '#A0AABF', display: 'flex' }}>
                        {icon}
                    </Box>
                )}
            </Box>
        </Box>
    );

    const PriorityIndicator = ({ priority }: { priority: 'Medium' | 'Low' }) => {
        const isMedium = priority === 'Medium';
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isMedium ? (
                    <ArrowUpwardIcon sx={{ fontSize: 16, color: '#FFB800' }} />
                ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 16, color: '#2ED47A' }} />
                )}
                <Typography sx={{ color: isMedium ? '#FFB800' : '#2ED47A', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    {priority}
                </Typography>
            </Box>
        );
    };

    return (
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, bgcolor: '#F4F9FD', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Page Title */}
            <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 4 }}>
                Employee's Profile
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, flex: 1 }}>

                {/* LEFT SIDEBAR (Profile details) */}
                <Box sx={{
                    flex: '0 0 320px', bgcolor: 'white', borderRadius: '24px', p: 3.5,
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)', height: 'fit-content'
                }}>
                    {/* Header: Avatar & Name */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box sx={{
                            width: 104, height: 104, borderRadius: '50%', border: '4px solid #F4F9FD', mb: 2,
                            position: 'relative'
                        }}>
                            <Box sx={{
                                width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #3F8CFF', p: '2px'
                            }}>
                                <Avatar src="/avatars/allen.png" sx={{ width: '100%', height: '100%' }} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 0.5 }}>
                            Allen Perkins
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#7D8592', fontFamily: 'Nunito Sans' }}>
                            UI/UX Designer
                        </Typography>
                    </Box>

                    {/* Main Info */}
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 2.5 }}>
                        Main info
                    </Typography>
                    <ProfileField label="Position" value="UI/UX Designer" />
                    <ProfileField label="Company" value="Cadabra" />
                    <ProfileField label="Location" value="NYC, New York, USA" icon={<LocationOnOutlinedIcon sx={{ fontSize: 20 }} />} />
                    <ProfileField label="Birthday Date" value="May 19, 1996" icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 20 }} />} />

                    {/* Contact Info */}
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 2.5, mt: 4 }}>
                        Contact Info
                    </Typography>
                    <ProfileField label="Email" value="evanyates@gmail.com" />
                    <ProfileField label="Mobile Number" value="+1 675 346 23-10" />
                    <ProfileField label="Skype" value="Evan 2256" />
                </Box>

                {/* RIGHT CONTENT AREA */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* Segmented Control & Top Toolbar */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>

                        <Box sx={{ display: 'flex', bgcolor: '#E6EDF5', borderRadius: '24px', p: '4px' }}>
                            {['Projects', 'Team', 'My vacations'].map((tab) => (
                                <Box
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    sx={{
                                        py: 1, px: { xs: 2, sm: 4 }, borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
                                        bgcolor: activeTab === tab ? '#3F8CFF' : 'transparent',
                                        color: activeTab === tab ? 'white' : '#7D8592',
                                        fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: activeTab === tab ? 700 : 600,
                                        boxShadow: activeTab === tab ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none'
                                    }}
                                >
                                    {tab}
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <IconButton sx={{ bgcolor: 'white', borderRadius: '14px', p: 1.5, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
                                <FilterAltOutlinedIcon sx={{ color: '#0A1629' }} />
                            </IconButton>
                            <Button
                                variant="contained"
                                endIcon={<KeyboardArrowDownIcon />}
                                sx={{
                                    bgcolor: 'white', color: '#0A1629', borderRadius: '14px', textTransform: 'none', px: 2, py: 1.5,
                                    fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
                                    '&:hover': { bgcolor: '#F8FAFC' }
                                }}
                            >
                                Current Projects
                            </Button>
                        </Box>
                    </Box>

                    {/* Project Cards List */}
                    {activeTab === 'Projects' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {MOCK_PROJECTS.map((proj) => (
                                <Box
                                    key={proj.id}
                                    sx={{
                                        bgcolor: 'white', borderRadius: '24px', p: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                                        gap: 4, alignItems: { xs: 'flex-start', md: 'center' }, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
                                        transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' }
                                    }}
                                >
                                    {/* Project Info (Left side) */}
                                    <Box sx={{ flex: 1, display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%' }}>
                                        <Box sx={{
                                            width: 56, height: 56, borderRadius: '16px', bgcolor: proj.logoColor,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            <FactCheckOutlinedIcon sx={{ color: proj.logoColor === '#3F8CFF' ? 'white' : '#A0AABF', fontSize: 28 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#A0AABF', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                                {proj.code}
                                            </Typography>
                                            <Typography sx={{ color: '#0A1629', fontSize: 18, fontWeight: 800, fontFamily: 'Nunito Sans', mb: 3 }}>
                                                {proj.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarTodayOutlinedIcon sx={{ color: '#A0AABF', fontSize: 16 }} />
                                                    <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                                                        {proj.date}
                                                    </Typography>
                                                </Box>
                                                <PriorityIndicator priority={proj.priority} />
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Vertical Divider / Space */}
                                    <Box sx={{ width: '1px', height: '100%', minHeight: '90px', bgcolor: '#E6EDF5', display: { xs: 'none', md: 'block' } }} />
                                    <Box sx={{ width: '100%', height: '1px', bgcolor: '#E6EDF5', display: { xs: 'block', md: 'none' } }} />

                                    {/* Project Data (Right side) */}
                                    <Box sx={{ flex: 1, width: '100%', py: 1 }}>
                                        <Typography sx={{ color: '#0A1629', fontSize: 15, fontWeight: 800, fontFamily: 'Nunito Sans', mb: 2.5 }}>
                                            Project Data
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography sx={{ color: '#A0AABF', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                                                    All tasks
                                                </Typography>
                                                <Typography sx={{ color: '#0A1629', fontSize: 20, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                                    {proj.allTasks}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ color: '#A0AABF', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                                                    Active tasks
                                                </Typography>
                                                <Typography sx={{ color: '#0A1629', fontSize: 20, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                                    {proj.activeTasks}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ color: '#A0AABF', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                                                    Assignees
                                                </Typography>
                                                <AvatarGroup
                                                    max={4}
                                                    sx={{
                                                        '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans', border: '2px solid white' },
                                                        '& .MuiAvatarGroup-avatar': { bgcolor: '#3F8CFF' }, // the +N avatar color
                                                    }}
                                                >
                                                    {proj.assigneeAvatars.map((src, i) => (
                                                        <Avatar key={i} src={src} />
                                                    ))}
                                                    {proj.extraAssignees > 0 && Array.from({ length: proj.extraAssignees }).map((_, i) => (
                                                        <Avatar key={`extra-${i}`} sx={{ display: 'none' }} />
                                                    ))}
                                                </AvatarGroup>
                                            </Box>
                                        </Box>
                                    </Box>

                                </Box>
                            ))}
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
}
