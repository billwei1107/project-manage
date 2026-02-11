export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string; // Optional for frontend display
    role?: string;
}

export interface Project {
    id: string;
    title: string;
    client: string;
    budget: number;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    progress: number;
    description?: string;
    team: UserInfo[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    status: TaskStatus;
    assignee?: UserInfo;
    orderIndex?: number;
    createdAt?: string;
    updatedAt?: string;
}
