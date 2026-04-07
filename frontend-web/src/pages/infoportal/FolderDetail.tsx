import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, IconButton, List, ListItemButton,
    ListItemText, Card, CardContent, Fab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

/**
 * @file FolderDetail.tsx
 * @description 資料夾詳細頁面 / Folder Detail Page
 * @description_en Displays pages list sidebar and rich-text content viewer for a specific folder
 * @description_zh 展示特定資料夾內的頁面列表側邊欄與富文本內容檢視器
 */

// ========================================
// 靜態模擬資料 / Mock Data
// ========================================
interface FolderPage {
    id: string;
    title: string;
    lastModified: string;
    content: React.ReactNode;
}

interface FolderData {
    id: string;
    title: string;
    pages: FolderPage[];
}

const MOCK_FOLDERS: Record<string, FolderData> = {
    'medical-app': {
        id: 'medical-app',
        title: 'Medical App',
        pages: [
            {
                id: 'p1', title: 'Technical task', lastModified: 'Sep 12, 2020',
                content: (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                            Requirements for website design
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8, mb: 3 }}>
                            When developing the site, predominantly light styles should be used. The main sections of the site should be
                            accessible from the first page. The first page should not contain a lot of text information.
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8, mb: 3 }}>
                            The site design should not include:<br />
                            - flashing banners;<br />
                            - a lot of merging text.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                            Requirements for site presentation
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8, mb: 3 }}>
                            Requirements for the presentation of the main page of the site. The main page of the site must contain a
                            graphic part, a navigation menu of the site, as well as a content area so that a site visitor from the first page
                            can receive introductory information about the company, as well as get acquainted with the latest news of
                            the company.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                            Access sharing requirements
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8 }}>
                            All published sections of the site must be open for read access without user authentication.
                            When an unauthenticated user tries to enter a private section, a login and password must be requested.
                            After passing the authentication, the system must check the user's authority to access the requested
                            partition. If access is denied, a message should be displayed to the user about the inability to access the
                            private section.
                        </Typography>
                    </Box>
                )
            },
            { id: 'p2', title: 'Project Specification', lastModified: 'Sep 24, 2020', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Project specification content placeholder.</Typography> },
            { id: 'p3', title: 'Customer Requirements', lastModified: 'Oct 8, 2020', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Customer requirements content placeholder.</Typography> },
            { id: 'p4', title: 'Work Process', lastModified: 'today', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Work process content placeholder.</Typography> },
            { id: 'p5', title: 'Reports', lastModified: 'Nov 10, 2020', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Reports content placeholder.</Typography> },
        ]
    },
    'fortune-website': {
        id: 'fortune-website',
        title: 'Fortune website',
        pages: [
            { id: 'p1', title: 'Overview', lastModified: 'today', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Fortune website overview.</Typography> },
        ]
    },
    'planner-app': {
        id: 'planner-app',
        title: 'Planner App',
        pages: [
            { id: 'p1', title: 'Overview', lastModified: 'today', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Planner App overview.</Typography> },
        ]
    },
    'time-tracker': {
        id: 'time-tracker',
        title: 'Time tracker - personal account',
        pages: [
            {
                id: 'p1', title: 'Technical task', lastModified: 'Sep 12, 2020',
                content: (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                            Requirements for website design
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8, mb: 3 }}>
                            When developing the site, predominantly light styles should be used. The main sections of the site should be
                            accessible from the first page. The first page should not contain a lot of text information.
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8, mb: 3 }}>
                            The site design should not include:<br />
                            - flashing banners;<br />
                            - a lot of merging text.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                            Requirements for site presentation
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8, mb: 3 }}>
                            Requirements for the presentation of the main page of the site. The main page of the site must contain a
                            graphic part, a navigation menu of the site, as well as a content area so that a site visitor from the first page
                            can receive introductory information about the company, as well as get acquainted with the latest news of
                            the company.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                            Access sharing requirements
                        </Typography>
                        <Typography sx={{ color: '#4E5D78', fontFamily: 'Nunito Sans', lineHeight: 1.8 }}>
                            All published sections of the site must be open for read access without user authentication.
                            When an unauthenticated user tries to enter a private section, a login and password must be requested.
                            After passing the authentication, the system must check the user's authority to access the requested
                            partition. If access is denied, a message should be displayed to the user about the inability to access the
                            private section.
                        </Typography>
                    </Box>
                )
            },
            { id: 'p2', title: 'Project Specification', lastModified: 'Sep 24, 2020', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Project specification details.</Typography> },
            { id: 'p3', title: 'Customer Requirements', lastModified: 'Oct 8, 2020', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Customer requirements details.</Typography> },
            { id: 'p4', title: 'Work Process', lastModified: 'today', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Work process details.</Typography> },
            { id: 'p5', title: 'Reports', lastModified: 'Nov 10, 2020', content: <Typography sx={{ color: '#7D8592', fontFamily: 'Nunito Sans' }}>Reports details.</Typography> },
        ]
    }
};

