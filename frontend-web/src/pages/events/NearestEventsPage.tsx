import { Box, Typography, Button, TextField, InputAdornment, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EventListCard from '../../components/dashboard/EventListCard';

/**
 * @file NearestEventsPage.tsx
 * @description 近期活動列表頁面 / Nearest Events Full Page
 * @description_en Displays all upcoming events in a 2-column grid format
 * @description_zh 顯示所有即將到來的活動，對應 Figma Dashboard - Nearest events
 */

const MOCK_EVENTS = [
    { title: '新部門簡報', timeLabel: '今天 | 下午 6:00', duration: '4 小時', color: '#3F8CFF', trend: 'up' },
    { title: 'Anna 的生日', timeLabel: '今天 | 下午 5:00', duration: '2 小時', color: '#DE92EB', trend: 'down' },
    { title: '與開發團隊會議', timeLabel: '明天 | 下午 5:00', duration: '4 小時', color: '#FDC748', trend: 'up' },
    { title: 'Ray 的生日', timeLabel: '明天 | 下午 2:00', duration: '1.5 小時', color: '#DE92EB', trend: 'down' },
    { title: '與執行長面談', timeLabel: '9月14日 | 下午 5:00', duration: '1 小時', color: '#3F8CFF', trend: 'up' },
    { title: '電影之夜 (天能)', timeLabel: '9月15日 | 下午 5:00', duration: '3 小時', color: '#6D5DD3', trend: 'down' },
    { title: 'Lucas 的生日', timeLabel: '9月29日 | 下午 5:30', duration: '2 小時', color: '#DE92EB', trend: 'down' },
    { title: '與技術長面談', timeLabel: '9月30日 | 中午 12:00', duration: '1 小時', color: '#3F8CFF', trend: 'up' },
];

export default function NearestEventsPage() {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto' }}>
            {/* Header 區域 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 2 }}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/admin')}
                        sx={{
                            color: '#3F8CFF',
                            fontWeight: 700,
                            fontFamily: 'Nunito Sans',
                            textTransform: 'none',
                            fontSize: 16,
                            p: 0,
                            mb: 1.5,
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        返回儀表板
                    </Button>
                    <Typography sx={{ color: '#0A1629', fontSize: 36, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                        近期活動
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                        placeholder="搜尋活動..."
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#7D8592' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: '#FFFFFF',
                                borderRadius: '14px',
                                '& fieldset': { border: 'none' },
                                boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
                                width: { xs: '100%', md: 412 },
                                height: 48,
                                fontFamily: 'Nunito Sans',
                                color: '#7D8592'
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: '#3F8CFF',
                            color: '#fff',
                            borderRadius: '14px',
                            px: 4,
                            height: 48,
                            flexShrink: 0,
                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                            fontWeight: 700,
                            fontFamily: 'Nunito Sans',
                            textTransform: 'none',
                            fontSize: 16
                        }}
                    >
                        新增活動
                    </Button>
                </Box>
            </Box>

            {/* 活動卡片瀑布流 (Event Grid) */}
            <Grid container spacing={3}>
                {MOCK_EVENTS.map((ev, i) => (
                    <Grid size={{ xs: 12, lg: 6 }} key={i}>
                        <EventListCard
                            title={ev.title}
                            timeLabel={ev.timeLabel}
                            duration={ev.duration}
                            color={ev.color}
                            trend={ev.trend as 'up' | 'down'}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
