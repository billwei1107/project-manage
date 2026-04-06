import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    CircularProgress,
    Button
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useAuthStore } from '../../stores/useAuthStore';
import axiosInstance from '../../api/axios';

/**
 * @file Profile.tsx
 * @description 使用者個人設定頁面 / User Profile Page
 * @description_en User profile settings and overview of user's current projects
 * @description_zh 提供使用者檢視個人資訊與上傳大頭貼的完整頁面
 */

// Dummy Projects Data
const dummyProjects = [
    {
        id: 'PN0001265',
        title: 'Medical App (iOS native)',
        date: 'Sep 12, 2020',
        priority: 'Medium',
        allTasks: 34,
        activeTasks: 13,
        assignees: ['A', 'B', 'C'],
        extraCount: 2,
        iconBg: '#FFF2CC',
        iconColor: '#FFB800'
    },
    {
        id: 'PN0001221',
        title: 'Food Delivery Service',
        date: 'Sep 10, 2020',
        priority: 'Medium',
        allTasks: 50,
        activeTasks: 24,
        assignees: ['D', 'E', 'F'],
        extraCount: 0,
        iconBg: '#E6F4EA',
        iconColor: '#34A853'
    },
    {
        id: 'PN0001290',
        title: 'Internal Project',
        date: 'May 28, 2020',
        priority: 'Low',
        allTasks: 23,
        activeTasks: 20,
        assignees: ['G', 'H', 'I'],
        extraCount: 5,
        iconBg: '#E8F0FE',
        iconColor: '#4285F4'
    }
];

// Dummy Team Data
const dummyTeam = [
    { id: 1, name: 'Shawn Stone', role: 'UI/UX Designer', level: 'Middle', initials: 'S' },
    { id: 2, name: 'Randy Delgado', role: 'UI/UX Designer', level: 'Junior', initials: 'R' },
    { id: 3, name: 'Emily Tyler', role: 'Copywriter', level: 'Middle', initials: 'E' },
    { id: 4, name: 'Blake Silva', role: 'IOS Developer', level: 'Senior', initials: 'B' },
    { id: 5, name: 'Oscar Holloway', role: 'UI/UX Designer', level: 'Middle', initials: 'O' },
    { id: 6, name: 'Wayne Marsh', role: 'Copywriter', level: 'Junior', initials: 'W' },
    { id: 7, name: 'Jeremy Barrett', role: 'UI/UX Designer', level: 'Middle', initials: 'J' },
];

// Dummy Vacations Data
const dummyBalances = [
    { type: 'Vacation', current: 12, total: 16, color: '#00C2FF' },
    { type: 'Sick Leave', current: 6, total: 12, color: '#FF4D4F' },
    { type: 'Work remotely', current: 42, total: 50, color: '#722ED1' }
];

const dummyRequests = [
    { id: 1, type: 'Sick Leave', duration: '3 days', start: 'Sep 13, 2020', end: 'Sep 16, 2020', status: 'Pending', color: '#FF4D4F', statusBg: '#FFB800' },
    { id: 2, type: 'Work remotely', duration: '1 day', start: 'Sep 1, 2020', end: 'Sep 2, 2020', status: 'Approved', color: '#722ED1', statusBg: '#0AC947' },
    { id: 3, type: 'Vacation', duration: '1 day', start: 'Sep 1, 2020', end: 'Sep 2, 2020', status: 'Approved', color: '#00C2FF', statusBg: '#0AC947' },
];

