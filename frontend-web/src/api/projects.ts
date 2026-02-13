import api from './axios';
import type { ProjectStatus, Task } from '../types/project';

// DTO types mirroring Backend requests
export interface CreateProjectRequest {
    title: string;
    client: string;
    budget: number;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    description: string;
    teamIds?: string[];
    githubToken?: string;
    fileLocation?: string;
}

export interface CreateTaskRequest {
    title: string;
    status: Task['status'];
    projectId: string;
    assigneeId?: string;
    orderIndex?: number;
}

export interface UpdateTaskRequest {
    title?: string;
    status?: Task['status'];
    assigneeId?: string;
    orderIndex?: number;
}

// Export Project type with GitHub fields
export interface Project {
    id: string;
    title: string;
    client: string;
    budget: number;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    progress: number;
    description: string;
    team: any[]; // Extended as needed
    githubRepo?: string;
    githubBranch?: string;
    backupConfig?: string;
    githubToken?: string;
    fileLocation?: string;
    createdAt: string;
    updatedAt: string;
}

// API Functions
export const projectApi = {
    getProjects: async (): Promise<ApiResponse<Project[]>> => {
        const response = await api.get<ApiResponse<Project[]>>('/v1/projects');
        return response.data;
    },

    getProject: async (id: string): Promise<ApiResponse<Project>> => {
        const response = await api.get<ApiResponse<Project>>(`/v1/projects/${id}`);
        return response.data;
    },

    createProject: async (data: CreateProjectRequest): Promise<ApiResponse<Project>> => {
        const response = await api.post<ApiResponse<Project>>('/v1/projects', data);
        return response.data;
    },

    updateProject: async (id: string, data: Partial<CreateProjectRequest>): Promise<ApiResponse<Project>> => {
        const response = await api.put<ApiResponse<Project>>(`/v1/projects/${id}`, data);
        return response.data;
    },

    deleteProject: async (id: string): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/v1/projects/${id}`);
        return response.data;
    },

    // --- Task APIs ---
    getTasks: async (projectId: string): Promise<Task[]> => {
        const response = await api.get<Task[]>(`/v1/projects/${projectId}/tasks`);
        return response.data;
    },

    createTask: async (data: CreateTaskRequest): Promise<Task> => {
        const response = await api.post<Task>('/v1/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
        const response = await api.put<Task>(`/v1/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/v1/tasks/${id}`);
    },

    // --- GitHub Integration ---
    // --- GitHub Integration ---
    githubCreateRepo: async (data: { token: string, name: string, description: string, private: boolean }) => {
        const response = await api.post<ApiResponse<string>>('/v1/github/repos', data);
        return response.data;
    },

    githubGetBranches: async (token: string, owner: string, repo: string) => {
        const response = await api.get<ApiResponse<string[]>>(`/v1/github/repos/${owner}/${repo}/branches`, {
            params: { token }
        });
        return response.data;
    },

    githubGetMe: async (token: string): Promise<ApiResponse<string>> => {
        const response = await api.get<ApiResponse<string>>('/v1/github/me', {
            params: { token }
        });
        return response.data;
    },

    githubCheckRepoExists: async (token: string, owner: string, repo: string) => {
        const response = await api.get<ApiResponse<boolean>>(`/v1/github/repos/${owner}/${repo}/exists`, {
            params: { token }
        });
        return response.data;
    },

    githubCreateBranch: async (data: { token: string, owner: string, repo: string, newBranch: string, sourceBranch: string }) => {
        const response = await api.post<ApiResponse<string>>(`/v1/github/repos/${data.owner}/${data.repo}/branches`, {
            token: data.token,
            newBranch: data.newBranch,
            sourceBranch: data.sourceBranch
        });
        return response.data;
    },

    githubGetDownloadUrl: async (token: string, owner: string, repo: string, branch: string) => {
        const response = await api.get<ApiResponse<string>>(`/v1/github/repos/${owner}/${repo}/download`, {
            params: { token, branch }
        });
        return response.data;
    },

    githubGetContents: async (token: string, owner: string, repo: string, path?: string) => {
        const response = await api.get<ApiResponse<any[]>>(`/v1/github/repos/${owner}/${repo}/contents`, {
            params: { token, path }
        });
        return response.data;
    },

    // --- File Management ---
    uploadFiles: async (
        projectId: string,
        files: FileList | File[],
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<string[]>> => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            const path = (file as any).webkitRelativePath || file.name;
            formData.append('files', file, path);
        });

        const response = await api.post<ApiResponse<string[]>>(`/v1/projects/${projectId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            }
        });
        return response.data;
    },

    getFiles: async (projectId: string) => {
        const response = await api.get<ApiResponse<string[]>>(`/v1/projects/${projectId}/files`);
        return response.data;
    },

    getFileDownloadUrl: (projectId: string, fileName: string) => {
        return `${api.defaults.baseURL}/v1/projects/${projectId}/files/download?fileName=${encodeURIComponent(fileName)}`;
    },

    deleteFile: async (projectId: string, fileName: string) => {
        const response = await api.delete<ApiResponse<void>>(`/v1/projects/${projectId}/files`, {
            params: { fileName }
        });
        return response.data;
    }
};

// Types for responses
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


