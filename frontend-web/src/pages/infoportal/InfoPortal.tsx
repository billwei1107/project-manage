import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

/**
 * @file InfoPortal.tsx
 * @description 資訊大廳 / Info Portal Dashboard
 * @description_en Landing dashboard for projects and documents.
 * @description_zh 提供專案資料夾的管理與狀態總覽介面
 */

const MiniChart = () => (
    <svg width="70" height="30" viewBox="0 0 70 30" style={{ overflow: 'visible' }}>
        <path
            d="M 2 25 Q 12 15 22 20 T 42 12 T 68 2"
            fill="none"
            stroke="#22C55E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const folders = [
    { title: 'Medical App', pages: 5, color: '#FBBF24' },
    { title: 'Fortune website', pages: 8, color: '#22C55E' },
    { title: 'Planner App', pages: 2, color: '#3B82F6' },
    { title: 'Time tracker - personal...', pages: 5, color: '#8B5CF6' }
];

const InfoPortal: React.FC = () => {
    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'transparent',
            p: { xs: 2, md: 3 },
            gap: 4
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans' }}>
                    Info Portal
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        bgcolor: '#3F8CFF',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#3175E2',
                            boxShadow: 'none'
                        }
                    }}
                >
                    Add Folder
                </Button>
            </Box>

            {/* Hero & Stats Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{
                        borderRadius: '24px',
                        boxShadow: '0px 12px 32px rgba(0,0,0,0.03)',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 }, pr: { md: '250px' }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 2 }}>
                                Your project data warehouse
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#7D8592', fontFamily: 'Nunito Sans', maxWidth: '400px', lineHeight: 1.6 }}>
                                Add project data, create thematic pages, edit data, share information with team members
                            </Typography>
                        </CardContent>
                        {/* Illustration Container */}
                        <Box sx={{
                            position: 'absolute',
                            right: { xs: -50, md: 20 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 280,
                            height: 180,
                            display: { xs: 'none', sm: 'block' },
                            backgroundImage: 'url(/hero_illustration.png)', // Placeholder path, can be replaced by actual asset
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center right'
                        }} />
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        borderRadius: '24px',
                        boxShadow: '0px 12px 32px rgba(0,0,0,0.03)',
                        height: '100%'
                    }}>
                        <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans', fontWeight: 600, mb: 1, fontSize: 13 }}>
                                Current Projects
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="h2" sx={{ fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans', lineHeight: 1 }}>
                                        10
                                    </Typography>
                                    <Typography sx={{ color: '#22C55E', fontFamily: 'Nunito Sans', fontWeight: 700, mt: 1, fontSize: 14 }}>
                                        Growth +3
                                    </Typography>
                                </Box>
                                <Box sx={{ mr: 2 }}>
                                    <MiniChart />
                                </Box>
                            </Box>

                            <Box sx={{ mt: 'auto' }}>
                                <Typography sx={{ color: '#A0AABF', fontFamily: 'Nunito Sans', fontSize: 12 }}>
                                    Ongoing projects last month - 7
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Folders Grid */}
            <Grid container spacing={3}>
                {folders.map((folder, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card sx={{
                            borderRadius: '24px',
                            boxShadow: '0px 12px 32px rgba(0,0,0,0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0px 16px 40px rgba(0,0,0,0.08)',
                            }
                        }}>
                            <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                                <FolderRoundedIcon sx={{ fontSize: 48, color: folder.color, mb: 3 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 0.5, fontSize: 17 }} noWrap>
                                    {folder.title}
                                </Typography>
                                <Typography sx={{ color: '#A0AABF', fontFamily: 'Nunito Sans', fontSize: 13 }}>
                                    {folder.pages} pages
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InfoPortal;
