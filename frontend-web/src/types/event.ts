export type Priority = 'Low' | 'Medium' | 'High';
export type RepeatType = 'None' | 'Daily' | 'Weekly' | 'Monthly';

export interface EventRequest {
    title: string;
    description?: string;
    startDate: string; // ISO 8601 string
    endDate: string; // ISO 8601 string
    category: string;
    priority: Priority;
    repeatType: RepeatType;
}

export interface EventResponse {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    category: string;
    priority: Priority;
    repeatType: RepeatType;
    creatorId: string;
    creatorName: string;
}
