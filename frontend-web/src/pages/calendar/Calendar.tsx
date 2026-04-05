import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import {
    addMonths,
    subMonths,
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO,
} from 'date-fns';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useEventStore } from '../../stores/useEventStore';
import AddEventModal from '../../components/calendar/AddEventModal';

/**
 * @file Calendar.tsx
 * @description 行事曆主頁面 / Calendar Main Page
 * @description_en Displays the monthly calendar grid and events
 * @description_zh 顯示月曆畫面 (現代化無側拉選單配置)
 */

export default function Calendar() {
    const { events, tasks, fetchEvents } = useEventStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const calendarItems = useMemo(() => {
        const mappedTasks = (tasks || []).map(t => ({
            id: t.id,
            title: t.title,
            startDate: t.deadline || t.createdAt,
            endDate: t.deadline || t.createdAt,
            description: t.description || `狀態: ${t.status}`,
            category: 'Project Task',
            priority: 'Medium',
            isTask: true,
            originalTask: t
        }));

        const mappedEvents = (events || []).map(e => ({
            ...e,
            isTask: false
        }));

        return [...mappedEvents, ...mappedTasks];
    }, [events, tasks]);

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    // User requested 7 days logic back (weekStartsOn: 1 for Monday)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const dateFormat = "d";
    
    // We generate all 7 days intervals
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Helper to get events for a specific day
    const getItemsForDay = (day: Date) => {
        return calendarItems.filter(item => {
            if (!item.startDate) return false;
            const itemStart = parseISO(item.startDate);
            const itemEnd = item.endDate ? parseISO(item.endDate) : itemStart;
            return isSameDay(day, itemStart) || (day >= itemStart && day <= itemEnd);
        });
    };

    // Calculate time diff helper for UI
    const calculateTimeDiff = (start: string, end: string | undefined): string => {
        if (!end) return '1h'; // default mock
        try {
            const startDate = parseISO(start);
            const endDate = parseISO(end);
            const diffHours = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
            return diffHours > 0 ? `${diffHours}h` : '1h';
        } catch {
            return '1h';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', bgcolor: '#F4F9FD', px: { xs: 3, lg: 6 }, py: { xs: 3, lg: 4 }, minHeight: 'calc(100vh - 64px)' }}>
            
            {/* Page Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 1 }}>
                <Typography sx={{ color: '#0A1629', fontSize: 36, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                    Calendar
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setSelectedEvent(null); setModalOpen(true); }}
                    sx={{
                        width: 148, height: 48,
                        bgcolor: '#3F8CFF',
                        borderRadius: '14px',
                        boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                        textTransform: 'none',
                        fontSize: 16,
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#2b75e3' }
                    }}
                >
                    Add Event
                </Button>
            </Box>

            {/* Main Calendar Container */}
            <Box sx={{ 
                flex: 1, display: 'flex', flexDirection: 'column', 
                bgcolor: 'white', 
                boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)', 
                borderRadius: '24px', 
                overflow: 'hidden',
                position: 'relative'
            }}>
                
                {/* Internal Header (Month Nav) */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3, pb: 2, borderBottom: '1px solid #E6EBF5' }}>
                    <IconButton onClick={handlePrevMonth} sx={{ color: '#3F8CFF' }}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography sx={{ color: '#0A1629', fontSize: 18, fontFamily: 'Nunito Sans', fontWeight: 700, mx: 2, minWidth: 150, textAlign: 'center' }}>
                        {format(currentDate, 'MMMM, yyyy')}
                    </Typography>
                    <IconButton onClick={handleNextMonth} sx={{ color: '#3F8CFF' }}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Box>

                {/* Calendar Grid Headers */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #E6EBF5' }}>
                    {weekDays.map(day => (
                        <Box key={day} sx={{ p: 2, display: 'flex', alignItems: 'flex-start' }}>
                            <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '7px', px: 1.5, py: 0.5 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                    {day}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Calendar Core Grid */}
                <Box sx={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', 
                    bgcolor: '#E6EBF5', gap: '1px', flex: 1 
                }}>
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const dayItems = getItemsForDay(day);

                        return (
                            <Box key={day.toISOString()} sx={{ bgcolor: 'white', minHeight: 120, p: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* Date Number Top Right */}
                                <Typography sx={{ 
                                    textAlign: 'right', 
                                    color: isCurrentMonth ? '#0A1629' : '#C9CCD1', 
                                    fontSize: 14, 
                                    fontFamily: 'Nunito Sans', 
                                    mb: 1, px: 0.5 
                                }}>
                                    {format(day, dateFormat)}
                                </Typography>

                                {/* Day Events (Scrollable) */}
                                <Box sx={{ 
                                    display: 'flex', flexDirection: 'column', flex: 1, 
                                    overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' },
                                    pb: 1 // Padding bottom for scrolling clearance
                                }}>
                                    {dayItems.map((item, idx) => {
                                        let borderColor = '#3F8CFF'; 
                                        if (item.isTask) borderColor = '#0AC947'; 
                                        else if (item.priority === 'High') borderColor = '#DE92EB';
                                        else if (item.priority === 'Low') borderColor = '#FFBD21';
                                        
                                        const timeDiff = calculateTimeDiff(item.startDate as string, item.endDate as string);
                                        const isStackedMode = dayItems.length >= 3;
                                        
                                        return (
                                            <Box 
                                                key={item.id + '_' + idx}
                                                onClick={() => {
                                                    if (!item.isTask) {
                                                        setSelectedEvent(item);
                                                        setModalOpen(true);
                                                    }
                                                }}
                                                sx={{
                                                    bgcolor: '#F4F9FD', borderRadius: '14px', 
                                                    position: 'relative', overflow: 'hidden',
                                                    p: 1.5, pb: 1, pl: 2.5,
                                                    minHeight: 56, // Fixed minimum height for standard pill view
                                                    cursor: item.isTask ? 'default' : 'pointer',
                                                    mb: isStackedMode ? 0 : 1,
                                                    mt: isStackedMode && idx > 0 ? '-26px' : 0, // Overlap for 3+ items
                                                    outline: isStackedMode ? '2px solid white' : 'none',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { 
                                                        bgcolor: '#E6EDF5',
                                                        zIndex: 10,
                                                        outline: '2px solid #3F8CFF',
                                                        transform: isStackedMode ? 'translateY(-4px)' : 'none',
                                                        boxShadow: isStackedMode ? '0px 4px 12px rgba(63, 140, 255, 0.2)' : 'none',
                                                    },
                                                }}
                                            >
                                                {/* Left Color Strip */}
                                                <Box sx={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 4, bgcolor: borderColor, borderRadius: '2px' }} />
                                                
                                                {/* Title */}
                                                <Typography sx={{ color: '#0A1629', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 700, lineHeight: 1.2, mb: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {item.title}
                                                </Typography>
                                                
                                                {/* Time & Icon row */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ color: '#7D8592', fontSize: 12, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                                        {timeDiff}
                                                    </Typography>
                                                    {item.isTask ? (
                                                        <EventIcon sx={{ fontSize: 14, color: '#0AC947' }} />
                                                    ) : (
                                                        item.priority === 'High' ? <ArrowUpwardIcon sx={{ fontSize: 14, color: borderColor }} /> : <ArrowDownwardIcon sx={{ fontSize: 14, color: borderColor }} />
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                                
                                {/* +X More Counter Badge (Fixed at bottom right of the cell) */}
                                {dayItems.length > 3 && (
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        right: 8, bottom: 8, 
                                        width: 24, height: 24, 
                                        bgcolor: 'rgba(63, 140, 255, 0.9)', color: 'white', 
                                        borderRadius: '50%', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 700, fontFamily: 'Nunito Sans',
                                        outline: '2px solid white',
                                        zIndex: 5,
                                        pointerEvents: 'none', // Allow clicking/scrolling events behind the badge
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        +{dayItems.length}
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            <AddEventModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedEvent(null); fetchEvents(); }} event={selectedEvent} />
        </Box>
    );
}
