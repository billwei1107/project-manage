import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CampaignIcon from '@mui/icons-material/Campaign';

import ClientFileExplorer from '../../components/infoportal/ClientFileExplorer';
import AnnouncementList from '../../components/infoportal/AnnouncementList';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`info-portal-tabpanel-${index}`}
            aria-labelledby={`info-portal-tab-${index}`}
            {...other}
            style={{ height: 'calc(100% - 48px)', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
        >
            {value === index && (
                <Box sx={{ flex: 1, p: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const InfoPortal: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', px: 2 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="info portal tabs">
                    <Tab icon={<FolderSharedIcon />} iconPosition="start" label="客戶資訊與檔案" />
                    <Tab icon={<CampaignIcon />} iconPosition="start" label="系統公告與指南" />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <ClientFileExplorer />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <AnnouncementList />
            </TabPanel>
        </Box>
    );
};

export default InfoPortal;
