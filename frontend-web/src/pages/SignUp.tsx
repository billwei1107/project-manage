import { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    InputAdornment, 
    IconButton,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * @file SignUp.tsx
 * @description Sign Up Page - Step 1
 */

const StepperItem = ({ 
    active, 
    title, 
    isLast 
}: { 
    active: boolean; 
    title: string; 
    isLast?: boolean 
}) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
            <Box sx={{
                width: 24, 
                height: 24, 
                borderRadius: '50%',
                border: '2px solid', 
                borderColor: active ? 'white' : 'rgba(255,255,255,0.5)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: 'transparent',
                mt: 0.5
            }}>
                {active && <Box sx={{ width: 10, height: 10, bgcolor: 'white', borderRadius: '50%' }} />}
            </Box>
            {!isLast && (
                <Box sx={{ 
                    width: 2, 
                    height: 40, 
                    bgcolor: active ? 'white' : 'rgba(255,255,255,0.5)', 
                    my: 0.5 
                }} />
            )}
        </Box>
        <Typography sx={{ 
            color: 'white', 
            fontWeight: 600, 
            fontSize: 18, 
            fontFamily: 'Nunito Sans',
            opacity: active ? 1 : 0.5,
            pt: 0.2
        }}>
            {title}
        </Typography>
    </Box>
);

export default function SignUp() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                width: '100%', 
                maxWidth: 1100, 
                minHeight: { xs: 'auto', md: 740 },
                bgcolor: 'white', 
                borderRadius: '32px', 
                overflow: 'hidden', 
                boxShadow: '0px 6px 58px rgba(196, 203, 214, 0.1)' 
            }}
        >
            {/* Left Side: Stepper Area */}
            <Box 
                sx={{ 
                    width: { xs: '100%', md: 360 }, 
                    bgcolor: '#3F8CFF', 
                    p: { xs: 4, md: 6, lg: 8 },
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}
            >
                {/* Logo Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 8 }}>
                    <Box sx={{
                        height: 48,
                        width: 48,
                        borderRadius: '12px',
                        bgcolor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{ width: 14, height: 20, bgcolor: '#3F8CFF', borderRadius: '4px', position: 'absolute', left: 12, top: 14 }} />
                        <Box sx={{ width: 6, height: 6, bgcolor: '#3F8CFF', borderRadius: '50%', position: 'absolute', right: 12, bottom: 14 }} />
                    </Box>
                </Box>

                <Typography sx={{ color: 'white', fontSize: 36, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 6 }}>
                    Get started
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <StepperItem active={true} title="Valid your phone" />
                    <StepperItem active={false} title="Tell about yourself" />
                    <StepperItem active={false} title="Tell about your company" />
                    <StepperItem active={false} title="Invite Team Members" isLast />
                </Box>
            </Box>

            {/* Right Side: Form Area */}
            <Box 
                sx={{ 
                    flex: 1, 
                    p: { xs: 4, md: 8, lg: 10 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    bgcolor: 'white',
                    position: 'relative'
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
                    
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', textTransform: 'uppercase', mb: 1 }}>
                            Step 1/4
                        </Typography>
                        <Typography sx={{ color: '#0A1629', fontSize: 28, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                            Valid your phone
                        </Typography>
                    </Box>

                    {/* Mobile Number Group */}
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                            Mobile Number
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Country Code Selector Dummy */}
                            <Box tabIndex={0} sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                px: 2, 
                                py: 1.5,
                                border: '2px solid #E6EDF5', 
                                borderRadius: '12px',
                                cursor: 'pointer',
                                outline: 'none',
                                '&:hover': { borderColor: '#3F8CFF' },
                                '&:focus': { borderColor: '#3F8CFF', boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' }
                            }}>
                                <Typography sx={{ color: '#7D8592', fontWeight: 700, fontFamily: 'Nunito Sans', mr: 1 }}>+1</Typography>
                                <KeyboardArrowDownIcon sx={{ color: '#7D8592', fontSize: 20 }} />
                            </Box>
                            
                            {/* Phone Input */}
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="345 567-23-56"
                                InputProps={{
                                    sx: { 
                                        borderRadius: '12px', 
                                        fontFamily: 'Nunito Sans',
                                        fontWeight: 600,
                                        '& fieldset': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                        '&:hover fieldset': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused fieldset': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Code from SMS Group */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                            Code from SMS
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4].map((item) => (
                                <TextField
                                    key={item}
                                    variant="outlined"
                                    placeholder={`${item}`}
                                    inputProps={{ style: { textAlign: 'center' }, maxLength: 1 }}
                                    sx={{ width: 64 }}
                                    InputProps={{
                                        sx: { 
                                            borderRadius: '12px', 
                                            fontFamily: 'Nunito Sans',
                                            fontWeight: 600,
                                            '& fieldset': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                            '&:hover fieldset': { borderColor: '#3F8CFF' },
                                            '&.Mui-focused fieldset': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Hint Box */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2.5, 
                        bgcolor: '#F4F9FD', 
                        borderRadius: '14px',
                        mb: 5
                    }}>
                        <InfoOutlinedIcon sx={{ color: '#3F8CFF', mr: 2 }} />
                        <Box>
                            <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans', lineHeight: 1.4 }}>
                                SMS was sent to your number +1 345 673-56-67
                            </Typography>
                            <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans', lineHeight: 1.4 }}>
                                It will be valid for 01:25
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 5, borderColor: '#E6EDF5' }} />

                    {/* Email Input */}
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="youremail@gmail.com"
                            InputProps={{
                                sx: { 
                                    borderRadius: '12px', 
                                    fontFamily: 'Nunito Sans',
                                    fontWeight: 600,
                                    '& fieldset': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                    '&:hover fieldset': { borderColor: '#3F8CFF' },
                                    '&.Mui-focused fieldset': { borderColor: '#3F8CFF' },
                                }
                            }}
                        />
                    </Box>

                    {/* Password Input */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                            Create Password
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ color: '#A0AABF' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { 
                                    borderRadius: '12px', 
                                    fontFamily: 'Nunito Sans',
                                    fontWeight: 800,
                                    letterSpacing: showPassword ? 'normal' : '0.2em',
                                    '& fieldset': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                    '&:hover fieldset': { borderColor: '#3F8CFF' },
                                    '&.Mui-focused fieldset': { borderColor: '#3F8CFF' },
                                }
                            }}
                        />
                    </Box>

                    {/* Action Area */}
                    <Box sx={{ display: 'flex', mt: 'auto', justifyContent: 'flex-end', pt: 4 }}>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                bgcolor: '#3F8CFF',
                                color: 'white',
                                borderRadius: '14px',
                                py: 1.5,
                                px: 4,
                                fontSize: 16,
                                fontWeight: 700,
                                fontFamily: 'Nunito Sans',
                                textTransform: 'none',
                                boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                                '&:hover': { bgcolor: '#3377E6' }
                            }}
                        >
                            Next Step
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
