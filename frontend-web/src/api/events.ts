import api from './axios';

export interface Event {
    id: string;
    title: string;
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    color: string;
}

export const eventApi = {
    getEvents: async (): Promise<Event[]> => {
        const response = await api.get<{success: boolean, data: Event[]}>('/v1/events');
        return response.data.data;
    }
};
