import React, { useEffect, useState } from 'react';
import {
    Box, Typography, List, ListItem, ListItemText, ListItemButton,
    Divider, IconButton, Breadcrumbs, Link, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Menu, MenuItem, Grid, Card, CardContent
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useInfoPortalStore } from '../../stores/useInfoPortalStore';
import axios from 'axios';

const ClientFileExplorer: React.FC = () => {
    const store = useInfoPortalStore();

    useEffect(() => {
        store.fetchClients();
    }, []);

    const handleClientSelect = (client: any) => {
        store.setActiveClient(client);
    };

    // --- Directory Actions ---
    const [newDirDialogOpen, setNewDirDialogOpen] = useState(false);
    const [newDirName, setNewDirName] = useState('');

    const handleCreateDir = () => {
        if (!store.activeClient || !newDirName.trim()) return;
        const parentId = store.activeDirectoryHistory.length > 0
            ? store.activeDirectoryHistory[store.activeDirectoryHistory.length - 1].id
            : null;

        store.createDirectory(store.activeClient.id, parentId, newDirName);
        setNewDirDialogOpen(false);
        setNewDirName('');
    };

    // --- File Upload ---
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const currentDir = store.activeDirectoryHistory.length > 0
            ? store.activeDirectoryHistory[store.activeDirectoryHistory.length - 1]
            : null;

        if (currentDir) {
            store.uploadFile(currentDir.id, file);
        } else {
            alert('請先進入一個具體的資料夾再上傳檔案。');
        }
        event.target.value = ''; // Reset input
    };

    // --- Image Preview ---
    const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

    const handleFileClick = (file: any) => {
        if (file.mimeType.startsWith('image/')) {
            setPreviewImgUrl(`/api/v1/files/download/${file.id}`);
        } else {
            window.open(`/api/v1/files/download/${file.id}`, '_blank');
        }
    };

    // --- Context Menu for Directory/File ---
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<{ type: 'dir' | 'file', item: any } | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any, type: 'dir' | 'file') => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedItem({ type, item });
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        if (window.confirm(`確定要刪除 ${selectedItem.item.name || selectedItem.item.originalName} 嗎？`)) {
            if (selectedItem.type === 'dir') {
                store.deleteDirectory(selectedItem.item.id);
            } else {
                store.deleteFile(selectedItem.item.id);
            }
        }
        handleMenuClose();
    };

    // --- Share Link ---
    const [shareUrl, setShareUrl] = useState<string>('');
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    const handleShare = async () => {
        if (selectedItem?.type !== 'dir') return;
        try {
            const res = await axios.post('/api/v1/share-links', {
                directoryId: selectedItem.item.id,
                expireDays: 7
            });
            const link = `${window.location.origin}/public/upload/${res.data.id}`;
            setShareUrl(link);
            setShareDialogOpen(true);
        } catch (error) {
            console.error('Share error', error);
            alert('產生分享連結失敗');
        }
        handleMenuClose();
    };

    const copyShareUrl = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('連結已複製！');
    };

    // --- Client Creation ---
    const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
    const [newClientData, setNewClientData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    const handleCreateClient = async () => {
        if (!newClientData.name.trim()) return;
        try {
            await store.createClient(newClientData);
            setNewClientDialogOpen(false);
            setNewClientData({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });
        } catch (error) {
            alert('客戶建立失敗，請重試。');
        }
    };

    return (
        <Box sx={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
            {/* Left Sidebar: Clients List */}
            <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>客戶清單</Typography>
                    <IconButton size="small" color="primary" onClick={() => setNewClientDialogOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {store.clients.map(c => (
                        <ListItem disablePadding key={c.id}>
                            <ListItemButton
                                selected={store.activeClient?.id === c.id}
                                onClick={() => handleClientSelect(c)}
                            >
                                <ListItemText primary={c.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Main Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', overflow: 'hidden' }}>
                {!store.activeClient ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">請選擇左側客戶以查看檔案</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Top: Client Info & Toolbar */}
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>{store.activeClient.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        聯絡人: {store.activeClient.contactPerson} | 電話: {store.activeClient.phone}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CreateNewFolderIcon />}
                                        onClick={() => setNewDirDialogOpen(true)}
                                    >
                                        新增資料夾
                                    </Button>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        disabled={store.activeDirectoryHistory.length === 0} // Only allow upload in specific folder (or root if we adjust logic, but forcing a folder is safer)
                                    >
                                        上傳檔案
                                        <input type="file" hidden onChange={handleFileUpload} />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Breadcrumbs */}
                        <Box sx={{ px: 3, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
                            <Breadcrumbs>
                                <Link
                                    component="button"
                                    variant="body1"
                                    onClick={() => store.navigateToBreadcrumb(-1)}
                                    color={store.activeDirectoryHistory.length === 0 ? "text.primary" : "inherit"}
                                >
                                    根目錄
                                </Link>
                                {store.activeDirectoryHistory.map((dir, idx) => {
                                    const isLast = idx === store.activeDirectoryHistory.length - 1;
                                    return (
                                        <Link
                                            key={dir.id}
                                            component="button"
                                            variant="body1"
                                            onClick={() => !isLast && store.navigateToBreadcrumb(idx)}
                                            color={isLast ? "text.primary" : "inherit"}
                                        >
                                            {dir.name}
                                        </Link>
                                    )
                                })}
                            </Breadcrumbs>
                        </Box>

                        {/* File Grid */}
                        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                            <Grid container spacing={2}>
                                {/* Folders */}
                                {store.directories.map(dir => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`dir-${dir.id}`}>
                                        <Card
                                            variant="outlined"
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                            onClick={() => store.enterDirectory(dir)}
                                        >
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                                                <FolderIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                    <Typography noWrap fontWeight="bold">{dir.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">資料夾</Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, dir, 'dir')}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* Files */}
                                {store.files.map(file => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`file-${file.id}`}>
                                        <Card
                                            variant="outlined"
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                            onClick={() => handleFileClick(file)}
                                        >
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                                                {file.mimeType.startsWith('image/') ? (
                                                    <ImageIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                                                ) : file.mimeType.includes('pdf') ? (
                                                    <PictureAsPdfIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                                                ) : (
                                                    <InsertDriveFileIcon color="action" sx={{ mr: 2, fontSize: 40 }} />
                                                )}
                                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                    <Typography noWrap fontWeight="500">{file.originalName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(file.fileSize / 1024).toFixed(1)} KB
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMenuOpen(e, file, 'file');
                                                    }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}

                                {store.directories.length === 0 && store.files.length === 0 && (
                                    <Box sx={{ width: '100%', py: 10, textAlign: 'center' }}>
                                        <Typography color="text.secondary">此資料夾目前為空</Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Box>
                    </>
                )}
            </Box>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedItem?.type === 'dir' && (
                    <MenuItem onClick={handleShare}>
                        <ShareIcon sx={{ mr: 1, fontSize: 20 }} /> 建立外部分享連結
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>刪除</MenuItem>
            </Menu>

            {/* New Directory Dialog */}
            <Dialog open={newDirDialogOpen} onClose={() => setNewDirDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>新增資料夾</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="資料夾名稱"
                        fullWidth
                        variant="outlined"
                        value={newDirName}
                        onChange={(e) => setNewDirName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateDir()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewDirDialogOpen(false)}>取消</Button>
                    <Button onClick={handleCreateDir} variant="contained" disabled={!newDirName.trim()}>建立</Button>
                </DialogActions>
            </Dialog>

            {/* Share Link Dialog */}
            <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>資料夾分享連結</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        請將以下連結提供給客戶，客戶不需登入即可上傳檔案至此資料夾：
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={shareUrl}
                        InputProps={{ readOnly: true }}
                        sx={{ mt: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        預設有效期限為 7 天
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>關閉</Button>
                    <Button onClick={copyShareUrl} variant="contained">複製連結</Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Modal */}
            <Dialog
                open={!!previewImgUrl}
                onClose={() => setPreviewImgUrl(null)}
                maxWidth="lg"
            >
                <Box sx={{ position: 'relative', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, minHeight: 300 }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setPreviewImgUrl(null)}
                    >
                        <CloseIcon />
                    </IconButton>
                    {previewImgUrl && (
                        <img
                            src={previewImgUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                        />
                    )}
                </Box>
            </Dialog>

            {/* New Client Dialog */}
            <Dialog open={newClientDialogOpen} onClose={() => setNewClientDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>新增客戶</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="客戶名稱 *"
                        fullWidth
                        value={newClientData.name}
                        onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                    />
                    <TextField
                        label="聯絡人"
                        fullWidth
                        value={newClientData.contactPerson}
                        onChange={(e) => setNewClientData({ ...newClientData, contactPerson: e.target.value })}
                    />
                    <TextField
                        label="聯絡電話"
                        fullWidth
                        value={newClientData.phone}
                        onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        type="email"
                        value={newClientData.email}
                        onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                    />
                    <TextField
                        label="公司地址"
                        fullWidth
                        value={newClientData.address}
                        onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                    />
                    <TextField
                        label="備註"
                        fullWidth
                        multiline
                        rows={3}
                        value={newClientData.notes}
                        onChange={(e) => setNewClientData({ ...newClientData, notes: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewClientDialogOpen(false)}>取消</Button>
                    <Button
                        onClick={handleCreateClient}
                        variant="contained"
                        disabled={!newClientData.name.trim()}
                    >
                        建立
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientFileExplorer;
