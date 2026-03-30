import { Dialog, DialogContent, DialogTitle, Typography, Button, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    open: boolean;
    onClose: () => void;
    onApprove: () => void;
}

export default function ApproveTaskModal({ open, onClose, onApprove }: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableScrollLock
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    boxShadow: '0px 6px 58px rgba(121, 144, 173, 0.20)',
                    width: '100%',
                    maxWidth: 584,
                    m: 2
                }
            }}
        >
            <DialogTitle sx={{ pt: 4, pb: 0, px: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
                    Are you sure you are claiming this task?
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 24, top: 24, bgcolor: '#F4F9FD', borderRadius: '14px', width: 44, height: 44 }}
                >
                    <CloseIcon sx={{ color: '#0A1629' }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: { xs: 4, sm: 7 }, pb: 5, pt: 3 }}>
                <Box
                    component="img"
                    src="/illustrations/approve_task.png"
                    alt="Approve Task Illustration"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: '24px',
                        display: 'block',
                        mx: 'auto',
                        mb: 4
                    }}
                />

                <Typography sx={{ color: '#0A1629', fontSize: 16, fontFamily: 'Nunito Sans', mb: 4, opacity: 0.7, lineHeight: 1.5 }}>
                    The task will be moved to the Completed section and will be closed.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={onApprove}
                        sx={{
                            bgcolor: '#3F8CFF',
                            borderRadius: '14px',
                            textTransform: 'none',
                            fontFamily: 'Nunito Sans',
                            fontWeight: 700,
                            fontSize: 16,
                            px: 4,
                            py: 1.5,
                            minWidth: 141,
                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                            '&:hover': { bgcolor: '#2b73eb' }
                        }}
                    >
                        Approve Task
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
