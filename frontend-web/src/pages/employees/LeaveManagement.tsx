import { Box, Typography, Paper, Alert } from '@mui/material';

/**
 * @file LeaveManagement.tsx
 * @description 員工請假系統 / Employee Leave Management
 * @description_en Page for submitting leave requests and tracking status
 * @description_zh 提供請假單填寫、歷史紀錄查詢的請假系統介面
 */
export default function LeaveManagement() {
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="600" color="primary.main" gutterBottom>
                請假系統 (Leave Management)
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                提出假單申請與查詢個人請假紀錄。
            </Typography>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 1 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    請假核准自動通知主管，並連動當月工時計算。
                </Alert>
                <Typography variant="body1" color="text.secondary">
                    // TODO: 建置假單送出表單 (Form) 與紀錄列表 (DataGrid/Table)。<br />
                    假別包含：[ANNUAL 特休, SICK 病假, PERSONAL 事假, COMPENSATORY 補休]。
                </Typography>
            </Paper>
        </Box>
    );
}