export default function Profile() {
    const { user, checkAuth } = useAuthStore();
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('Projects'); // Projects, Team, My vacations
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('圖片大小不能超過 5MB');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axiosInstance.post('/v1/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await checkAuth(); // refresh avatar globally
        } catch (err) {
            console.error('Failed to upload avatar', err);
            alert('上傳頭像失敗，請稍後再試');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!user) return null;

    // A helper for rendering the custom styled Input 
    const ProfileInput = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
        <Box sx={{
            border: '1px solid #D8E0F0',
            borderRadius: '14px',
            p: '8px 16px',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
        }}>
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 400, fontFamily: 'Nunito Sans' }}>
                    {value || '-'}
                </Typography>
            </Box>
            {icon && (
                <Box sx={{ color: '#7D8592', display: 'flex', alignItems: 'center' }}>
                    {icon}
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F9FD', minHeight: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Header Title Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography sx={{ fontSize: 36, fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                    My Profile
                </Typography>
                <IconButton sx={{ bgcolor: 'white', borderRadius: '14px', p: 1.5, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
                    <SettingsOutlinedIcon sx={{ color: '#0A1629' }} />
                </IconButton>
            </Box>

            {/* Grid Layout */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, alignItems: 'flex-start' }}>
                
                {/* Left Profile Info Card */}
                <Box sx={{ 
                    bgcolor: 'white', 
                    borderRadius: '24px', 
                    p: 4, 
                    width: { xs: '100%', lg: '320px' },
                    flexShrink: 0,
                    boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)' 
                }}>
                    
                    {/* Avatar Section */}
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                        <Box sx={{ 
                            p: '4px', 
                            borderRadius: '50%', 
                            border: '2px solid #3F8CFF', 
                            borderColor: 'rgba(63,140,255,0.3)' 
                        }}>
                            <Avatar
                                src={user.avatar}
                                onClick={!isUploading ? handleAvatarClick : undefined}
                                sx={{
                                    width: 100, height: 100, fontSize: '3rem',
                                    bgcolor: 'primary.main', cursor: isUploading ? 'default' : 'pointer',
                                    transition: 'all 0.2s', '&:hover': { opacity: isUploading ? 1 : 0.8 }
                                }}
                            >
                                {(user.name || '').charAt(0)}
                            </Avatar>
                        </Box>
                        
                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
                        
                        <IconButton
                            onClick={handleAvatarClick}
                            disabled={isUploading}
                            sx={{
                                position: 'absolute', top: 0, right: -16,
                                bgcolor: '#F4F9FD', border: '1px solid #D8E0F0',
                                '&:hover': { bgcolor: '#E6EDF5' },
                                width: 32, height: 32
                            }}
                        >
                            {isUploading ? <CircularProgress size={14} /> : <EditOutlinedIcon sx={{ fontSize: 16, color: '#0A1629' }} />}
                        </IconButton>
                    </Box>

                    {/* Name & Role */}
                    <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629', mb: 0.5 }}>
                        {user.name || 'User'}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: 'Nunito Sans', color: '#7D8592', mb: 4 }}>
                        UI/UX Designer
                    </Typography>

                    {/* Main info */}
                    <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629', mb: 2 }}>
                        Main info
                    </Typography>
                    <ProfileInput label="Position" value="UI/UX Designer" />
                    <ProfileInput label="Company" value="Cadabra" />
                    <ProfileInput label="Location" value="NYC, New York, USA" icon={<LocationOnOutlinedIcon sx={{ fontSize: 20 }} />} />
                    <ProfileInput label="Birthday Date" value="May 19, 1996" icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 20 }} />} />

                    {/* Contact Info */}
                    <Typography sx={{ fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629', mt: 4, mb: 2 }}>
                        Contact Info
                    </Typography>
                    <ProfileInput label="Email" value={user.email || user.username || ''} />
                    <ProfileInput label="Mobile Number" value="+1 675 346 23-10" />
                    <ProfileInput label="Skype" value="Evan 2256" />

                </Box>

                {/* Right Content Area */}
                <Box sx={{ flex: 1, width: '100%' }}>
                    
                    {/* Top Control Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        
                        {/* Segmented Control */}
                        <Box sx={{ 
                            display: 'flex', bgcolor: '#E6EDF5', borderRadius: '24px', 
                            p: '4px', width: 'fit-content' 
                        }}>
                            {['Projects', 'Team', 'My vacations'].map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <Box
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        sx={{
                                            py: 1, px: 4, borderRadius: '20px',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            bgcolor: isActive ? '#3F8CFF' : 'transparent',
                                            color: isActive ? 'white' : '#0A1629',
                                            fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: isActive ? 700 : 400,
                                            boxShadow: isActive ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none'
                                        }}
                                    >
                                        {tab}
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Filter & Dropdown (Only for Projects) */}
                        {activeTab === 'Projects' && (
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <IconButton sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }}>
                                    <FilterAltOutlinedIcon sx={{ color: '#0A1629' }} />
                                </IconButton>
                                
                                <Button 
                                    endIcon={<KeyboardArrowDownIcon />}
                                    sx={{ 
                                        bgcolor: 'white', color: '#0A1629', borderRadius: '12px', 
                                        textTransform: 'none', px: 2, py: 1, fontSize: 14, fontWeight: 700,
                                        fontFamily: 'Nunito Sans', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
                                        '&:hover': { bgcolor: '#F4F9FD' }
                                    }}
                                >
                                    Current Projects
                                </Button>
                            </Box>
                        )}

                        {/* Add Request Button (Only for My vacations) */}
                        {activeTab === 'My vacations' && (
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#3F8CFF', color: 'white', borderRadius: '12px',
                                    textTransform: 'none', px: 3, py: 1, fontSize: 14, fontWeight: 700,
                                    fontFamily: 'Nunito Sans', boxShadow: '0px 4px 12px rgba(63, 140, 255, 0.3)',
                                    '&:hover': { bgcolor: '#3377E6' }
                                }}
                            >
                                + Add Request
                            </Button>
                        )}

                    </Box>

                    {/* Projects Listing */}
                    {activeTab === 'Projects' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {dummyProjects.map(proj => (
                                <Box key={proj.id} sx={{
                                    bgcolor: 'white', borderRadius: '24px', p: 3,
                                    boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
                                    display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                                    justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 3
                                }}>
                                    
                                    {/* Left Part: Title & Date & Priority */}
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                                        {/* Icon Placeholder */}
                                        <Box sx={{ 
                                            width: 48, height: 48, borderRadius: '12px', 
                                            bgcolor: proj.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                        }}>
                                            <Box sx={{ width: 24, height: 24, bgcolor: proj.iconColor, borderRadius: '6px' }} />
                                        </Box>

                                        <Box>
                                            <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                                {proj.id}
                                            </Typography>
                                            <Typography sx={{ color: '#0A1629', fontSize: 18, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                                                {proj.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: '#7D8592' }} />
                                                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans' }}>
                                                        Created {proj.date}
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ 
                                                    display: 'flex', alignItems: 'center', gap: 0.5,
                                                    color: proj.priority === 'Medium' ? '#FFB800' : '#0AC947', 
                                                    fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans' 
                                                }}>
                                                    {proj.priority === 'Medium' ? <ArrowUpwardIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14 }} />}
                                                    {proj.priority}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Right Part: Project Data */}
                                    <Box sx={{ 
                                        display: 'flex', gap: 4, pl: { md: 4 }, 
                                        borderLeft: { md: '1px solid #E6EDF5' },
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap'
                                    }}>
                                        <Box sx={{ position: 'absolute', opacity: 0 }}>
                                            <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 2 }}>Project Data</Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 2 }}>
                                                Project Data
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 4 }}>
                                                <Box>
                                                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 0.5 }}>All tasks</Typography>
                                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>{proj.allTasks}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 0.5 }}>Active tasks</Typography>
                                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>{proj.activeTasks}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 0.5 }}>Assignees</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {proj.assignees.map((a, i) => (
                                                            <Avatar key={i} sx={{ width: 24, height: 24, bgcolor: '#C418E6', fontSize: 10, border: '2px solid white', ml: i > 0 ? -1 : 0 }}>{a}</Avatar>
                                                        ))}
                                                        {proj.extraCount > 0 && (
                                                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#3F8CFF', fontSize: 10, border: '2px solid white', ml: -1 }}>+{proj.extraCount}</Avatar>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : activeTab === 'Team' ? (
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
                            gap: 3 
                        }}>
                            {dummyTeam.map(member => (
                                <Box key={member.id} sx={{
                                    bgcolor: 'white', borderRadius: '24px', p: 4,
                                    boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <Box sx={{ 
                                        p: '3px', borderRadius: '50%', border: '2px solid #3F8CFF', 
                                        borderColor: 'rgba(63,140,255,0.4)', mb: 2 
                                    }}>
                                        <Avatar sx={{ width: 64, height: 64, bgcolor: '#3F8CFF' }}>
                                            {member.initials}
                                        </Avatar>
                                    </Box>
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                        {member.name}
                                    </Typography>
                                    <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 2 }}>
                                        {member.role}
                                    </Typography>
                                    <Box sx={{ 
                                        border: '1px solid #D8E0F0', borderRadius: '6px', 
                                        px: 1.5, py: 0.25 
                                    }}>
                                        <Typography sx={{ color: '#7D8592', fontSize: 11, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                            {member.level}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : activeTab === 'My vacations' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            
                            {/* Balances Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                                {dummyBalances.map((item, idx) => (
                                    <Box key={idx} sx={{
                                        bgcolor: 'white', borderRadius: '24px', p: 4,
                                        boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)'
                                    }}>
                                        <Box sx={{ 
                                            width: 64, height: 64, borderRadius: '50%', 
                                            border: `2px solid ${item.color}`, display: 'flex', 
                                            alignItems: 'center', justifyContent: 'center', mb: 3 
                                        }}>
                                            <Typography sx={{ color: item.color, fontSize: 24, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                                {item.current}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ color: '#0A1629', fontSize: 18, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1 }}>
                                            {item.type}
                                        </Typography>
                                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 400, fontFamily: 'Nunito Sans' }}>
                                            {item.current}/{item.total} days availible
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* My Requests Section */}
                            <Box>
                                <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 3 }}>
                                    My Requests
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {dummyRequests.map(req => (
                                        <Box key={req.id} sx={{
                                            bgcolor: 'white', borderRadius: '24px', p: 3, px: 4,
                                            boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
                                            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                                            justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 3
                                        }}>
                                            
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 1 }}>Request Type</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: req.color }} />
                                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>{req.type}</Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 1 }}>Duration</Typography>
                                                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 400, fontFamily: 'Nunito Sans' }}>{req.duration}</Typography>
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 1 }}>Start Day</Typography>
                                                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 400, fontFamily: 'Nunito Sans' }}>{req.start}</Typography>
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ color: '#7D8592', fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', mb: 1 }}>End Day</Typography>
                                                <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 400, fontFamily: 'Nunito Sans' }}>{req.end}</Typography>
                                            </Box>

                                            <Box sx={{ px: { md: 2 } }}>
                                                <Box sx={{ 
                                                    bgcolor: req.statusBg, color: 'white', 
                                                    borderRadius: '8px', px: 2, py: 0.5, 
                                                    display: 'inline-block', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans' 
                                                }}>
                                                    {req.status}
                                                </Box>
                                            </Box>

                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                        </Box>
                    ) : null}

                </Box>
            </Box>
        </Box>
    );
}
