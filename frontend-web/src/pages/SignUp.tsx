import { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    InputAdornment, 
    IconButton,
    Divider,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

/**
 * @file SignUp.tsx
 * @description Sign Up Page - Multi-Step Flow
 */

const StepperItem = ({ 
    status, 
    title, 
    isLast 
}: { 
    status: 'done' | 'active' | 'pending'; 
    title: string; 
    isLast?: boolean 
}) => {
    const isActive = status === 'active';
    const isDone = status === 'done';

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                <Box sx={{
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%',
                    border: '2px solid', 
                    borderColor: (isActive || isDone) ? 'white' : 'rgba(255,255,255,0.5)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: isDone ? 'white' : 'transparent',
                    mt: 0.5
                }}>
                    {isActive && <Box sx={{ width: 10, height: 10, bgcolor: 'white', borderRadius: '50%' }} />}
                    {isDone && <CheckIcon sx={{ color: '#3F8CFF', fontSize: 16, fontWeight: 'bold' }} />}
                </Box>
                {!isLast && (
                    <Box sx={{ 
                        width: 2, 
                        height: 40, 
                        bgcolor: (isActive || isDone) ? 'white' : 'rgba(255,255,255,0.5)', 
                        my: 0.5 
                    }} />
                )}
            </Box>
            <Typography sx={{ 
                color: 'white', 
                fontWeight: 600, 
                fontSize: 18, 
                fontFamily: 'Nunito Sans',
                opacity: (isActive || isDone) ? 1 : 0.5,
                pt: 0.2
            }}>
                {title}
            </Typography>
        </Box>
    );
};

