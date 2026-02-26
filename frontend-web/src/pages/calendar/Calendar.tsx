import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Button,
    useTheme,
    alpha,
    List,
    ListItem,
    Tooltip,
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
    isToday,
    parseISO,
} from 'date-fns';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEventStore } from '../../stores/useEventStore';
import AddEventModal from '../../components/calendar/AddEventModal';

/**
 * @file Calendar.tsx
 * @description 行事曆主頁面 / Calendar Main Page
 * @description_en Displays the monthly calendar grid and nearest events sidebar
 * @description_zh 顯示月曆畫面與近期事件側邊欄
 */

export default function Calendar() {
    const theme = useTheme();
    const { events, fetchEvents } = useEventStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null); // For editing

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    // Helper to get events for a specific day
    const getEventsForDay = (day: Date) => {
        return events.filter(e => {
            const eventStart = parseISO(e.startDate);
            const eventEnd = parseISO(e.endDate);
            // Simple check: if day is between start and end (inclusive of start/end days)
            return isSameDay(day, eventStart) || (day >= eventStart && day <= eventEnd);
        });
    };

    // Sort events for the right sidebar (Nearest events)
    const nearestEvents = [...events]
        .filter(e => new Date(e.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5);

    return (
        <Box sx={{ p: 3, display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' }, height: '100%' }}>
            {/* Main Calendar Area */}
            <Paper elevation={0} sx={{ flex: 1, p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>

                {/* Header: Month/Year Nav & Add Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleToday}
                            sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary', borderColor: theme.palette.divider }}
                        >
                            <EventIcon fontSize="small" sx={{ mr: 1 }} />
                            今天
                        </Button>
                        <IconButton size="small" onClick={handlePrevMonth} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <IconButton size="small" onClick={handleNextMonth} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ fontWeight: 700, ml: 2, color: 'text.primary' }}>
                            {format(currentDate, 'yyyy 年 M 月')}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => { setSelectedEvent(null); setModalOpen(true); }}
                        sx={{ borderRadius: 2, px: 3, py: 1, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                    >
                        新增事件
                    </Button>
                </Box>

                {/* Calendar Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
                    {weekDays.map(day => (
                        <Typography key={day} variant="subtitle2" align="center" sx={{ color: 'text.secondary', fontWeight: 600, py: 1 }}>
                            {day}
                        </Typography>
                    ))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', bgcolor: theme.palette.divider, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden', flex: 1 }}>
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isDayToday = isToday(day);
                        const dayEvents = getEventsForDay(day);

                        return (
                            <Box
                                key={day.toISOString()}
                                sx={{
                                    bgcolor: isCurrentMonth ? 'background.paper' : alpha(theme.palette.background.default, 0.5),
                                    minHeight: 120,
                                    p: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: isDayToday ? 700 : 500,
                                        color: isDayToday ? 'primary.main' : (isCurrentMonth ? 'text.primary' : 'text.disabled'),
                                        mb: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        ...(isDayToday && { bgcolor: alpha(theme.palette.primary.main, 0.1) })
                                    }}
                                >
                                    {format(day, dateFormat)}
                                </Typography>

                                {/* Events for the day */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                                    {dayEvents.map(event => (
                                        <Tooltip
                                            key={event.id}
                                            title={
                                                <Box sx={{ p: 0.5 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                                                    <Typography variant="caption" display="block">{format(parseISO(event.startDate), 'HH:mm')} - {format(parseISO(event.endDate), 'HH:mm')}</Typography>
                                                    {event.description && <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>{event.description}</Typography>}
                                                    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'primary.light' }}>類別: {event.category}</Typography>
                                                </Box>
                                            }
                                            placement="top"
                                            arrow
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.dark',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                                }}
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setModalOpen(true);
                                                }}
                                            >
                                                {event.title}
                                            </Box>
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Paper>

            {/* Sidebar: Nearest Events */}
            <Box sx={{ width: { xs: '100%', lg: 320 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>近期事件</Typography>
                        <Button size="small" sx={{ textTransform: 'none' }}>查看全部</Button>
                    </Box>
                    <List disablePadding>
                        {nearestEvents.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>尚無近期事件</Typography>
                        ) : (
                            nearestEvents.map((event, idx) => {
                                const isTodayEvent = isSameDay(parseISO(event.startDate), new Date());
                                return (
                                    <ListItem
                                        key={event.id}
                                        disablePadding
                                        sx={{
                                            mb: 2,
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            p: 2,
                                            borderLeft: `4px solid ${event.priority === 'High' ? theme.palette.error.main : (event.priority === 'Medium' ? theme.palette.warning.main : theme.palette.success.main)}`,
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                                            ...(idx === nearestEvents.length - 1 && { mb: 0 })
                                        }}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                                                    {event.title}
                                                </Typography>
                                                {event.priority === 'High' ? (
                                                    <ArrowUpwardIcon fontSize="small" color="error" />
                                                ) : <ArrowDownwardIcon fontSize="small" color="success" />}
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {isTodayEvent ? '今天' : format(parseISO(event.startDate), 'M月d日')} | {format(parseISO(event.startDate), 'HH:mm')}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: alpha(theme.palette.text.secondary, 0.1), px: 1, py: 0.5, borderRadius: 1 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{format(parseISO(event.endDate), 'HH:mm')}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                );
                            })
                        )}
                    </List>
                </Paper>
            </Box>

            <AddEventModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedEvent(null); fetchEvents(); }} event={selectedEvent} />
        </Box>
    );
}
