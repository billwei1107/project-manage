import { create } from 'zustand';
import api from '../api/axios';

export interface Project {
    id: string;
    title: string;
    client?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    status: string;
    progress?: number;
    description?: string;
    team?: any[];
    githubRepo?: string;
    githubBranch?: string;
    fileLocation?: string;
}

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],
    loading: false,
    error: null,
    fetchProjects: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/v1/projects');
            set({ projects: response.data.data || [], loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message || 'Failed to fetch projects', loading: false });
        }
    }
}));