export default function SignUp() {
    const [step, setStep] = useState(1);
    
    // Step 1 State
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Step 2 State
    const [useReason, setUseReason] = useState('Work');
    const [role, setRole] = useState('Business Owner');
    const [describe, setDescribe] = useState('Yes');

    // Step 3 State
    const [companyName, setCompanyName] = useState('');
    const [businessDirection, setBusinessDirection] = useState('IT and programming');
    const [teamSize, setTeamSize] = useState('41 - 50');

    // Step 4 State
    const [memberEmails, setMemberEmails] = useState<string[]>(['']);

    const handleAddMember = () => setMemberEmails([...memberEmails, '']);
    const handleMemberEmailChange = (index: number, value: string) => {
        const newEmails = [...memberEmails];
        newEmails[index] = value;
        setMemberEmails(newEmails);
    };

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
                    <StepperItem 
                        status={step > 1 ? 'done' : (step === 1 ? 'active' : 'pending')} 
                        title="Valid your phone" 
                    />
                    <StepperItem 
                        status={step > 2 ? 'done' : (step === 2 ? 'active' : 'pending')} 
                        title="Tell about yourself" 
                    />
                    <StepperItem 
                        status={step > 3 ? 'done' : (step === 3 ? 'active' : 'pending')} 
                        title="Tell about your company" 
                    />
                    <StepperItem 
                        status={step === 4 ? 'active' : 'pending'} 
                        title="Invite Team Members" 
                        isLast 
                    />
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
                <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    
                    {/* --- STEP 1 --- */}
                    {step === 1 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', textTransform: 'uppercase', mb: 1 }}>
                                    Step 1/4
                                </Typography>
                                <Typography sx={{ color: '#0A1629', fontSize: 28, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                    Valid your phone
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                    Mobile Number
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
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
                                            '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                        }
                                    }}
                                />
                            </Box>

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
                                            '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}

                    {/* --- STEP 2 --- */}
                    {step === 2 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', textTransform: 'uppercase', mb: 1 }}>
                                    Step 2/4
                                </Typography>
                                <Typography sx={{ color: '#0A1629', fontSize: 28, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                    Tell about yourself
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                    Why will you use the service?
                                </Typography>
                                <Select
                                    fullWidth
                                    value={useReason}
                                    onChange={(e) => setUseReason(e.target.value as string)}
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        borderRadius: '12px',
                                        fontFamily: 'Nunito Sans',
                                        fontWeight: 600,
                                        color: '#0A1629',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                    }}
                                >
                                    <MenuItem value="Work">Work</MenuItem>
                                    <MenuItem value="Personal">Personal</MenuItem>
                                </Select>
                            </Box>

                            <Box sx={{ mb: 6 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                    What describes you best?
                                </Typography>
                                <Select
                                    fullWidth
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as string)}
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        borderRadius: '12px',
                                        fontFamily: 'Nunito Sans',
                                        fontWeight: 600,
                                        color: '#0A1629',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                    }}
                                >
                                    <MenuItem value="Business Owner">Business Owner</MenuItem>
                                    <MenuItem value="Employee">Employee</MenuItem>
                                    <MenuItem value="Student">Student</MenuItem>
                                </Select>
                            </Box>

                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', width: 220 }}>
                                    What describes you best?
                                </Typography>
                                <RadioGroup
                                    row
                                    value={describe}
                                    onChange={(e) => setDescribe(e.target.value)}
                                >
                                    <FormControlLabel 
                                        value="Yes" 
                                        control={<Radio sx={{ '&.Mui-checked': { color: '#3F8CFF' } }} />} 
                                        label={<Typography sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, color: '#0A1629', fontSize: 16 }}>Yes</Typography>} 
                                        sx={{ mr: 4 }}
                                    />
                                    <FormControlLabel 
                                        value="No" 
                                        control={<Radio sx={{ '&.Mui-checked': { color: '#3F8CFF' } }} />} 
                                        label={<Typography sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, color: '#0A1629', fontSize: 16 }}>No</Typography>} 
                                    />
                                </RadioGroup>
                            </Box>
                        </>
                    )}

                    {/* --- STEP 3 --- */}
                    {step === 3 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', textTransform: 'uppercase', mb: 1 }}>
                                    Step 3/4
                                </Typography>
                                <Typography sx={{ color: '#0A1629', fontSize: 28, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                    Tell about your company
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                    Your Company's Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Company's Name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
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

                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                    Business Direction
                                </Typography>
                                <Select
                                    fullWidth
                                    value={businessDirection}
                                    onChange={(e) => setBusinessDirection(e.target.value as string)}
                                    IconComponent={KeyboardArrowDownIcon}
                                    sx={{
                                        borderRadius: '12px',
                                        fontFamily: 'Nunito Sans',
                                        fontWeight: 600,
                                        color: '#0A1629',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E6EDF5', borderWidth: '2px' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3F8CFF' },
                                        '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(63, 140, 255, 0.12)' },
                                    }}
                                >
                                    <MenuItem value="IT and programming">IT and programming</MenuItem>
                                    <MenuItem value="Finance">Finance</MenuItem>
                                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                    How many people in your team?
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                    {['Only me', '2 - 5', '6 - 10', '11 - 20', '21 - 40', '41 - 50', '51 - 100', '101 - 500'].map((size) => {
                                        const isSelected = teamSize === size;
                                        return (
                                            <Button
                                                key={size}
                                                variant={isSelected ? "contained" : "outlined"}
                                                onClick={() => setTeamSize(size)}
                                                sx={{
                                                    borderRadius: '10px',
                                                    textTransform: 'none',
                                                    fontFamily: 'Nunito Sans',
                                                    fontWeight: isSelected ? 700 : 600,
                                                    fontSize: 14,
                                                    px: 2,
                                                    py: 1,
                                                    minWidth: 80,
                                                    borderColor: isSelected ? 'transparent' : '#E6EDF5',
                                                    borderWidth: '2px',
                                                    color: isSelected ? 'white' : '#7D8592',
                                                    bgcolor: isSelected ? '#3F8CFF' : 'white',
                                                    boxShadow: isSelected ? '0px 6px 12px rgba(63, 140, 255, 0.26)' : 'none',
                                                    '&:hover': {
                                                        borderColor: '#3F8CFF',
                                                        borderWidth: '2px',
                                                        bgcolor: isSelected ? '#3377E6' : 'transparent',
                                                    }
                                                }}
                                            >
                                                {size}
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </>
                    )}

                    {/* --- STEP 4 --- */}
                    {step === 4 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', textTransform: 'uppercase', mb: 1 }}>
                                    Step 4/4
                                </Typography>
                                <Typography sx={{ color: '#0A1629', fontSize: 28, fontWeight: 800, fontFamily: 'Nunito Sans' }}>
                                    Invite Team Members
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                {memberEmails.map((email, index) => (
                                    <Box key={index} sx={{ mb: 3 }}>
                                        {index === 0 && (
                                            <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                                                Member's Email
                                            </Typography>
                                        )}
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder="memberemail@gmail.com"
                                            value={email}
                                            onChange={(e) => handleMemberEmailChange(index, e.target.value)}
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
                                ))}
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Button
                                    variant="text"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddMember}
                                    sx={{
                                        color: '#3F8CFF',
                                        fontSize: 14,
                                        fontWeight: 700,
                                        fontFamily: 'Nunito Sans',
                                        textTransform: 'none',
                                        p: 0,
                                        '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                                    }}
                                >
                                    Add another Member
                                </Button>
                            </Box>
                        </>
                    )}

                    {/* Action Area (Shared) */}
                    <Box sx={{ display: 'flex', mt: 'auto', justifyContent: 'space-between', alignItems: 'center', pt: 4 }}>
                        {step > 1 ? (
                            <Button
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setStep(s => s - 1)}
                                sx={{
                                    color: '#3F8CFF',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    fontFamily: 'Nunito Sans',
                                    textTransform: 'none',
                                    p: 1,
                                    '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                                }}
                            >
                                Previous
                            </Button>
                        ) : <Box />}

                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => setStep(s => s < 4 ? s + 1 : s)}
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
