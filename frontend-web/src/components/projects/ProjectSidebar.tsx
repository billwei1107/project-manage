import { Box, Typography } from '@mui/material';
import { KeyboardArrowDown, ChevronRight } from '@mui/icons-material';
import type { Project } from '../../api/projects';

interface ProjectSidebarProps {
    projects: Project[];
    activeProjectId: string;
    onSelectProject: (id: string) => void;
}

export default function ProjectSidebar({ projects, activeProjectId, onSelectProject }: ProjectSidebarProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', md: 265 },
                flexShrink: 0,
                bgcolor: 'white',
                borderRadius: '24px',
                boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 120px)' // Constrain height for sticky scrolling
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #E4E6E8' }}>
                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                    當前專案
                </Typography>
                <KeyboardArrowDown sx={{ color: '#0A1629' }} />
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
                {projects.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                        <Typography sx={{ color: '#91929E', fontSize: 14, fontFamily: 'Nunito Sans' }}>
                            沒有可用的專案
                        </Typography>
                    </Box>
                ) : (
                    projects.map((project) => {
                        const isActive = project.id === activeProjectId;

                        return (
                            <Box
                                key={project.id}
                                onClick={() => onSelectProject(project.id)}
                                sx={{
                                    position: 'relative',
                                    p: 2,
                                    mx: 1,
                                    my: 0.5,
                                    bgcolor: isActive ? '#F4F9FD' : 'transparent',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: isActive ? '#F4F9FD' : 'rgba(244, 249, 253, 0.5)',
                                    }
                                }}
                            >
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: -8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 4,
                                            height: '80%',
                                            bgcolor: '#3F8CFF',
                                            borderRadius: '2px'
                                        }}
                                    />
                                )}

                                <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                    {project.id.substring(0, 8)}
                                </Typography>
                                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: isActive ? 700 : 400 }}>
                                    {project.title}
                                </Typography>

                                {/* View details link for active row */}
                                {isActive && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Typography sx={{ color: '#3F8CFF', fontSize: 14, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                            查看詳情
                                        </Typography>
                                        <ChevronRight sx={{ color: '#3F8CFF', fontSize: 16 }} />
                                    </Box>
                                )}
                            </Box>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}
