import { createTheme, alpha } from '@mui/material/styles';

/**
 * @file theme.ts
 * @description Modern CRM Theme Configuration
 * @description_en Custom theme with glassmorphism, soft shadows, and vibrant colors
 * @description_zh 現代化 CRM 主題配置，包含玻璃擬態、柔和陰影與鮮豔配色
 */

// Color Palette
const PRIMARY = {
    main: '#2563EB', // Vibrant Blue
    light: '#60A5FA',
    dark: '#1E40AF',
    contrastText: '#ffffff',
};

const SECONDARY = {
    main: '#7C3AED', // Purple
    light: '#A78BFA',
    dark: '#5B21B6',
    contrastText: '#ffffff',
};

const SUCCESS = {
    main: '#10B981', // Emerald
    light: '#34D399',
    dark: '#059669',
};

const WARNING = {
    main: '#F59E0B', // Amber
    light: '#FBBF24',
    dark: '#D97706',
};

const ERROR = {
    main: '#EF4444', // Red
    light: '#F87171',
    dark: '#B91C1C',
};

const GREY = {
    0: '#FFFFFF',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
};

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: PRIMARY,
        secondary: SECONDARY,
        success: SUCCESS,
        warning: WARNING,
        error: ERROR,
        text: {
            primary: GREY[800],
            secondary: GREY[500],
            disabled: GREY[400],
        },
        background: {
            default: '#F9FAFB', // Very light grey
            paper: '#FFFFFF',
        },
        divider: alpha(GREY[500], 0.24),
        action: {
            active: GREY[600],
            hover: alpha(GREY[500], 0.08),
            selected: alpha(PRIMARY.main, 0.08),
            disabled: alpha(GREY[500], 0.8),
            disabledBackground: alpha(GREY[500], 0.24),
            focus: alpha(GREY[500], 0.24),
        },
    },
    typography: {
        fontFamily: "'Inter', 'Public Sans', sans-serif",
        h1: { fontWeight: 800, fontSize: '4rem' },
        h2: { fontWeight: 800, fontSize: '3rem' },
        h3: { fontWeight: 700, fontSize: '2.25rem' },
        h4: { fontWeight: 700, fontSize: '2rem' },
        h5: { fontWeight: 700, fontSize: '1.5rem' },
        h6: { fontWeight: 700, fontSize: '1.25rem' },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        body1: { fontSize: '1rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    },
    shape: {
        borderRadius: 16, // Larger border radius for modern feel
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box',
                },
                html: {
                    width: '100%',
                    height: '100%',
                    WebkitOverflowScrolling: 'touch',
                },
                body: {
                    width: '100%',
                    height: '100%',
                },
                '#root': {
                    width: '100%',
                    height: '100%',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                    borderRadius: 16,
                    position: 'relative',
                    zIndex: 0, // Fix stacking context
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    boxShadow: 'none',
                    fontWeight: 700,
                    borderRadius: 8,
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedInherit: {
                    color: GREY[800],
                    backgroundColor: GREY[200],
                    '&:hover': {
                        backgroundColor: GREY[300],
                    },
                },
                sizeLarge: {
                    height: 48,
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: `1px solid ${alpha(GREY[500], 0.12)}`,
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: `1px dashed ${alpha(GREY[500], 0.2)}`, // Modern dashed border
                    backgroundColor: '#FFFFFF',
                }
            }
        }
    },
});
