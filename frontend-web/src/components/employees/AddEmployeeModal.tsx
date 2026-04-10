import { useState } from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    TextField,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

/**
 * @file AddEmployeeModal.tsx
 * @description 員工新增彈出視窗組件 / Add Employee Modal
 */

interface AddEmployeeModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddEmployeeModal({ open, onClose }: AddEmployeeModalProps) {
    const [email, setEmail] = useState('');

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '520px',
                    p: 4.5,
                    m: 2,
                    boxShadow: '0px 24px 64px rgba(0, 0, 0, 0.08)'
                }
            }}
            BackdropProps={{
                sx: { backgroundColor: 'rgba(10, 22, 41, 0.4)', backdropFilter: 'blur(4px)' }
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                    Add Employee
                </Typography>
                <IconButton 
                    onClick={onClose}
                    sx={{ bgcolor: '#F4F9FD', borderRadius: '12px', width: 40, height: 40, '&:hover': { bgcolor: '#E6EDF5' } }}
                >
                    <CloseIcon sx={{ color: '#0A1629', fontSize: 20 }} />
                </IconButton>
            </Box>

            {/* Illustration */}
            <Box sx={{ 
                width: '100%', 
                height: 200, 
                borderRadius: '16px', 
                overflow: 'hidden', 
                mb: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#F4F9FD'
            }}>
                <img 
                    src="/illustrations/add-employee.png" 
                    alt="Add Employee Illustration" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            </Box>

            {/* Form */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                <Typography sx={{ color: '#A0AABF', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    Member's Email
                </Typography>
                <TextField
                    placeholder="memberemail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            fontFamily: 'Nunito Sans',
                            fontWeight: 600,
                            color: '#0A1629',
                            '& fieldset': { borderColor: '#E6EDF5', borderWidth: 1 },
                            '&:hover fieldset': { borderColor: '#A0AABF' },
                            '&.Mui-focused fieldset': { borderColor: '#3F8CFF', borderWidth: 2 },
                        },
                        '& .MuiOutlinedInput-input::placeholder': {
                            color: '#A0AABF',
                            opacity: 1
                        }
                    }}
                />
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                    startIcon={<AddIcon />} 
                    sx={{ 
                        color: '#3F8CFF', 
                        textTransform: 'none', 
                        fontSize: 14, 
                        fontWeight: 700, 
                        fontFamily: 'Nunito Sans',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    Add another Member
                </Button>
                <Button 
                    variant="contained" 
                    onClick={onClose}
                    sx={{ 
                        bgcolor: '#3F8CFF', 
                        color: 'white', 
                        borderRadius: '12px', 
                        textTransform: 'none', 
                        px: 4, 
                        py: 1.5,
                        fontSize: 15, 
                        fontWeight: 700, 
                        fontFamily: 'Nunito Sans', 
                        boxShadow: '0px 4px 12px rgba(63, 140, 255, 0.3)',
                        '&:hover': { bgcolor: '#3377E6' }
                    }}
                >
                    Approve
                </Button>
            </Box>

        </Dialog>
    );
}
