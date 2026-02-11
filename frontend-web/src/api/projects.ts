import api from './axios';
import type { Project, ProjectStatus, Task } from '../types/project';

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

// API Functions

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/v1/projects');
    return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/v1/projects/${id}`);
    return response.data;
};

export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/v1/projects', data);
    return response.data;
};

export const updateProject = async (id: string, data: Partial<CreateProjectRequest>): Promise<Project> => {
    const response = await api.put<Project>(`/v1/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    await api.delete(`/v1/projects/${id}`);
};

// Task APIs

export const getTasks = async (projectId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/v1/projects/${projectId}/tasks`);
    return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/v1/tasks', data);
    return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/v1/tasks/${id}`, data);
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/v1/tasks/${id}`);
};
