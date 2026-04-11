import { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Alert, 
    CircularProgress, 
    InputAdornment, 
    IconButton, 
    Checkbox, 
    FormControlLabel,
    Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * @file Login.tsx
 * @description Login Page with modern split-card UI
 * @description_en Modern login UI matching the presentation design
 * @description_zh 依照 Figma 設計圖還原的現代化分割卡片登入介面
 */

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!loginId || !password) return;

        try {
            await login(loginId, password);
            navigate('/'); // Redirect to Dashboard on success
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                width: '100%', 
                maxWidth: 1100, 
                minHeight: { xs: 'auto', md: 680 },
                bgcolor: 'white', 
                borderRadius: '32px', 
                overflow: 'hidden', 
                boxShadow: '0px 24px 64px rgba(195, 203, 214, 0.4)' 
            }}
        >
            {/* Left Side: Hero Area */}
            <Box 
                sx={{ 
                    flex: 1, 
                    bgcolor: '#3F8CFF', 
                    p: { xs: 4, md: 8, lg: 10 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                {/* Logo Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                    <Box sx={{
                        height: 48,
                        width: 48,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4)',
                        mr: 2,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{ width: 14, height: 20, bgcolor: '#fff', borderRadius: '4px', position: 'absolute', left: 12, top: 14 }} />
                        <Box sx={{ width: 6, height: 6, bgcolor: '#fff', borderRadius: '50%', position: 'absolute', right: 12, bottom: 14 }} />
                    </Box>
                    <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 24, fontFamily: 'Nunito Sans' }}>
                        專案管理系統
                    </Typography>
                </Box>

                <Typography sx={{ color: 'white', fontSize: { xs: 32, md: 40, lg: 48 }, fontWeight: 800, fontFamily: 'Nunito Sans', lineHeight: 1.2, mb: 6 }}>
                    您的工作專屬空間<br/>
                    規劃。建立。掌控。
                </Typography>

                <Box 
                    component="img"
                    src="/illustrations/login-hero.png"
                    alt="Hero Illustration"
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        alignSelf: 'center',
                        display: 'block',
                        mt: 'auto',
                        borderRadius: '16px' // Optional: softly round our generated image if needed
                    }}
                />
            </Box>

            {/* Right Side: Login Form */}
            <Box 
                sx={{ 
                    flex: 1, 
                    p: { xs: 4, md: 8 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    bgcolor: 'white'
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 380 }}>
                    <Typography sx={{ color: '#0A1629', fontSize: 24, fontWeight: 800, fontFamily: 'Nunito Sans', mb: 5, textAlign: 'center' }}>
                        登入專案管理系統
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {/* Email Input */}
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                            電子郵件 (員工編號)
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="youremail@gmail.com"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            disabled={isLoading}
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
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ color: '#7D8592', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito Sans', mb: 1.5 }}>
                            密碼
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleLogin();
                            }}
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

                    {/* Form Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                        <FormControlLabel
                            control={<Checkbox defaultChecked sx={{ color: '#A0AABF', '&.Mui-checked': { color: '#0A1629' } }} />}
                            label={<Typography sx={{ color: '#7D8592', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans' }}>記住我</Typography>}
                        />
                        <Link href="#" underline="none" sx={{ color: '#A0AABF', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans', '&:hover': { color: '#3F8CFF' } }}>
                            忘記密碼？
                        </Link>
                    </Box>

                    {/* Sign In Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            disabled={isLoading}
                            onClick={handleLogin}
                            endIcon={!isLoading ? <ArrowForwardIcon /> : undefined}
                            sx={{
                                bgcolor: '#3F8CFF',
                                color: 'white',
                                borderRadius: '24px',
                                py: 1.5,
                                px: 5,
                                fontSize: 16,
                                fontWeight: 700,
                                fontFamily: 'Nunito Sans',
                                textTransform: 'none',
                                minWidth: 180,
                                boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                                mb: 3,
                                '&:hover': { bgcolor: '#3377E6' }
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : '登入'}
                        </Button>

                        <Link component="button" onClick={() => navigate('/signup')} underline="none" sx={{ color: '#3F8CFF', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', cursor: 'pointer' }}>
                            還沒有帳號？前往註冊
                        </Link>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
