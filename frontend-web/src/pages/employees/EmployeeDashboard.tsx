import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Button,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OutputIcon from '@mui/icons-material/Output';
import DateRangeIcon from '@mui/icons-material/DateRange';
import axiosInstance from '../../api/axios';
import { useAuthStore } from '../../stores/useAuthStore';

/**
 * @file EmployeeDashboard.tsx
 * @description 員工出勤管理系統 / Employee Dashboard (Attendance & Leave)
 * @description_en Central hub for HR tracking, check-ins, and leave requests mapping to Backend APIs
 * @description_zh 提供給員工使用的統一人事儀表板，支援上下班打卡與出勤總覽
 */

interface AttendanceRecord {
    id: string;
    checkInTime: string;
    checkOutTime: string | null;
    workDate: string;
    status: 'PRESENT' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT';
    workHours: number | null;
}

export default function EmployeeDashboard() {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(false);
    const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null);

    // Update digital clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Check today's attendance status
    const fetchTodayAttendance = async () => {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;

            // In a real scenario, API should ideally support fetching exactly today's record. 
            // Here we reuse getMyMonthlyAttendance and filter today.
            const response = await axiosInstance.get(`/hr/attendance/my?year=${year}&month=${month}`);
            const records: AttendanceRecord[] = response.data;
            const todayStr = today.toISOString().split('T')[0];

            const recordToday = records.find(r => r.workDate === todayStr);
            setAttendanceRecord(recordToday || null);
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        }
    };

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/hr/attendance/check-in');
            setAttendanceRecord(response.data);
            alert('上班打卡成功！');
        } catch (error: any) {
            alert(error.response?.data?.message || '打卡失敗，可能已經打卡過了');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/hr/attendance/check-out');
            setAttendanceRecord(response.data);
            alert('下班打卡成功！');
        } catch (error: any) {
            alert(error.response?.data?.message || '打卡失敗，可能已經下班過了或未打上班卡');
        } finally {
            setLoading(false);
        }
    };

    const isCheckedIn = !!attendanceRecord?.checkInTime;
    const isCheckedOut = !!attendanceRecord?.checkOutTime;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="600" color="primary.main" gutterBottom>
                員工管理 (HR Management)
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                管理上下班打卡、請假紀錄與工時計算 / Manage clock-ins, leave requests, and working hours
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                {/* Clock-in Area */}
                <Box sx={{ flex: 5 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                目前時間 Current Time
                            </Typography>
                            <Typography variant="h2" fontWeight="700" color="primary.main" sx={{ my: 3 }}>
                                {currentTime.toLocaleTimeString('zh-TW', { hour12: false })}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                {currentTime.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            {attendanceRecord && (
                                <Box sx={{ mb: 3, textAlign: 'left', bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" color="text.secondary">今日狀態:</Typography>
                                        <Chip
                                            label={attendanceRecord.status}
                                            color={attendanceRecord.status === 'LATE' ? 'warning' : 'success'}
                                            size="small"
                                        />
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="body2" color="text.secondary">上班時間:</Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            {attendanceRecord.checkInTime ? new Date(attendanceRecord.checkInTime).toLocaleTimeString() : '--:--:--'}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">下班時間:</Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            {attendanceRecord.checkOutTime ? new Date(attendanceRecord.checkOutTime).toLocaleTimeString() : '--:--:--'}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}

                            <Stack spacing={2} direction="row" justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<AccessTimeIcon />}
                                    onClick={handleCheckIn}
                                    disabled={loading || isCheckedIn}
                                    sx={{ minWidth: 140, py: 1.5, borderRadius: 2 }}
                                >
                                    上班打卡
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    startIcon={<OutputIcon />}
                                    onClick={handleCheckOut}
                                    disabled={loading || !isCheckedIn || isCheckedOut}
                                    sx={{ minWidth: 140, py: 1.5, borderRadius: 2 }}
                                >
                                    下班打卡
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>

                {/* Dashboard Stats / Navigation */}
                <Box sx={{ flex: 7 }}>
                    <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                            <Box sx={{ flex: 1 }}>
                                <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                        <DateRangeIcon color="primary" fontSize="large" />
                                        <Typography variant="h6">本月出勤</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        統計本月累積工時、遲到次數。
                                    </Typography>
                                    {/* Future component for MonthlyStats */}
                                </Paper>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                    <Typography variant="h6" mb={2}>請假系統 (Leaves)</Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        線上申請特休、病假、事假，與查詢簽核進度。
                                    </Typography>
                                    <Button variant="text" size="small">前往請假</Button>
                                </Paper>
                            </Box>
                        </Stack>

                        {user?.role === 'ADMIN' && (
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.50' }}>
                                <Typography variant="h6" color="primary.dark" mb={1}>管理員視角 (Admin Tools)</Typography>
                                <Stack direction="row" spacing={2} mt={2}>
                                    <Button variant="contained" size="small" disableElevation>審核請假 (3 筆待核)</Button>
                                    <Button variant="outlined" size="small">員工清單</Button>
                                </Stack>
                            </Paper>
                        )}
                    </Stack>
                </Box>

            </Stack>
        </Box>
    );
}
