import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Button, CircularProgress,
    Divider, LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface ShareInfo {
    directoryName: string;
    clientName: string;
    creatorName: string;
    expiresAt: string | null;
}

const PublicUploadPortal: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();
    const [info, setInfo] = useState<ShareInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await axios.get(`/api/v1/share-links/public/info/${tokenId}`);
                setInfo(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || '這個連結已失效或不存在。');
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, [tokenId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !tokenId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post(`/api/v1/share-links/public/upload/${tokenId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
            setSelectedFile(null);
        } catch (err: any) {
            alert('檔案上傳失敗：' + (err.response?.data?.message || '未知的錯誤'));
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !info) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                <Card sx={{ maxWidth: 400, textAlign: 'center', p: 4 }}>
                    <CloseIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" color="error" gutterBottom>連結無效</Typography>
                    <Typography color="text.secondary">{error}</Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', p: 2 }}>
            <Card sx={{ maxWidth: 500, width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                            上傳檔案至 {info.clientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            資料夾：{info.directoryName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                            此連結由 {info.creatorName} 提供
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {success ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                            <Typography variant="h6" color="success.main" gutterBottom>上傳成功！</Typography>
                            <Typography color="text.secondary" mb={3}>
                                您的檔案已成功傳送至安全資料夾。
                            </Typography>
                            <Button variant="outlined" onClick={() => setSuccess(false)}>
                                上傳另一個檔案
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Drag & Drop Area / File Input */}
                            <Box
                                sx={{
                                    border: '2px dashed',
                                    borderColor: selectedFile ? 'primary.main' : 'grey.300',
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: 'center',
                                    bgcolor: selectedFile ? 'primary.50' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <CloudUploadIcon sx={{ fontSize: 48, color: selectedFile ? 'primary.main' : 'grey.400', mb: 1 }} />
                                {selectedFile ? (
                                    <Box>
                                        <Typography fontWeight="bold" color="primary">{selectedFile.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Typography color="text.secondary" gutterBottom>
                                            點擊下方按鈕選擇檔案
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    disabled={uploading}
                                >
                                    {selectedFile ? '重新選取' : '選擇檔案'}
                                    <input type="file" hidden onChange={handleFileChange} />
                                </Button>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!selectedFile || uploading}
                                    onClick={handleUpload}
                                >
                                    {uploading ? '上傳中...' : '確認上傳'}
                                </Button>
                            </Box>

                            {uploading && <LinearProgress sx={{ mt: 1 }} />}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PublicUploadPortal;
