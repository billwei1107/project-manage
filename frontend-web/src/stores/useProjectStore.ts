import { create } from 'zustand';
import api from '../api/axios';

export interface Project {
    id: string;
    name: string;
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
            const projectsData = response.data.data.map((p: any) => ({
                id: p.id,
                name: p.title
            }));

            set({ projects: projectsData, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message || 'Failed to fetch projects', loading: false });
        }
    }
}));
