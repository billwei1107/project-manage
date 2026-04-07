import { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';

/**
 * @file AddRequestModal.tsx
 * @description 請假申請彈窗 / Add Request Modal
 * @description_en Modal for adding a new leave/vacation request with type, duration, and date picking.
 * @description_zh 用於新增請假的對話方塊，包含假別選擇、區間切換與日期挑選器。
 */

interface AddRequestModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddRequestModal({ open, onClose }: AddRequestModalProps) {
    const [requestType, setRequestType] = useState('Vacation');
    const [durationType, setDurationType] = useState('Days'); // Days or Hours

    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().date(16));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().date(18));

    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs().hour(9).minute(0));
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().hour(13).minute(0));

    let computedHours = 0;
    let computedMinutes = 0;
    if (startTime && endTime && endTime.isAfter(startTime)) {
        const diff = endTime.diff(startTime, 'minute');
        computedHours = Math.floor(diff / 60);
        computedMinutes = diff % 60;
    }

    const handleDateChange = (newValue: Dayjs | null) => {
        if (!newValue) return;

        if (durationType === 'Hours') {
            setStartDate(newValue);
            setEndDate(null);
            return;
        }

        if (!startDate || (startDate && endDate)) {
            setStartDate(newValue);
            setEndDate(null);
        } else {
            if (newValue.isBefore(startDate)) {
                setEndDate(startDate);
                setStartDate(newValue);
            } else {
                setEndDate(newValue);
            }
        }
    };

    const CustomDay = (props: PickersDayProps) => {
        const { day, outsideCurrentMonth, ...other } = props;
        const currentDay = day as unknown as Dayjs;

        // Base states
        let isRange = false;
        let isStart = false;
        let isEnd = false;
        let isBetween = false;

        if (!outsideCurrentMonth) {
            isStart = !!(startDate && currentDay.isSame(startDate, 'day'));

            if (durationType === 'Days') {
                isEnd = !!(endDate && currentDay.isSame(endDate, 'day'));
                isBetween = !!(startDate && endDate && currentDay.isAfter(startDate, 'day') && currentDay.isBefore(endDate, 'day'));
                isRange = isStart || isEnd || isBetween;
            } else {
                isRange = isStart;
            }
        }

        const isValidationError = requestType === 'Vacation' && durationType === 'Days' && startDate && endDate && endDate.diff(startDate, 'day') >= 3;
        const colorPrefix = requestType === 'Vacation' ? '#00C2FF' : requestType === 'Sick Leave' ? '#FF4D4F' : '#722ED1';

        let borderRadiusText = '50%';

        if (isRange) {
            if (startDate && endDate) {
                if (isStart) {
                    borderRadiusText = '16px 0 0 16px';
                } else if (isEnd) {
                    borderRadiusText = '0 16px 16px 0';
                } else if (isBetween) {
                    borderRadiusText = '0';
                }
            } else {
                borderRadiusText = '16px'; // Single day selected
            }
        }

        return (
            <Box sx={{
                height: 40,
                width: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
                bgcolor: (isRange && !isValidationError) ? colorPrefix : 'transparent',
                borderRadius: borderRadiusText,
                color: (isRange && !isValidationError) ? 'white' : (outsideCurrentMonth ? '#C3CBD6' : '#0A1629'),
                boxSizing: 'border-box',
                borderTop: (isValidationError && isRange) ? '1.5px solid #F65160' : 'none',
                borderBottom: (isValidationError && isRange) ? '1.5px solid #F65160' : 'none',
                borderLeft: (isValidationError && isStart) ? '1.5px solid #F65160' : 'none',
                borderRight: (isValidationError && isEnd) ? '1.5px solid #F65160' : 'none',
                position: 'relative'
            }}>
                {isStart && isValidationError && (
                    <Box sx={{
                        position: 'absolute',
                        bottom: '100%',
                        mb: 1.5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'white',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: '24px',
                        py: 1, px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderWidth: '6px',
                            borderStyle: 'solid',
                            borderColor: 'white transparent transparent transparent',
                        }
                    }}>
                        <InfoIcon sx={{ color: '#F65160', fontSize: 18 }} />
                        <Typography sx={{ color: '#F65160', fontFamily: 'Nunito Sans', fontSize: 13, fontWeight: 600 }}>
                            You have 3 days of Vacation left
                        </Typography>
                    </Box>
                )}
                <PickersDay
                    {...other}
                    outsideCurrentMonth={outsideCurrentMonth}
                    day={day}
                    disableRipple
                    sx={{
                        bgcolor: 'transparent !important',
                        color: 'inherit',
                        width: 36,
                        height: 36,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2) !important' }
                    }}
                />
            </Box>
        );
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
                bgcolor: 'white',
                borderRadius: '24px',
                p: { xs: 3, md: 5 },
                width: { xs: '90%', sm: 480 },
                boxShadow: '0px 24px 64px rgba(0,0,0,0.1)',
                outline: 'none',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>

                {/* Close Button */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute', top: 24, right: 24,
                        bgcolor: '#F4F9FD', borderRadius: '12px',
                        '&:hover': { bgcolor: '#E6EDF5' }
                    }}
                >
                    <CloseIcon sx={{ color: '#0A1629' }} />
                </IconButton>

                <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629', mb: 3 }}>
                    Add Request
                </Typography>

                {/* Request Type Selection */}
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', color: '#7D8592', mb: 2 }}>
                        Request Type
                    </Typography>
                    <RadioGroup
                        row
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        sx={{ gap: 2 }}
                    >
                        {['Vacation', 'Sick Leave', 'Work remotely'].map((type) => (
                            <FormControlLabel
                                key={type}
                                value={type}
                                control={
                                    <Radio
                                        sx={{
                                            color: '#D8E0F0',
                                            '&.Mui-checked': { color: '#3F8CFF' }
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: 14, fontWeight: requestType === type ? 700 : 400, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                                        {type}
                                    </Typography>
                                }
                                sx={{
                                    m: 0,
                                    flex: 1,
                                    border: `1px solid ${requestType === type ? '#3F8CFF' : '#D8E0F0'}`,
                                    borderRadius: '16px',
                                    py: 1,
                                    px: 2,
                                    transition: 'all 0.2s',
                                    justifyContent: 'flex-start',
                                    bgcolor: requestType === type ? 'rgba(63,140,255,0.02)' : 'transparent'
                                }}
                            />
                        ))}
                    </RadioGroup>
                </Box>

                {/* Duration Tabs */}
                <Box sx={{
                    display: 'flex', bgcolor: '#F4F9FD', borderRadius: '16px',
                    mb: 3
                }}>
                    {['Days', 'Hours'].map((tab) => {
                        const isActive = durationType === tab;
                        return (
                            <Box
                                key={tab}
                                onClick={() => {
                                    setDurationType(tab);
                                    if (tab === 'Hours') {
                                        setEndDate(null);
                                    }
                                }}
                                sx={{
                                    flex: 1, textAlign: 'center', py: 1.5,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    borderRadius: '16px',
                                    bgcolor: isActive ? '#3F8CFF' : 'transparent',
                                    color: isActive ? 'white' : '#7D8592',
                                    fontSize: 14, fontWeight: isActive ? 700 : 400,
                                    fontFamily: 'Nunito Sans'
                                }}
                            >
                                {tab}
                            </Box>
                        );
                    })}
                </Box>

                {/* Calendar Component */}
                <Box sx={{
                    border: '1px solid #D8E0F0', borderRadius: '16px', p: 1, mb: 4,
                    '& .MuiPickersCalendarHeader-root': {
                        justifyContent: 'center',
                        mb: 1
                    },
                    '& .MuiPickersCalendarHeader-label': {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#0A1629'
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                        color: '#C3CBD6',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        width: 40,
                        margin: 0
                    },
                    '& .MuiPickersDay-root': {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        width: 36,
                        height: 36,
                        m: 0
                    },
                    '& .MuiDayCalendar-slideTransition': {
                        minHeight: 250
                    }
                }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={startDate}
                            onChange={handleDateChange}
                            showDaysOutsideCurrentMonth
                            slots={{ day: CustomDay }}
                        />
                    </LocalizationProvider>
                </Box>

                {/* Time Selection for Hours Mode */}
                {durationType === 'Hours' && (
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', color: '#7D8592', mb: 1 }}>From</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        value={startTime}
                                        onChange={setStartTime}
                                        slotProps={{ textField: { fullWidth: true } }}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                borderColor: '#D8E0F0',
                                                '& fieldset': { borderColor: '#D8E0F0' },
                                                '&:hover fieldset': { borderColor: '#3F8CFF' },
                                                fontFamily: 'Nunito Sans'
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 400, fontFamily: 'Nunito Sans', color: '#7D8592', mb: 1 }}>To</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        value={endTime}
                                        onChange={setEndTime}
                                        slotProps={{ textField: { fullWidth: true } }}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                borderColor: '#D8E0F0',
                                                '& fieldset': { borderColor: '#D8E0F0' },
                                                '&:hover fieldset': { borderColor: '#3F8CFF' },
                                                fontFamily: 'Nunito Sans'
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>

                        <Box sx={{ bgcolor: 'rgba(63, 140, 255, 0.05)', borderRadius: '16px', py: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                                Time for {requestType}
                            </Typography>
                            <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: 'Nunito Sans', color: requestType === 'Vacation' ? '#00C2FF' : requestType === 'Sick Leave' ? '#FF4D4F' : '#722ED1' }}>
                                {computedHours}h {computedMinutes}m
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Footer Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton sx={{
                        bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44,
                        '&:hover': { bgcolor: '#E6EDF5' }
                    }}>
                        <ChatBubbleOutlineOutlinedIcon sx={{ color: '#0A1629', fontSize: 20 }} />
                    </IconButton>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#3F8CFF', color: 'white', borderRadius: '14px',
                            textTransform: 'none', px: 4, py: 1.5, fontSize: 14, fontWeight: 700,
                            fontFamily: 'Nunito Sans', boxShadow: '0px 6px 12px rgba(63,140,255,0.26)',
                            '&:hover': { bgcolor: '#3377E6' }
                        }}
                    >
                        Send Request
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
}
