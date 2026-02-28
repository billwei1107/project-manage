import { create } from 'zustand';

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
            // Mock fetching projects for now until we integrate with a real project API
            // In a real scenario, this would be: const response = await api.get('/projects');
            const mockProjects: Project[] = [
                { id: '1', name: 'ERP 系統開發' },
                { id: '2', name: '企業形象官網' },
                { id: '3', name: '內部差勤系統維護' }
            ];

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            set({ projects: mockProjects, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch projects', loading: false });
        }
    }
}));
