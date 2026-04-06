import { useState } from 'react';
import { 
    Modal, 
    Box, 
    Typography, 
    IconButton, 
    Button, 
    RadioGroup, 
    FormControlLabel, 
    Radio 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
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
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

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
                                onClick={() => setDurationType(tab)}
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
                        fontWeight: 700
                    },
                    '& .MuiPickersDay-root': {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        color: '#0A1629'
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                        bgcolor: '#3F8CFF !important',
                        color: 'white',
                        borderRadius: '12px'
                    }
                }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar 
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            showDaysOutsideCurrentMonth
                        />
                    </LocalizationProvider>
                </Box>

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
