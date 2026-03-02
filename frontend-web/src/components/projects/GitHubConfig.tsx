import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
} from '@mui/material';
import { GitHub, Backup, Save, Add, Download } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { projectApi } from '../../api/projects';
import type { Project } from '../../api/projects';

/**
 * @file GitHubConfig.tsx
 * @description GitHub 與備份配置組件 / GitHub & Backup Config Component
 * @description_en Handles GH repo connection, branch selection, and backup settings
 * @description_zh 處理 GitHub 儲存庫連結、分支選擇與備份路徑設定
 */

interface GitHubConfigProps {
    project: Project;
    onUpdate: (updatedProject: Project) => void;
}

export const GitHubConfig = ({ project, onUpdate }: GitHubConfigProps) => {
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form states
    const [githubRepo, setGithubRepo] = useState(project.githubRepo || '');
    const [githubBranch, setGithubBranch] = useState(project.githubBranch || '');
    const [backupConfig, setBackupConfig] = useState(project.backupConfig || '');
    const [fileLocation, setFileLocation] = useState(project.fileLocation || '');

    // Create Branch Dialog states
    const [openBranchDialog, setOpenBranchDialog] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [sourceBranch, setSourceBranch] = useState('main');

    useEffect(() => {
        if (githubRepo && githubRepo.includes('/')) {
            fetchBranches();
        }
    }, [githubRepo]);

    const fetchBranches = async () => {
        const [owner, repo] = githubRepo.split('/');
        try {
            const res = await projectApi.githubGetBranches(owner, repo);
            if (res.success) {
                setBranches(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch branches", err);
        }
    };

    const handleSaveConfig = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const updated = await projectApi.updateProject(project.id, {
                title: project.title,
                client: project.client,
                budget: project.budget,
                startDate: project.startDate,
                endDate: project.endDate,
                status: project.status,
                description: project.description,
                githubRepo,
                githubBranch,
                backupConfig,
                fileLocation
            } as any);
            onUpdate(updated.data);
            setSuccess("設定已成功儲存");
        } catch (err: any) {
            setError(err.response?.data?.message || "儲存失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBranch = async () => {
        setLoading(true);
        setOpenBranchDialog(false);
        setError(null);
        try {
            const [owner, repo] = githubRepo.split('/');
            const res = await projectApi.githubCreateBranch({
                owner,
                repo,
                newBranch: newBranchName,
                sourceBranch: sourceBranch || 'main'
            });
            if (res.success) {
                setSuccess(`分支建立成功: ${newBranchName}`);
                setGithubBranch(newBranchName);
                fetchBranches();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "建立分支失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!githubRepo || !githubBranch) {
            setError("請確認已設定儲存庫與分支");
            return;
        }
        setLoading(true);
        try {
            const [owner, repo] = githubRepo.split('/');
            const blob = await projectApi.githubDownloadRepo(owner, repo, githubBranch);

            // Create Blob URL and trigger download
            const url = window.URL.createObjectURL(blob as any);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${repo}-${githubBranch}.zip`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setSuccess("下載已開始");
        } catch (err: any) {
            console.error("Download failed", err);
            setError("下載失敗，請聯繫管理員確認系統 GitHub 配置");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GitHub sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="h6">GitHub 儲存庫設定</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        系統將自動透過組織憑證管理此專案的庫
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="GitHub 儲存庫 (owner/repo)"
                            placeholder="例如: bill-project-manage-system/erp"
                            value={githubRepo}
                            onChange={(e) => setGithubRepo(e.target.value)}
                            disabled={loading}
                            helperText="輸入完整的 Owner/Repo 來綁定現有倉庫"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                select
                                label="預設分支"
                                value={githubBranch}
                                onChange={(e) => setGithubBranch(e.target.value)}
                                disabled={loading || branches.length === 0}
                                helperText={branches.length === 0 ? "輸入正確的儲存庫名稱以載入分支" : ""}
                            >
                                {branches.map((branch) => (
                                    <MenuItem key={branch} value={branch}>
                                        {branch}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Tooltip title="建立新分支">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSourceBranch(githubBranch || 'main');
                                        setOpenBranchDialog(true);
                                    }}
                                    disabled={loading || !githubRepo}
                                    sx={{ minWidth: 'auto', px: 2 }}
                                >
                                    <Add />
                                </Button>
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="檔案存放位置 (File Location)"
                            placeholder="/app/projects/code"
                            value={fileLocation}
                            onChange={(e) => setFileLocation(e.target.value)}
                            disabled={loading}
                            helperText={!fileLocation ? `預設路徑: /app/uploads/${project.id}` : "自定義檔案存放路徑"}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={handleDownload}
                            disabled={loading || !githubBranch}
                        >
                            下載原始碼 (Download Source)
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Backup sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6">備份設定</Typography>
                </Box>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="備份路徑或配置 (YAML/JSON)"
                    placeholder="例如: &#10;/data/db_backup&#10;/app/logs"
                    value={backupConfig}
                    onChange={(e) => setBackupConfig(e.target.value)}
                    disabled={loading}
                />
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    onClick={handleSaveConfig}
                    disabled={loading}
                >
                    儲存配置
                </Button>
            </Box>

            {/* Create Branch Dialog */}
            <Dialog open={openBranchDialog} onClose={() => setOpenBranchDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>建立新分支</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="新分支名稱"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        fullWidth
                        label="來源分支 (Source)"
                        value={sourceBranch}
                        onChange={(e) => setSourceBranch(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBranchDialog(false)}>取消</Button>
                    <Button onClick={handleCreateBranch} variant="contained" disabled={!newBranchName}>
                        確認建立
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
