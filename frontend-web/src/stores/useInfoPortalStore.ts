import { create } from 'zustand';
import api from '../api/axios';

interface Client {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
}

interface Directory {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
}

interface FileEntity {
    id: string;
    directoryId: string;
    originalName: string;
    storagePath: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'ANNOUNCEMENT' | 'DOCUMENT_GUIDE';
    createdAt: string;
}

interface InfoPortalState {
    clients: Client[];
    activeClient: Client | null;

    directories: Directory[];
    activeDirectoryHistory: Directory[]; // For breadcrumbs

    files: FileEntity[];

    announcements: Announcement[];

    isLoading: boolean;

    fetchClients: () => Promise<void>;
    setActiveClient: (client: Client | null) => void;

    fetchDirectories: (clientId: string, parentId?: string) => Promise<void>;
    createDirectory: (clientId: string, parentId: string | null, name: string) => Promise<void>;
    renameDirectory: (id: string, newName: string) => Promise<void>;
    deleteDirectory: (id: string) => Promise<void>;

    enterDirectory: (dir: Directory) => void;
    navigateToBreadcrumb: (index: number) => void;

    fetchFiles: (directoryId: string) => Promise<void>;
    uploadFile: (directoryId: string, file: File) => Promise<void>;
    deleteFile: (id: string) => Promise<void>;

    fetchAnnouncements: () => Promise<void>;
    createClient: (clientData: Omit<Client, 'id'>) => Promise<void>;
    updateClient: (id: string, updateData: Partial<Client>) => Promise<void>;
}

export const useInfoPortalStore = create<InfoPortalState>((set, get) => ({
    clients: [],
    activeClient: null,

    directories: [],
    activeDirectoryHistory: [],

    files: [],
    announcements: [],
    isLoading: false,

    fetchClients: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/v1/clients');
            set({ clients: res.data });
        } catch (error) {
            console.error('Error fetching clients', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createClient: async (clientData) => {
        try {
            await api.post('/v1/clients', clientData);
            get().fetchClients();
        } catch (error) {
            console.error('Error creating client', error);
            throw error;
        }
    },

    updateClient: async (id, updateData) => {
        try {
            const res = await api.put(`/v1/clients/${id}`, updateData);
            const updatedClient = res.data;
            const clients = get().clients.map(c => c.id === id ? updatedClient : c);
            set({ clients });
            if (get().activeClient?.id === id) {
                set({ activeClient: updatedClient });
            }
        } catch (error) {
            console.error('Error updating client', error);
            throw error;
        }
    },

    setActiveClient: (client) => {
        set({ activeClient: client, activeDirectoryHistory: [], directories: [], files: [] });
        if (client) {
            get().fetchDirectories(client.id);
        }
    },

    fetchDirectories: async (clientId, parentId) => {
        set({ isLoading: true });
        try {
            const url = parentId
                ? `/v1/directories?clientId=${clientId}&parentId=${parentId}`
                : `/v1/directories?clientId=${clientId}&parentId=`;
            const res = await api.get(url);
            set({ directories: res.data });

            // Auto fetch files if we are in a non-root context
            // But if parentId is null, we can also fetch root files if any
            // Actually let's fetch files only when a valid directory is focused or just root
            // If parentId is not provided, we effectively fetch root directories. 
            // In our design, a client has a root directory automatically created. 
            // We should find the root directory and fetch its contents.
        } catch (error) {
            console.error('Error fetching directories', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createDirectory: async (clientId, parentId, name) => {
        try {
            await api.post('/v1/directories', { clientId, parentId, name });
            const fetchParentId = parentId ? parentId : undefined;
            get().fetchDirectories(clientId, fetchParentId);
        } catch (error) {
            console.error('Error creating directory', error);
        }
    },

    renameDirectory: async (id, newName) => {
        try {
            await api.put(`/v1/directories/${id}`, { name: newName });
            const { activeClient, activeDirectoryHistory } = get();
            if (activeClient) {
                const parentId = activeDirectoryHistory.length > 0
                    ? activeDirectoryHistory[activeDirectoryHistory.length - 1].id
                    : undefined;
                get().fetchDirectories(activeClient.id, parentId);
            }
        } catch (error) {
            console.error('Error renaming directory', error);
        }
    },

    deleteDirectory: async (id) => {
        try {
            await api.delete(`/v1/directories/${id}`);
            const { activeClient, activeDirectoryHistory } = get();
            if (activeClient) {
                const parentId = activeDirectoryHistory.length > 0
                    ? activeDirectoryHistory[activeDirectoryHistory.length - 1].id
                    : undefined;
                get().fetchDirectories(activeClient.id, parentId);
            }
        } catch (error) {
            console.error('Error deleting directory', error);
        }
    },

    enterDirectory: (dir) => {
        const history = [...get().activeDirectoryHistory, dir];
        set({ activeDirectoryHistory: history });
        if (get().activeClient) {
            get().fetchDirectories(get().activeClient!.id, dir.id);
            get().fetchFiles(dir.id);
        }
    },

    navigateToBreadcrumb: (index) => {
        const history = get().activeDirectoryHistory.slice(0, index + 1);
        set({ activeDirectoryHistory: history });
        const dir = history[history.length - 1];
        if (get().activeClient && dir) {
            get().fetchDirectories(get().activeClient!.id, dir.id);
            get().fetchFiles(dir.id);
        } else if (index === -1) {
            // Root level
            set({ activeDirectoryHistory: [], files: [] });
            if (get().activeClient) {
                get().fetchDirectories(get().activeClient!.id);
            }
        }
    },

    fetchFiles: async (directoryId) => {
        try {
            const res = await api.get(`/v1/files?directoryId=${directoryId}`);
            set({ files: res.data });
        } catch (error) {
            console.error('Error fetching files', error);
        }
    },

    uploadFile: async (directoryId, file) => {
        const formData = new FormData();
        formData.append('directoryId', directoryId);
        formData.append('file', file);
        try {
            await api.post('/v1/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            get().fetchFiles(directoryId);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    },

    deleteFile: async (id) => {
        try {
            await api.delete(`/v1/files/${id}`);
            const history = get().activeDirectoryHistory;
            if (history.length > 0) {
                get().fetchFiles(history[history.length - 1].id);
            }
        } catch (error) {
            console.error('Error deleting file', error);
        }
    },

    fetchAnnouncements: async () => {
        try {
            const res = await api.get('/v1/announcements');
            set({ announcements: res.data });
        } catch (error) {
            console.error('Error fetching announcements', error);
        }
    }
}));
