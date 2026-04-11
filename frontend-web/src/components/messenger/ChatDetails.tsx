import { Box, Typography, IconButton, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

interface ChatDetailsProps {
    conversationName: string;
    onClose: () => void;
}

export default function ChatDetails({ conversationName, onClose }: ChatDetailsProps) {
    const [expanded, setExpanded] = useState<string | false>('Members');
    
    // Mock members explicitly matching the design
    const mockMembers = [
        { id: '1', name: 'Evan Yates (you)', avatar: 'https://placehold.co/40x40', isOnline: true },
        { id: '2', name: 'Blake Silva', avatar: 'https://placehold.co/40x40', isOnline: false },
        { id: '3', name: 'Olive Dixon', avatar: 'https://placehold.co/40x40', isOnline: false },
        { id: '4', name: 'Ellen Wong', avatar: 'https://placehold.co/40x40', isOnline: false },
        { id: '5', name: 'Lily Bradley', avatar: 'https://placehold.co/40x40', isOnline: false },
        { id: '6', name: 'Gerald Ingram', avatar: 'https://placehold.co/40x40', isOnline: false },
    ];

    const sections = [
        { title: 'Info', icon: <ErrorOutlineIcon fontSize="small" /> },
        { title: 'Members', icon: <PeopleAltOutlinedIcon fontSize="small" /> },
        { title: 'Media', icon: <ImageOutlinedIcon fontSize="small" /> },
        { title: 'Files', icon: <AttachFileIcon fontSize="small" /> },
        { title: 'Links', icon: <InsertLinkIcon fontSize="small" /> },
    ];

    return (
        <Box sx={{ 
            width: 320, 
            display: 'flex', 
            flexDirection: 'column', 
            bgcolor: 'white', 
            borderLeft: '1px solid #E6EBF5',
            height: '100%',
            overflowY: 'auto'
        }} className="custom-scrollbar">
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                px: 3, 
                py: 2.5,
                borderBottom: '1px solid #E6EBF5'
            }}>
                <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 16 }}>
                    Details
                </Typography>
                <IconButton 
                    onClick={onClose}
                    sx={{ 
                        border: '1px solid #E6EBF5', 
                        borderRadius: '10px', 
                        width: 32, 
                        height: 32 
                    }}
                >
                    <CloseIcon sx={{ fontSize: 16, color: '#0A1629' }} />
                </IconButton>
            </Box>

            {/* Profile Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, borderBottom: '1px solid #E6EBF5' }}>
                <Avatar 
                    sx={{ width: 80, height: 80, bgcolor: '#0AC947', mb: 2, fontSize: 32 }}
                    src={conversationName === 'Medical App Team' ? undefined : undefined} // Mock logic
                >
                    {conversationName.charAt(0)}
                </Avatar>
                <Typography sx={{ fontWeight: 700, color: '#0A1629', fontSize: 18, mb: 3 }}>
                    {conversationName}
                </Typography>
                
                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton sx={{ 
                        border: '1px solid #E6EBF5', 
                        borderRadius: '12px', 
                        width: 44, 
                        height: 44,
                        color: '#0A1629',
                        '&:hover': { bgcolor: '#F4F9FD' }
                    }}>
                        <SearchIcon fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ 
                        border: '1px solid #E6EBF5', 
                        borderRadius: '12px', 
                        width: 44, 
                        height: 44,
                        color: '#0A1629',
                        '&:hover': { bgcolor: '#F4F9FD' }
                    }}>
                        <PersonAddOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ 
                        border: '1px solid #E6EBF5', 
                        borderRadius: '12px', 
                        width: 44, 
                        height: 44,
                        color: '#0A1629',
                        '&:hover': { bgcolor: '#F4F9FD' }
                    }}>
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Accordion Sections */}
            <Box sx={{ py: 1 }}>
                {sections.map((sec, i) => {
                    const isExpanded = expanded === sec.title;
                    return (
                        <Accordion 
                            key={i} 
                            elevation={0}
                            disableGutters
                            expanded={isExpanded}
                            onChange={(_, isExp) => setExpanded(isExp ? sec.title : false)}
                            sx={{ 
                                '&:before': { display: 'none' },
                                bgcolor: 'transparent'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={isExpanded ? <KeyboardArrowUpIcon sx={{ color: '#0A1629' }} /> : <KeyboardArrowDownIcon sx={{ color: '#0A1629' }} />}
                                sx={{
                                    px: 3,
                                    minHeight: 56,
                                    '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2, m: 0 }
                                }}
                            >
                                <Box sx={{ 
                                    width: 36, 
                                    height: 36, 
                                    borderRadius: '10px', 
                                    bgcolor: '#F4F9FD', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#0A1629'
                                }}>
                                    {sec.icon}
                                </Box>
                                <Typography sx={{ fontWeight: 600, color: '#0A1629', fontSize: 16 }}>
                                    {sec.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pt: 0, pb: 2 }}>
                                {sec.title === 'Members' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                                        {mockMembers.map(member => (
                                            <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {member.isOnline ? (
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                        variant="dot"
                                                        sx={{
                                                            '& .MuiBadge-badge': {
                                                                backgroundColor: '#0AC947',
                                                                color: '#0AC947',
                                                                boxShadow: '0 0 0 2px white',
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius: '50%',
                                                            }
                                                        }}
                                                    >
                                                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#3F8CFF', fontSize: 12 }}>
                                                            {member.name.charAt(0)}
                                                        </Avatar>
                                                    </Badge>
                                                ) : (
                                                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#91929E', fontSize: 12 }}>
                                                        {member.name.charAt(0)}
                                                    </Avatar>
                                                )}
                                                <Typography sx={{ color: '#0A1629', fontSize: 15, fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                                                    {member.name}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography sx={{ color: '#7D8592', fontSize: 14 }}>
                                        No data available yet.
                                    </Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </Box>
    );
}