// ========================================
// 主元件 / Main Component
// ========================================
const FolderDetail: React.FC = () => {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const folder = MOCK_FOLDERS[folderId || ''] || MOCK_FOLDERS['time-tracker'];
    const [activePageId, setActivePageId] = useState(folder.pages[0]?.id || '');

    const activePage = folder.pages.find(p => p.id === activePageId) || folder.pages[0];

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'transparent',
            p: { xs: 2, md: 3 },
            gap: 2
        }}>
            {/* ======================================== */}
            {/* 頁首區域 / Header Area */}
            {/* ======================================== */}
            <Box>
                {/* 返回連結 / Breadcrumb */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/info-portal')}
                    sx={{
                        textTransform: 'none',
                        color: '#3F8CFF',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 14,
                        mb: 1,
                        pl: 0,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    Back to Info Portal
                </Button>

                {/* 標題與按鈕 / Title & Action */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0A1629', fontFamily: 'Nunito Sans' }}>
                        {folder.title}
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
                            '&:hover': { bgcolor: '#3175E2', boxShadow: 'none' }
                        }}
                    >
                        Add Folder
                    </Button>
                </Box>
            </Box>

            {/* ======================================== */}
            {/* 主內容區域 / Main Content Area */}
            {/* ======================================== */}
            <Box sx={{ display: 'flex', gap: 3, flex: 1, minHeight: 0 }}>

                {/* 左側頁面列表 / Pages Sidebar */}
                <Card sx={{
                    width: 280,
                    minWidth: 280,
                    borderRadius: '20px',
                    boxShadow: '0px 6px 24px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 0 } }}>
                        {/* 側邊欄標題 / Sidebar Header */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2.5,
                            py: 2
                        }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0A1629', fontFamily: 'Nunito Sans' }}>
                                Pages
                            </Typography>
                            <Fab
                                size="small"
                                sx={{
                                    bgcolor: '#3F8CFF',
                                    color: '#fff',
                                    width: 32,
                                    height: 32,
                                    minHeight: 32,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#3175E2' }
                                }}
                            >
                                <AddIcon sx={{ fontSize: 18 }} />
                            </Fab>
                        </Box>

                        {/* 頁面清單 / Page List */}
                        <List sx={{ flex: 1, overflow: 'auto', px: 0 }}>
                            {folder.pages.map(page => {
                                const isActive = page.id === activePageId;
                                return (
                                    <ListItemButton
                                        key={page.id}
                                        selected={isActive}
                                        onClick={() => setActivePageId(page.id)}
                                        sx={{
                                            py: 1.5,
                                            px: 2.5,
                                            borderLeft: isActive ? '3px solid #3F8CFF' : '3px solid transparent',
                                            bgcolor: isActive ? '#F0F6FF' : 'transparent',
                                            '&:hover': { bgcolor: isActive ? '#F0F6FF' : '#FAFBFC' },
                                            '&.Mui-selected': {
                                                bgcolor: '#F0F6FF',
                                                '&:hover': { bgcolor: '#F0F6FF' }
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={page.title}
                                            secondary={`Last modified ${page.lastModified}`}
                                            primaryTypographyProps={{
                                                fontWeight: isActive ? 700 : 600,
                                                fontSize: 14,
                                                color: '#0A1629',
                                                fontFamily: 'Nunito Sans'
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: 12,
                                                color: '#7D8592',
                                                fontFamily: 'Nunito Sans',
                                                mt: 0.3
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </CardContent>
                </Card>

                {/* 右側內容檢視器 / Content Viewer */}
                <Card sx={{
                    flex: 1,
                    borderRadius: '20px',
                    boxShadow: '0px 6px 24px rgba(0,0,0,0.04)',
                    overflow: 'auto'
                }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        {/* 內容標題列 / Content Header */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4,
                            pb: 2,
                            borderBottom: '1px solid #F0F2F5'
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0A1629', fontFamily: 'Nunito Sans' }}>
                                {activePage?.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <IconButton sx={{ color: '#7D8592', border: '1px solid #E8ECF2', borderRadius: '10px', width: 40, height: 40 }}>
                                    <EditOutlinedIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                                <Button
                                    variant="outlined"
                                    startIcon={<ShareOutlinedIcon />}
                                    sx={{
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        color: '#0A1629',
                                        borderColor: '#E8ECF2',
                                        fontFamily: 'Nunito Sans',
                                        fontWeight: 600,
                                        px: 2.5,
                                        '&:hover': { borderColor: '#3F8CFF', bgcolor: '#F0F6FF' }
                                    }}
                                >
                                    Share
                                </Button>
                            </Box>
                        </Box>

                        {/* 富文本內容 / Rich Text Content */}
                        {activePage?.content}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default FolderDetail;
