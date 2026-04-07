import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, Button, IconButton, Select, MenuItem, FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

/**
 * @file ShareFolderModal.tsx
 * @description 分享資料夾彈窗 / Share Folder Modal
 * @description_en Modal dialog for sharing a folder with team members via email selection
 * @description_zh 透過 Email 選擇將資料夾分享給團隊成員的彈窗元件
 */

interface ShareFolderModalProps {
    open: boolean;
    onClose: () => void;
    folderTitle: string;
}

// ========================================
// 模擬成員清單 / Mock Members
// ========================================
const MOCK_MEMBERS = [
    'memberemail@gmail.com',
    'john.doe@company.com',
    'jane.smith@company.com',
    'alex.chen@company.com',
];

const ShareFolderModal: React.FC<ShareFolderModalProps> = ({ open, onClose }) => {
    const [members, setMembers] = useState<string[]>([MOCK_MEMBERS[0]]);

    // ========================================
    // 新增成員列 / Add Member Row
    // ========================================
    const handleAddMember = () => {
        setMembers(prev => [...prev, '']);
    };

    // ========================================
    // 更新指定列的成員 / Update Member at Index
    // ========================================
    const handleMemberChange = (index: number, value: string) => {
        setMembers(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    // ========================================
    // 分享處理 / Share Handler
    // ========================================
    const handleShare = () => {
        // TODO: 串接後端 API / Connect to backend API
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    p: 1,
                    boxShadow: '0px 20px 60px rgba(0,0,0,0.1)'
                }
            }}
        >
            {/* 標題列 / Title Row */}
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
                pt: 2,
                px: 3
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Nunito Sans', color: '#0A1629' }}>
                    Share the Folder
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#7D8592' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 1 }}>
                {/* 成員選擇區 / Member Selection */}
                {members.map((member, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        {index === 0 && (
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#7D8592', fontFamily: 'Nunito Sans', mb: 1 }}>
                                Select Member
                            </Typography>
                        )}
                        <FormControl fullWidth>
                            <Select
                                value={member}
                                onChange={(e) => handleMemberChange(index, e.target.value)}
                                displayEmpty
                                sx={{
                                    borderRadius: '12px',
                                    fontFamily: 'Nunito Sans',
                                    fontSize: 14,
                                    color: '#0A1629',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#E8ECF2'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3F8CFF'
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <Typography sx={{ color: '#A0AABF', fontFamily: 'Nunito Sans' }}>Select a member...</Typography>
                                </MenuItem>
                                {MOCK_MEMBERS.map(m => (
                                    <MenuItem key={m} value={m} sx={{ fontFamily: 'Nunito Sans', fontSize: 14 }}>
                                        {m}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                ))}

                {/* 新增成員按鈕 / Add Another Member */}
                <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddMember}
                    sx={{
                        textTransform: 'none',
                        color: '#3F8CFF',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 600,
                        fontSize: 14,
                        pl: 0,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    Add another Member
                </Button>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button
                    variant="contained"
                    onClick={handleShare}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        px: 4,
                        py: 1.2,
                        bgcolor: '#3F8CFF',
                        fontFamily: 'Nunito Sans',
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#3175E2', boxShadow: 'none' }
                    }}
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareFolderModal;
