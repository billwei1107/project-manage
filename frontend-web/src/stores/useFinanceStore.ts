import { create } from 'zustand';
import api from '../api/axios';
import type { FinancialRecordResponse, FinancialRecordRequest, FinancialSummaryResponse } from '../types/finance';

/**
 * @file useFinanceStore.ts
 * @description 狀態管理 - 財務模組 / State management for finance
 */

interface FinanceState {
    records: FinancialRecordResponse[];
    summary: FinancialSummaryResponse | null;
    loading: boolean;
    error: string | null;

    fetchRecords: (projectId?: string) => Promise<void>;
    fetchSummary: (projectId: string) => Promise<void>;
    addRecord: (data: FinancialRecordRequest) => Promise<void>;
    updateRecord: (id: string, data: FinancialRecordRequest) => Promise<void>;
    deleteRecord: (id: string, currentProjectId?: string) => Promise<void>;
    uploadReceipt: (file: File) => Promise<string>;
    importCsv: (file: File, projectId: string) => Promise<number>;
    exportCsv: (projectId?: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    records: [],
    summary: null,
    loading: false,
    error: null,

    fetchRecords: async (projectId?: string) => {
        set({ loading: true, error: null });
        try {
            const endpoint = projectId ? `/v1/finance/projects/${projectId}` : `/v1/finance`;
            const response = await api.get(endpoint);
            set({ records: response.data.data, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch financial records', loading: false });
        }
    },

    fetchSummary: async (projectId: string) => {
        try {
            const response = await api.get(`/v1/finance/projects/${projectId}/summary`);
            set({ summary: response.data.data });
        } catch (error: any) {
            console.error('Failed to fetch financial summary:', error);
        }
    },

    addRecord: async (data: FinancialRecordRequest) => {
        set({ loading: true, error: null });
        try {
            await api.post('/v1/finance', data);
            await get().fetchRecords(data.projectId);
            await get().fetchSummary(data.projectId);
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to add record', loading: false });
            throw error;
        }
    },

    updateRecord: async (id: string, data: FinancialRecordRequest) => {
        set({ loading: true, error: null });
        try {
            await api.put(`/v1/finance/${id}`, data);
            await get().fetchRecords(data.projectId);
            await get().fetchSummary(data.projectId);
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update record', loading: false });
            throw error;
        }
    },

    deleteRecord: async (id: string, currentProjectId?: string) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/v1/finance/${id}`);
            await get().fetchRecords(currentProjectId);
            if (currentProjectId) {
                await get().fetchSummary(currentProjectId);
            }
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete record', loading: false });
            throw error;
        }
    },

    uploadReceipt: async (file: File) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/v1/finance/receipts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data; // URL String
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to upload receipt', loading: false });
            throw error;
        }
    },

    importCsv: async (file: File, projectId: string) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('projectId', projectId);

            const response = await api.post('/v1/finance/import/csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await get().fetchRecords(projectId);
            await get().fetchSummary(projectId);
            return response.data.data; // Count of imported records
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to import CSV', loading: false });
            throw error;
        }
    },

    exportCsv: async (projectId?: string) => {
        try {
            // Because we expect binary data, we configure responseType
            const endpoint = projectId ? `/v1/finance/export/csv?projectId=${projectId}` : `/v1/finance/export/csv`;
            const response = await api.get(endpoint, { responseType: 'blob' });

            // Create a pseudo download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'financial_report.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error: any) {
            console.error('Failed to export CSV:', error);
            set({ error: 'Failed to export CSV' });
            throw error;
        }
    }
}));
