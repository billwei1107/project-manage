import {
    Box,
    Grid,
    Paper,
    Typography,
    Avatar,
    IconButton,
    LinearProgress,
    Chip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
    TrendingUp,
    TrendingDown,
    MoreVert,
    AccessTime,
    CheckCircleOutline
} from '@mui/icons-material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

/**
 * @file Dashboard.tsx
 * @description Modern CRM Dashboard
 * @description_en Dashboard with stats, charts, and activity feed
 * @description_zh 現代化 CRM 儀表板，包含統計數據、圖表與活動動態
 */

// Mock Data for Charts
const REVENUE_DATA = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4000 },
    { name: 'Sep', value: 3000 },
    { name: 'Oct', value: 2000 },
    { name: 'Nov', value: 2780 },
    { name: 'Dec', value: 3890 },
];

const ACTIVITY_DATA = [
    { id: 1, user: 'Alice', action: '建立了新專案', target: '行銷活動', time: '2 小時前', avatar: 'A' },
    { id: 2, user: 'Bob', action: '留言於', target: 'Logo 設計', time: '4 小時前', avatar: 'B' },
    { id: 3, user: 'Charlie', action: '完成了任務', target: '線框圖繪製', time: '5 小時前', avatar: 'C' },
    { id: 4, user: 'David', action: '上傳了檔案至', target: '伺服器設定', time: '1 天前', avatar: 'D' },
];

export default function Dashboard() {
    const theme = useTheme();

    const StatCard = ({ title, value, trend, percent, color, icon }: any) => (
        <Paper
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha('#FFFFFF', 0.4)} 100%)`,
                border: `1px solid ${alpha(color, 0.2)}`,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {value}
                    </Typography>
                </Box>
                <Avatar
                    sx={{
                        bgcolor: alpha(color, 0.2),
                        color: color,
                        width: 48,
                        height: 48,
                        borderRadius: 3
                    }}
                >
                    {icon}
                </Avatar>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                {trend === 'up' ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
                ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
                )}
                <Typography
                    variant="body2"
                    sx={{
                        color: trend === 'up' ? 'success.main' : 'error.main',
                        fontWeight: 700
                    }}
                >
                    {percent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    與上月相比
                </Typography>
            </Box>
        </Paper>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    總覽
                </Typography>
                <Chip label="過去 30 天" sx={{ bgcolor: 'white', fontWeight: 600 }} />
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="活躍專案總數"
                        value="12"
                        trend="up"
                        percent="+2.6%"
                        color={theme.palette.primary.main}
                        icon={<FolderIcon />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="總營收"
                        value="$48,200"
                        trend="up"
                        percent="+12.4%"
                        color={theme.palette.success.main}
                        icon={<MonetizationOnIcon />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="已完成任務"
                        value="340"
                        trend="down"
                        percent="-0.5%"
                        color={theme.palette.warning.main}
                        icon={<CheckCircleOutline />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="團隊效率"
                        value="92%"
                        trend="up"
                        percent="+5%"
                        color={theme.palette.secondary.main}
                        icon={<AccessTime />}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Revenue Chart */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 3, height: 440 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>營收分析</Typography>
                            <IconButton size="small"><MoreVert /></IconButton>
                        </Box>
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: theme.shadows[3]
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={theme.palette.primary.main}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Recent Activity */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, height: 440, overflow: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>近期活動</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {ACTIVITY_DATA.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.light, color: 'white', fontWeight: 700 }}>
                                            {item.avatar}
                                        </Avatar>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: -4,
                                                width: 12,
                                                height: 12,
                                                bgcolor: 'success.main',
                                                borderRadius: '50%',
                                                border: '2px solid white'
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                            {item.user} <Typography component="span" variant="body2" color="text.secondary">{item.action}</Typography> {item.target}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            {item.time}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                                專案進度
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight={600}>Marketing Site</Typography>
                                    <Typography variant="caption" fontWeight={600}>75%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={75} color="primary" sx={{ height: 6, borderRadius: 3 }} />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight={600}>Mobile App</Typography>
                                    <Typography variant="caption" fontWeight={600}>32%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={32} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// Additional icons for stats
function FolderIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
        </svg>
    )
}

function MonetizationOnIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.32-3.49h2.13c.25 1.1 1.13 1.77 2.44 1.77 1.51 0 2.54-.8 2.54-1.84 0-.85-.45-1.54-2.29-1.96-2.29-.62-3.83-1.63-3.83-3.77 0-1.66 1.15-3.08 3.12-3.48V3h2.67v1.63c1.37.28 2.65 1.19 3.06 2.94h-2.18c-.37-.92-1.37-1.48-2.31-1.48-1.28 0-2.17.73-2.17 1.6 0 .7.49 1.25 2.11 1.63 2.56.71 4.01 1.68 4.01 3.93 0 1.83-1.35 3.29-3.31 3.47z" />
        </svg>
    )
}
