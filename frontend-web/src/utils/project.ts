import type { ProjectStatus } from '../types/project';

export const statusColors: Record<ProjectStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    PLANNING: 'info',
    IN_PROGRESS: 'primary',
    REVIEW: 'warning',
    DONE: 'success',
};

export const statusLabels: Record<ProjectStatus, string> = {
    PLANNING: '規劃中',
    IN_PROGRESS: '進行中',
    REVIEW: '審核中',
    DONE: '已完成',
};
