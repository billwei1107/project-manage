import { create } from 'zustand';
import api from '../api/axios';
import type { EventResponse, EventRequest } from '../types/event';
import type { Task } from '../types/project';

/**
 * @file useEventStore.ts
 * @description 狀態管理 - 事件與行事曆 / State management for events
 * @description_en Zustand store for fetching and managing calendar events
 * @description_zh 管理與獲取行事曆事件的 Zustand Store
 */

interface EventState {
    events: EventResponse[];
    tasks: Task[];
    loading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    createEvent: (data: EventRequest) => Promise<void>;
    updateEvent: (id: string, data: EventRequest) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    tasks: [],
    loading: false,
    error: null,

    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const [eventsRes, tasksRes] = await Promise.all([
                api.get('/v1/events'),
                api.get('/v1/tasks/my-calendar-tasks')
            ]);
            set({
                events: eventsRes.data.data,
                tasks: tasksRes.data, // Assuming task controller returns standard list or ApiResponse? Wait, TaskController returns ResponseEntity.ok(list) directly, no ApiResponse wrapper! Let me check TaskController.
                loading: false
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch events', loading: false });
        }
    },

    createEvent: async (data: EventRequest) => {
        set({ loading: true, error: null });
        try {
            await api.post('/v1/events', data);
            await get().fetchEvents();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create event', loading: false });
            throw error;
        }
    },

    updateEvent: async (id: string, data: EventRequest) => {
        set({ loading: true, error: null });
        try {
            await api.put(`/v1/events/${id}`, data);
            await get().fetchEvents();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update event', loading: false });
            throw error;
        }
    },

    deleteEvent: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/v1/events/${id}`);
            await get().fetchEvents();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete event', loading: false });
            throw error;
        }
    }
}));
