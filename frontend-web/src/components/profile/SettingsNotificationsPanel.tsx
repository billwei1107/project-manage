import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    Checkbox
} from '@mui/material';

const SettingsNotificationsPanel: React.FC = () => {
    const [issueActivity, setIssueActivity] = useState(true);
    const [trackingActivity, setTrackingActivity] = useState(false);
    const [newComments, setNewComments] = useState(false);
    const [dontSendAfter9, setDontSendAfter9] = useState(true);

    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: '24px',
            boxShadow: '0px 6px 58px rgba(195.86, 203.28, 214.36, 0.10)',
            flex: 1,
            p: { xs: 3, md: 4 },
            minHeight: '100%'
        }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 3 }}>
                Notifications
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {/* Issue Activity */}
                <Card sx={{
                    borderRadius: '16px',
                    boxShadow: 'none',
                    bgcolor: '#F4F9FD',
                    border: '1px solid transparent'
                }}>
                    <CardContent sx={{ p: '20px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                Issue Activity
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: '#7D8592', fontFamily: 'Nunito Sans' }}>
                                Send me email notifications for issue activity
                            </Typography>
                        </Box>
                        <Switch
                            checked={issueActivity}
                            onChange={(e) => setIssueActivity(e.target.checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#3F8CFF',
                                    '& + .MuiSwitch-track': {
                                        backgroundColor: '#3F8CFF',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Tracking Activity */}
                <Card sx={{
                    borderRadius: '16px',
                    boxShadow: 'none',
                    bgcolor: '#F8FAFC',
                    border: '1px solid transparent'
                }}>
                    <CardContent sx={{ p: '20px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                Tracking Activity
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: '#7D8592', fontFamily: 'Nunito Sans' }}>
                                Send me notifications when someone've tracked time in tasks
                            </Typography>
                        </Box>
                        <Switch
                            checked={trackingActivity}
                            onChange={(e) => setTrackingActivity(e.target.checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#3F8CFF',
                                    '& + .MuiSwitch-track': {
                                        backgroundColor: '#3F8CFF',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* New Comments */}
                <Card sx={{
                    borderRadius: '16px',
                    boxShadow: 'none',
                    bgcolor: '#F8FAFC',
                    border: '1px solid transparent'
                }}>
                    <CardContent sx={{ p: '20px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#0A1629', fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                New Comments
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: '#7D8592', fontFamily: 'Nunito Sans' }}>
                                Send me notifications when someone've sent the comment
                            </Typography>
                        </Box>
                        <Switch
                            checked={newComments}
                            onChange={(e) => setNewComments(e.target.checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#3F8CFF',
                                    '& + .MuiSwitch-track': {
                                        backgroundColor: '#3F8CFF',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            </Box>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={dontSendAfter9}
                        onChange={(e) => setDontSendAfter9(e.target.checked)}
                        sx={{
                            color: '#7D8592',
                            '&.Mui-checked': { color: '#3F8CFF' },
                        }}
                    />
                }
                label={
                    <Typography sx={{ fontSize: 14, color: '#0A1629', fontFamily: 'Nunito Sans', fontWeight: 600 }}>
                        Don't send me notifications after 9:00 PM
                    </Typography>
                }
                sx={{ m: 0 }}
            />
        </Box>
    );
};

export default SettingsNotificationsPanel;
