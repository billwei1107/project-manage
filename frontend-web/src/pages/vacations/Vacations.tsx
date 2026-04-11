import { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * @file Vacations.tsx
 * @description 休假管理清單與行事曆頁面 / Vacations Page
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

interface CalendarEvent {
    type: 'vacation' | 'sick' | 'remote';
    status: 'approved' | 'pending';
    startDay: number;
    endDay: number;
}

interface EmployeeCalendar {
    id: string;
    name: string;
    avatar: string;
    events: CalendarEvent[];
}

const MOCK_CALENDAR_DATA: EmployeeCalendar[] = [
    { id: '1', name: 'Oscar Holloway', avatar: '/avatars/oscar.png', events: [{ type: 'vacation', status: 'approved', startDay: 2, endDay: 4 }] },
    { id: '2', name: 'Evan Yates', avatar: '/avatars/evan.png', events: [{ type: 'vacation', status: 'approved', startDay: 5, endDay: 6 }, { type: 'remote', status: 'pending', startDay: 16, endDay: 19 }] },
    { id: '3', name: 'Lola Zimmerman', avatar: '/avatars/lola.png', events: [{ type: 'sick', status: 'approved', startDay: 7, endDay: 10 }] },
    { id: '4', name: 'Tyler Curry', avatar: '/avatars/tyler.png', events: [{ type: 'remote', status: 'approved', startDay: 11, endDay: 14 }, { type: 'remote', status: 'approved', startDay: 21, endDay: 23 }] },
    { id: '5', name: 'Sadie Wolfe', avatar: '/avatars/sadie.png', events: [{ type: 'vacation', status: 'approved', startDay: 15, endDay: 16 }, { type: 'vacation', status: 'approved', startDay: 24, endDay: 25 }] },
    { id: '6', name: 'Sean Gibbs', avatar: '/avatars/sean.png', events: [{ type: 'sick', status: 'approved', startDay: 17, endDay: 17 }, { type: 'sick', status: 'pending', startDay: 18, endDay: 18 }, { type: 'sick', status: 'approved', startDay: 27, endDay: 27 }] },
    { id: '7', name: 'Corey Watts', avatar: '/avatars/corey.png', events: [{ type: 'vacation', status: 'approved', startDay: 8, endDay: 9 }, { type: 'remote', status: 'approved', startDay: 10, endDay: 11 }] },
    { id: '8', name: 'Theodore Shaw', avatar: '/avatars/theodore.png', events: [{ type: 'remote', status: 'approved', startDay: 6, endDay: 9 }] },
    { id: '9', name: 'Edwin Austin', avatar: '/avatars/edwin.png', events: [{ type: 'remote', status: 'approved', startDay: 11, endDay: 13 }, { type: 'vacation', status: 'approved', startDay: 21, endDay: 22 }] },
    { id: '10', name: 'Thomas Cummings', avatar: '/avatars/thomas.png', events: [{ type: 'vacation', status: 'pending', startDay: 8, endDay: 11 }] },
    { id: '11', name: 'Augusta Gordon', avatar: '/avatars/augusta.png', events: [{ type: 'vacation', status: 'approved', startDay: 11, endDay: 12 }, { type: 'vacation', status: 'approved', startDay: 21, endDay: 25 }] },
];

const DAYS = Array.from({ length: 29 }, (_, i) => i + 1);
const DAY_LETTERS = ['一', '二', '三', '四', '五', '六', '日'];

const COLORS = {
    vacation: '#1CC0E0',
    sick: '#FF565E',
    remote: '#7452E2',
};

export default function Vacations() {
    const [activeTab, setActiveTab] = useState<'Employees_vacations' | 'Calendar'>('Calendar');

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

    const LegendItem = ({ label, type }: { label: string, type: 'vacation' | 'sick' | 'remote' }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ color: '#A0AABF', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[type] }} />
                    <Typography sx={{ color: '#0A1629', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>已核准</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px solid ${COLORS[type]}` }} />
                    <Typography sx={{ color: '#0A1629', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>待審核</Typography>
                </Box>
            </Box>
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
                    差勤管理
                </Typography>

                {/* Segmented Control */}
                <Box sx={{ display: 'flex', bgcolor: '#E6EDF5', borderRadius: '24px', p: '4px', alignSelf: { xs: 'stretch', md: 'center' } }}>
                    {[
                        { id: 'Employees_vacations', label: '員工休假名單' },
                        { id: 'Calendar', label: '行事曆' }
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
                    新增假單
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, width: '100%' }}>
                                <Avatar src={employee.avatar} sx={{ width: 48, height: 48 }}>
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

                            <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', md: 'flex-end' }, gap: { xs: 1, sm: 4 }, width: { xs: '100%', md: 'auto' } }}>
                                <StatColumn label="特休假" value={employee.vacations} />
                                <StatColumn label="病假" value={employee.sickLeave} />
                                <StatColumn label="遠距工作" value={employee.workRemotely} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Calendar Area */}
            {activeTab === 'Calendar' && (
                <Box sx={{ bgcolor: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.1)', overflowX: 'auto' }}>
                    
                    {/* Header Row */}
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #E6EDF5', minWidth: 1000 }}>
                        <Box sx={{ width: 220, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRight: '1px solid #E6EDF5' }}>
                            <Typography sx={{ color: '#0A1629', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito Sans' }}>員工</Typography>
                            <IconButton size="small" sx={{ bgcolor: '#F4F9FD', borderRadius: '8px' }}>
                                <SearchIcon fontSize="small" sx={{ color: '#0A1629' }} />
                            </IconButton>
                        </Box>
                        
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: '14px 24px', borderBottom: '1px solid #E6EDF5' }}>
                                <Typography sx={{ color: '#0A1629', fontSize: 15, fontWeight: 800, fontFamily: 'Nunito Sans', flex: 1, textAlign: 'center' }}>
                                    第一週 (九月)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ArrowBackIcon sx={{ color: '#A0AABF', fontSize: 20, cursor: 'pointer' }} />
                                    <ArrowForwardIcon sx={{ color: '#3F8CFF', fontSize: 20, cursor: 'pointer' }} />
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(29, 1fr)', gap: '4px', px: 2, pt: 1, pb: 1.5 }}>
                                {DAYS.map(d => (
                                    <Box key={d} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography sx={{ color: '#0A1629', fontSize: 12, fontWeight: 800, fontFamily: 'Nunito Sans' }}>{d}</Typography>
                                        <Typography sx={{ color: '#A0AABF', fontSize: 10, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                            {DAY_LETTERS[d % 7]}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Timeline Rows */}
                    <Box sx={{ minWidth: 1000 }}>
                        {MOCK_CALENDAR_DATA.map((emp) => (
                            <Box key={emp.id} sx={{ display: 'flex', borderBottom: '1px solid #F4F9FD', '&:last-child': { borderBottom: 'none' } }}>
                                
                                {/* Employee Name/Avatar */}
                                <Box sx={{ width: 220, px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderRight: '1px solid #E6EDF5' }}>
                                    <Avatar src={emp.avatar} sx={{ width: 32, height: 32 }}>{emp.name.charAt(0)}</Avatar>
                                    <Typography sx={{ color: '#0A1629', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                        {emp.name}
                                    </Typography>
                                </Box>

                                {/* Grid Timeline */}
                                <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(29, 1fr)', gap: '4px', px: 2, py: 1.5 }}>
                                    {DAYS.map(day => {
                                        const event = emp.events.find(e => day >= e.startDay && day <= e.endDay);
                                        if (!event) {
                                            return <Box key={day} sx={{ bgcolor: '#F4F9FD', borderRadius: '4px', height: 32 }} />;
                                        }

                                        const isApproved = event.status === 'approved';
                                        
                                        // 針對設計圖中視覺呈現稍微簡化的切版：
                                        // 實際上可以用 flex 跨越多格，但現行架構直接每一格獨立 rendering 會更容易適配不同螢幕。
                                        // 根據截圖，每個事件單元幾乎都有自己的圓角邊框，且看起來像是個別的 Pills。
                                        return (
                                            <Box 
                                                key={day} 
                                                sx={{ 
                                                    height: 32, 
                                                    borderRadius: '6px', 
                                                    bgcolor: isApproved ? COLORS[event.type] : 'transparent',
                                                    border: !isApproved ? `1.5px solid ${COLORS[event.type]}` : 'none',
                                                    // 對於最後一天是半週休假或短時段，直接等比例縮小 (例如 50% 寬度)
                                                    width: (emp.id === '9' && day === 13) ? '50%' : '100%',
                                                }} 
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Footer Legend */}
                    <Box sx={{ display: 'flex', minWidth: 1000, borderTop: '1px solid #E6EDF5', p: 3, gap: 10 }}>
                        <LegendItem label="病假" type="sick" />
                        <LegendItem label="遠距工作" type="remote" />
                        <LegendItem label="特休假" type="vacation" />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
