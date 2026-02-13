import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    Folder,
    NavigateNext,
    Description
} from '@mui/icons-material';
import { projectApi } from '../../api/projects';
import type { Project } from '../../api/projects';

interface ProjectFilesProps {
    project: Project;
}

interface GitHubContent {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size: number;
    html_url: string;
    download_url: string;
}

export const ProjectFiles = ({ project }: ProjectFilesProps) => {
    const [contents, setContents] = useState<GitHubContent[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<{ name: string, path: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (project.githubRepo && project.githubToken) {
            fetchContents('');
        }
    }, [project.githubRepo, project.githubToken]);

    const fetchContents = async (path: string) => {
        setLoading(true);
        setError(null);
        try {
            const [owner, repo] = (project.githubRepo || '').split('/');
            if (!owner || !repo || !project.githubToken) {
                return;
            }

            const res = await projectApi.githubGetContents(project.githubToken, owner, repo, path);
            // API returns array on success, or object on error/single file
            if (res.success && Array.isArray(res.data)) {
                // Sort: folders first, then files
                const sorted = res.data.sort((a, b) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name);
                    return a.type === 'dir' ? -1 : 1;
                });
                setContents(sorted);
                updateBreadcrumbs(path);
            } else {
                setContents([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch GitHub contents", err);
            setError("無法讀取 GitHub 儲存庫內容，請確認 Token 權限與儲存庫設定。");
        } finally {
            setLoading(false);
        }
    };

    const updateBreadcrumbs = (path: string) => {
        const parts = path.split('/').filter(p => p);
        const crumbs = [{ name: project.githubRepo || 'Root', path: '' }];
        let current = '';
        parts.forEach(part => {
            current += (current ? '/' : '') + part;
            crumbs.push({ name: part, path: current });
        });
        setBreadcrumbs(crumbs);
    };

    const handleNavigate = (path: string) => {
        fetchContents(path);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (!project.githubRepo) {
        return (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    尚未連結 GitHub 儲存庫
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    請至「GitHub 設定」頁面連結儲存庫以瀏覽檔案。
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return isLast ? (
                            <Typography key={crumb.path} color="text.primary">
                                {crumb.name}
                            </Typography>
                        ) : (
                            <Link
                                key={crumb.path}
                                underline="hover"
                                color="inherit"
                                onClick={() => handleNavigate(crumb.path)}
                                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                {crumb.name}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell>名稱</TableCell>
                            <TableCell align="right">大小</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : contents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                                    <Box sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                        <Typography>目錄為空或無法讀取</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            contents.map((item) => (
                                <TableRow
                                    key={item.path}
                                    hover
                                    sx={{ cursor: item.type === 'dir' ? 'pointer' : 'default' }}
                                    onClick={() => item.type === 'dir' && handleNavigate(item.path)}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {item.type === 'dir' ? (
                                                <Folder sx={{ mr: 2, color: 'primary.main' }} />
                                            ) : (
                                                <Description sx={{ mr: 2, color: 'action.active' }} />
                                            )}
                                            {item.type === 'dir' ? (
                                                <Typography variant="body2" fontWeight="500">
                                                    {item.name}
                                                </Typography>
                                            ) : (
                                                <Link
                                                    href={item.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                    color="text.primary"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" color="text.secondary">
                                            {item.type === 'file' ? formatSize(item.size) : '-'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
