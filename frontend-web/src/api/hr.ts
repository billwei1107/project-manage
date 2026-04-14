import api from './axios';

export interface EmployeeBrief {
    id: string;
    name: string;
    email: string;
    role: string;
    isOnline: boolean;
    lastLoginAt: string | null;
    employeeId: string;
}

export const hrApi = {
    getEmployees: async (): Promise<EmployeeBrief[]> => {
        const response = await api.get<EmployeeBrief[]>('/v1/hr/employees');
        return response.data;
    }
};
