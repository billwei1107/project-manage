import { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Button,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

/**
 * @file EmployeeList.tsx
 * @description 員工列表頁面 / Employee List Page
 * @description_en Detailed modern card-based employee list interface
 * @description_zh 現代化卡片式員工列表介面，包含分頁與快速操作與狀態切換
 */

interface MockEmployee {
    id: string;
    name: string;
    email: string;
    gender: 'Male' | 'Female';
    birthday: string;
    age: number;
    position: string;
    level: string;
    avatar: string;
}

const MOCK_EMPLOYEES: MockEmployee[] = [
    { id: '1', name: 'Evan Yates', email: 'evanyates@gmail.com', gender: 'Male', birthday: 'Apr 12, 1995', age: 25, position: 'UI/UX Designer', level: 'Middle', avatar: '/avatars/evan.png' },
    { id: '2', name: 'Lenora Fowler', email: 'eravi@ec.gov', gender: 'Female', birthday: 'Apr 28, 1998', age: 23, position: 'UI/UX Designer', level: 'Junior', avatar: '/avatars/lenora.png' },
    { id: '3', name: 'Winnie McGuire', email: 'winnie3498@gmail.com', gender: 'Female', birthday: 'Apr 12, 1995', age: 25, position: 'Copywriter', level: 'Senior', avatar: '/avatars/winnie.png' },
    { id: '4', name: 'James Williamson', email: 'williamsonj@gmail.com', gender: 'Male', birthday: 'Sep 23, 1992', age: 28, position: 'iOS Developer', level: 'Middle', avatar: '/avatars/james.png' },
    { id: '5', name: 'Emily Tyler', email: 'tyleremily24@gmail.com', gender: 'Female', birthday: 'May 16, 1996', age: 24, position: 'UI/UX Designer', level: 'Junior', avatar: '/avatars/emily.png' },
    { id: '6', name: 'Thomas Schneider', email: 'thomas.s@gmail.com', gender: 'Male', birthday: 'Apr 28, 1998', age: 23, position: 'Sales Manager', level: 'Junior', avatar: '/avatars/thomas.png' },
    { id: '7', name: 'Sallie Long', email: 'sallielong@gmail.com', gender: 'Female', birthday: 'Apr 12, 1995', age: 25, position: 'Copywriter', level: 'Middle', avatar: '/avatars/sallie.png' },
    { id: '8', name: 'Kathryn Guerrero', email: 'kathryn1992@gmail.com', gender: 'Female', birthday: 'Sep 23, 1992', age: 28, position: 'iOS Developer', level: 'Senior', avatar: '/avatars/kathryn.png' }
];

export default function EmployeeList() {
    const [activeTab, setActiveTab] = useState<'List' | 'Activity'>('List');

    const ColumnHeaderLabel = ({ title }: { title: string }) => (
        <Typography sx={{ color: '#A0AABF', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 0.5 }}>
            {title}
        </Typography>
    );

    const ColumnValueLabel = ({ value }: { value: string | number }) => (
        <Typography sx={{ color: '#0A1629', fontSize: 15, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
            {value}
        </Typography>
    );

    return (
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, bgcolor: '#F4F9FD', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Top Toolbar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                
                {/* Title */}
                <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', flexShrink: 0 }}>
                    Employees (28)
                </Typography>

                {/* Segmented Control */}
                <Box sx={{ display: 'flex', bgcolor: '#E6EDF5', borderRadius: '24px', p: '4px', flexShrink: 0 }}>
                    <Box
                        onClick={() => setActiveTab('List')}
                        sx={{
                            py: 1, px: 5, borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
                            bgcolor: activeTab === 'List' ? '#3F8CFF' : 'transparent',
                            color: activeTab === 'List' ? 'white' : '#7D8592',
                            fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: activeTab === 'List' ? 700 : 600,
                            boxShadow: activeTab === 'List' ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none'
                        }}
                    >
                        List
                    </Box>
                    <Box
                        onClick={() => setActiveTab('Activity')}
                        sx={{
                            py: 1, px: 5, borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
                            bgcolor: activeTab === 'Activity' ? '#3F8CFF' : 'transparent',
                            color: activeTab === 'Activity' ? 'white' : '#7D8592',
                            fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: activeTab === 'Activity' ? 700 : 600,
                            boxShadow: activeTab === 'Activity' ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none'
                        }}
                    >
                        Activity
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <IconButton sx={{ bgcolor: 'white', borderRadius: '14px', p: 1.5, boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#F0F6FF' } }}>
                        <FilterAltOutlinedIcon sx={{ color: '#0A1629' }} />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: '#3F8CFF', color: 'white', borderRadius: '14px', textTransform: 'none', px: 3, py: 1.5,
                            fontSize: 15, fontWeight: 700, fontFamily: 'Nunito Sans', boxShadow: '0px 4px 12px rgba(63, 140, 255, 0.3)',
                            '&:hover': { bgcolor: '#3377E6' }
                        }}
                    >
                        Add Employee
                    </Button>
                </Box>
            </Box>

            {/* List Body */}
            {activeTab === 'List' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, flex: 1 }}>
                    {MOCK_EMPLOYEES.map((employee) => (
                        <Box
                            key={employee.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: 'white',
                                borderRadius: '24px',
                                p: { xs: 3, md: 3 },
                                gap: { xs: 2, md: 4 },
                                boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
                                flexWrap: { xs: 'wrap', md: 'nowrap' },
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {/* 1. Avatar & Name/Email */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: { xs: '1 1 100%', md: '0 0 280px' } }}>
                                <Avatar src={employee.avatar} sx={{ width: 56, height: 56, bgcolor: '#3F8CFF' }}>
                                    {employee.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 800, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                        {employee.name}
                                    </Typography>
                                    <Typography sx={{ color: '#A0AABF', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                                        {employee.email}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* 2. Gender */}
                            <Box sx={{ flex: { xs: '1 1 45%', md: '1' } }}>
                                <ColumnHeaderLabel title="Gender" />
                                <ColumnValueLabel value={employee.gender} />
                            </Box>

                            {/* 3. Birthday */}
                            <Box sx={{ flex: { xs: '1 1 45%', md: '1' } }}>
                                <ColumnHeaderLabel title="Birthday" />
                                <ColumnValueLabel value={employee.birthday} />
                            </Box>

                            {/* 4. Full Age */}
                            <Box sx={{ flex: { xs: '1 1 45%', md: '0.8' } }}>
                                <ColumnHeaderLabel title="Full age" />
                                <ColumnValueLabel value={employee.age} />
                            </Box>

                            {/* 5. Position & Label */}
                            <Box sx={{ flex: { xs: '1 1 45%', md: '1.5' }, pr: { md: 2 } }}>
                                <ColumnHeaderLabel title="Position" />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ColumnValueLabel value={employee.position} />
                                    <Box sx={{ border: '1px solid #D8E0F0', borderRadius: '8px', px: 1, py: 0.25 }}>
                                        <Typography sx={{ color: '#7D8592', fontSize: 11, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                            {employee.level}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* 6. Context Menu Icon */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 'auto' }}>
                                <IconButton sx={{ bgcolor: '#F4F9FD', width: 44, height: 44, borderRadius: '12px', '&:hover': { bgcolor: '#E6EDF5' } }}>
                                    <MoreVertIcon sx={{ color: '#0A1629' }} />
                                </IconButton>
                            </Box>

                        </Box>
                    ))}
                </Box>
            )}

            {/* Pagination Controls */}
            {activeTab === 'List' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: '16px', py: 1.5, px: 3, gap: 3, boxShadow: '0px 2px 14px rgba(0,0,0,0.03)' }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 15, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                            1-8 of 28
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <IconButton size="small" sx={{ p: 0, '&:hover': { bgcolor: 'transparent' } }}>
                                <ArrowBackIcon sx={{ color: '#D8E0F0', fontSize: 20 }} />
                            </IconButton>
                            <IconButton size="small" sx={{ p: 0, '&:hover': { bgcolor: 'transparent' } }}>
                                <ArrowForwardIcon sx={{ color: '#3F8CFF', fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            )}

            {activeTab === 'Activity' && (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#7D8592', fontSize: 16, fontFamily: 'Nunito Sans' }}>
                        Activity board coming soon...
                    </Typography>
                </Box>
            )}

        </Box>
    );
}
