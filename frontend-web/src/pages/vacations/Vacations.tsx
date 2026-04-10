import { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * @file Vacations.tsx
 * @description 休假管理清單頁面 / Vacations Page
 */

interface VacationData {
    id: string;
    name: string;
    email: string;
    avatar: string;
    vacations: number;
    sickLeave: number;
    workRemotely: number;
}

const MOCK_VACATIONS: VacationData[] = [
    { id: '1', name: 'Ryan Thompson', email: 'ryanthom@gmail.com', avatar: '/avatars/ryan.png', vacations: 15, sickLeave: 3, workRemotely: 50 },
    { id: '2', name: 'Vincent Allen', email: 'vincentall@gmail.com', avatar: '/avatars/vincent.png', vacations: 10, sickLeave: 6, workRemotely: 34 },
    { id: '3', name: 'Grace Joseph', email: 'gracejos@gmail.com', avatar: '/avatars/grace.png', vacations: 10, sickLeave: 5, workRemotely: 19 },
    { id: '4', name: 'Emily Tyler', email: 'tyleremily24@gmail.com', avatar: '/avatars/emily.png', vacations: 8, sickLeave: 7, workRemotely: 41 },
    { id: '5', name: 'Lenora Fowler', email: 'eravi@ec.gov', avatar: '/avatars/lenora.png', vacations: 14, sickLeave: 4, workRemotely: 38 },
    { id: '6', name: 'Maude Goodman', email: 'maudegood@gmail.com', avatar: '/avatars/maude.png', vacations: 12, sickLeave: 6, workRemotely: 45 },
    { id: '7', name: 'Delia Santos', email: 'santos1999@gmail.com', avatar: '/avatars/delia.png', vacations: 10, sickLeave: 5, workRemotely: 12 },
    { id: '8', name: 'Brandon Potter', email: 'brandonp@gmail.com', avatar: '/avatars/brandon.png', vacations: 8, sickLeave: 7, workRemotely: 48 },
];

export default function Vacations() {
    const [activeTab, setActiveTab] = useState<'Employees_vacations' | 'Calendar'>('Employees_vacations');

    const StatColumn = ({ label, value }: { label: string, value: number }) => (
        <Box sx={{ minWidth: { xs: '80px', sm: '120px' } }}>
            <Typography sx={{ color: '#A0AABF', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                {label}
            </Typography>
            <Typography sx={{ color: '#0A1629', fontSize: 20, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                {value}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ flex: 1, p: { xs: 2, md: 4, lg: 5 }, bgcolor: '#F4F9FD', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Header Area */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: { xs: 'center', md: 'center' }, 
                justifyContent: 'space-between',
                mb: 5,
                gap: 3
            }}>
                <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', width: { xs: '100%', md: 'auto' } }}>
                    Vacations
                </Typography>

                {/* Segmented Control */}
                <Box sx={{ display: 'flex', bgcolor: '#E6EDF5', borderRadius: '24px', p: '4px', alignSelf: { xs: 'stretch', md: 'center' } }}>
                    {[
                        { id: 'Employees_vacations', label: 'Employees\' vacations' },
                        { id: 'Calendar', label: 'Calendar' }
                    ].map((tab) => (
                        <Box
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            sx={{
                                flex: { xs: 1, md: 'none' },
                                textAlign: 'center',
                                py: 1.5, 
                                px: { xs: 2, sm: 4 }, 
                                borderRadius: '20px', 
                                cursor: 'pointer', 
                                transition: 'all 0.2s',
                                bgcolor: activeTab === tab.id ? '#3F8CFF' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#7D8592',
                                fontSize: 14, 
                                fontFamily: 'Nunito Sans', 
                                fontWeight: activeTab === tab.id ? 700 : 600,
                                boxShadow: activeTab === tab.id ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none'
                            }}
                        >
                            {tab.label}
                        </Box>
                    ))}
                </Box>

                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    sx={{ 
                        bgcolor: '#3F8CFF', 
                        color: 'white', 
                        borderRadius: '14px', 
                        textTransform: 'none', 
                        px: 3, 
                        py: 1.5,
                        fontSize: 15, 
                        fontWeight: 700, 
                        fontFamily: 'Nunito Sans', 
                        boxShadow: '0px 4px 12px rgba(63, 140, 255, 0.3)',
                        width: { xs: '100%', md: 'auto' },
                        '&:hover': { bgcolor: '#3377E6' }
                    }}
                >
                    Add Request
                </Button>
            </Box>

            {/* List Area */}
            {activeTab === 'Employees_vacations' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {MOCK_VACATIONS.map((employee) => (
                        <Box 
                            key={employee.id}
                            sx={{ 
                                bgcolor: 'white', 
                                borderRadius: '24px', 
                                p: { xs: 2, md: 3 }, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'flex-start', md: 'center' },
                                boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-2px)' },
                                gap: { xs: 3, md: 0 }
                            }}
                        >
                            {/* Employee Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, width: '100%' }}>
                                <Avatar 
                                    src={employee.avatar} 
                                    sx={{ width: 48, height: 48 }}
                                >
                                    {employee.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 800, fontFamily: 'Nunito Sans', mb: 0.25 }}>
                                        {employee.name}
                                    </Typography>
                                    <Typography sx={{ color: '#A0AABF', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                                        {employee.email}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Stats Data */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: { xs: 'space-between', md: 'flex-end' }, 
                                gap: { xs: 1, sm: 4 }, 
                                width: { xs: '100%', md: 'auto' }
                            }}>
                                <StatColumn label="Vacations" value={employee.vacations} />
                                <StatColumn label="Sick Leave" value={employee.sickLeave} />
                                <StatColumn label="Work remotely" value={employee.workRemotely} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {activeTab === 'Calendar' && (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white', borderRadius: '24px', border: '2px dashed #E6EDF5' }}>
                    <Typography sx={{ color: '#A0AABF', fontSize: 16, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                        Calendar View Coming Soon...
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
