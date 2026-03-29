import { createTheme, alpha } from '@mui/material/styles';

/**
 * @file theme.ts
 * @description Modern CRM Theme Configuration
 * @description_en Custom theme with glassmorphism, soft shadows, and vibrant colors
 * @description_zh 現代化 CRM 主題配置，包含玻璃擬態、柔和陰影與鮮豔配色
 */

// Color Palette
const PRIMARY = {
    main: '#3F8CFF', // Figma Blue
    light: '#B0D4FF',
    dark: '#233862',
    contrastText: '#ffffff',
};

const SECONDARY = {
    main: '#7D8592', // Greyish text color used as secondary
    light: '#EBF3FF',
    dark: '#434253',
    contrastText: '#ffffff',
};

const SUCCESS = {
    main: '#0AC947', // Figma Green
    light: '#A3E8B6',
    dark: '#078F32',
};

const WARNING = {
    main: '#FFBD21', // Figma Yellow
    light: '#FDC748',
    dark: '#E5B137',
};

const ERROR = {
    main: '#E78175', // Figma Red
    light: '#F3BFB9',
    dark: '#C95A4C',
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
            primary: '#0A1629',
            secondary: '#7D8592',
            disabled: '#91929E',
        },
        background: {
            default: '#F4F9FD', // Figma background
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
        fontFamily: "'Nunito Sans', 'Inter', 'Public Sans', sans-serif",
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
        borderRadius: 14, // Figma standard for cards
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box',
                },
                html: {
                    WebkitOverflowScrolling: 'touch',
                },
                body: {
                    minHeight: '100vh',
                    backgroundColor: '#F4F9FD',
                },
                '#root': {
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
                    borderRadius: 24,
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
                    borderRight: 'none', // Figma design doesn't have a border
                    boxShadow: '1px 0px 10px rgba(195, 203, 214, 0.15)', // Add subtle shadow instead
                    backgroundColor: '#FFFFFF',
                }
            }
        }
    },
});
