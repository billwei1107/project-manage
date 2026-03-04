/**
 * @file useMessengerStore.ts
 * @description 即時通訊狀態管理 / Messenger State Management
 * @description_en Manages conversations, messages, WebSocket connection, and unread counts
 * @description_zh 管理對話、訊息、WebSocket 連線與未讀數量
 */

import { create } from 'zustand';

// ========================================
// 類型定義 / Type Definitions
// ========================================

export interface MemberInfo {
    userId: string;
    name: string;
}

export interface ConversationItem {
    id: string;
    name: string;
    type: 'DIRECT' | 'GROUP';
    unreadCount: number;
    lastMessage: string | null;
    lastMessageAt: string | null;
    lastSenderId: string | null;
    members: MemberInfo[];
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName?: string;
    content: string;
    messageType: 'TEXT' | 'IMAGE' | 'FILE';
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
}

export interface ChatUser {
    id: string;
    name: string;
    username?: string;
    role: string;
}

// ========================================
// Store 介面 / Store Interface
// ========================================

interface MessengerState {
    conversations: ConversationItem[];
    activeConversationId: string | null;
    messages: Message[];
    unreadTotal: number;
    ws: WebSocket | null;
    users: ChatUser[];
    isLoading: boolean;

    // Actions
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    setActiveConversation: (id: string | null) => void;
    sendMessage: (conversationId: string, content: string, messageType?: string, fileUrl?: string, fileName?: string) => Promise<void>;
    createConversation: (name: string, type: string, memberIds: string[]) => Promise<string>;
    markAsRead: (conversationId: string) => Promise<void>;
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
    addIncomingMessage: (message: Message) => void;
}

// ========================================
// API 基底路徑 / API Base URL
// ========================================

const MSG_API = '/msg-api';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ========================================
// Store 實作 / Store Implementation
// ========================================

export const useMessengerStore = create<MessengerState>((set, get) => ({
    conversations: [],
    activeConversationId: null,
    messages: [],
    unreadTotal: 0,
    ws: null,
    users: [],
    isLoading: false,

    // ========================================
    // 取得對話列表 / Fetch Conversations
    // ========================================
    fetchConversations: async () => {
        try {
            const res = await fetch(`${MSG_API}/conversations`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                set({ conversations: data });
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        }
    },

    // ========================================
    // 取得歷史訊息 / Fetch Messages
    // ========================================
    fetchMessages: async (conversationId: string) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${MSG_API}/conversations/${conversationId}/messages?limit=100`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                set({ messages: data });
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            set({ isLoading: false });
        }
    },

    // ========================================
    // 取得未讀數 / Fetch Unread Count
    // ========================================
    fetchUnreadCount: async () => {
        try {
            const res = await fetch(`${MSG_API}/unread-count`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                set({ unreadTotal: data.unreadCount });
            }
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    },

    // ========================================
    // 取得使用者列表 / Fetch Users
    // ========================================
    fetchUsers: async () => {
        try {
            const res = await fetch(`${MSG_API}/users`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                set({ users: data });
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    },

    // ========================================
    // 設定當前對話 / Set Active Conversation
    // ========================================
    setActiveConversation: (id) => {
        set({ activeConversationId: id, messages: [] });
        if (id) {
            get().fetchMessages(id);
            get().markAsRead(id);
        }
    },

    // ========================================
    // 傳送訊息 / Send Message
    // ========================================
    sendMessage: async (conversationId, content, messageType = 'TEXT', fileUrl, fileName) => {
        try {
            const res = await fetch(`${MSG_API}/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ content, messageType, fileUrl, fileName }),
            });
            if (!res.ok) {
                console.error('Failed to send message');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    },

    // ========================================
    // 建立對話 / Create Conversation
    // ========================================
    createConversation: async (name, type, memberIds) => {
        const res = await fetch(`${MSG_API}/conversations`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, type, memberIds }),
        });
        if (res.ok) {
            const data = await res.json();
            await get().fetchConversations();
            return data.id;
        }
        throw new Error('Failed to create conversation');
    },

    // ========================================
    // 標記已讀 / Mark as Read
    // ========================================
    markAsRead: async (conversationId) => {
        try {
            await fetch(`${MSG_API}/conversations/${conversationId}/read`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            // 更新本地未讀數 / Update local unread
            set((state) => ({
                conversations: state.conversations.map((c) =>
                    c.id === conversationId ? { ...c, unreadCount: 0 } : c
                ),
            }));
            get().fetchUnreadCount();
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    },

    // ========================================
    // WebSocket 連線 / WebSocket Connection
    // ========================================
    connectWebSocket: () => {
        const { ws } = get();
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/?token=${token}`;

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('🟢 WebSocket connected');
        };

        socket.onmessage = (event) => {
            try {
                const wsMsg = JSON.parse(event.data);
                if (wsMsg.type === 'new_message') {
                    get().addIncomingMessage(wsMsg.payload as Message);
                }
            } catch (err) {
                console.error('Failed to parse WS message:', err);
            }
        };

        socket.onclose = () => {
            console.log('🔴 WebSocket disconnected, reconnecting in 3s...');
            set({ ws: null });
            // 自動重連 / Auto reconnect
            setTimeout(() => {
                if (localStorage.getItem('token')) {
                    get().connectWebSocket();
                }
            }, 3000);
        };

        socket.onerror = (err) => {
            console.error('WebSocket error:', err);
            socket.close();
        };

        set({ ws: socket });
    },

    disconnectWebSocket: () => {
        const { ws } = get();
        if (ws) {
            ws.close();
            set({ ws: null });
        }
    },

    // ========================================
    // 處理收到的新訊息 / Handle Incoming Message
    // ========================================
    addIncomingMessage: (message) => {
        const { activeConversationId } = get();

        // 如果是當前對話的訊息，加入訊息列表 / Add to current chat
        if (message.conversationId === activeConversationId) {
            set((state) => ({
                messages: [...state.messages, message],
            }));
            // 自動標記已讀 / Auto mark as read
            get().markAsRead(message.conversationId);
        } else {
            // 不是當前對話，增加未讀數 / Not current chat, increment unread
            set((state) => ({
                conversations: state.conversations.map((c) =>
                    c.id === message.conversationId
                        ? { ...c, unreadCount: c.unreadCount + 1, lastMessage: message.content, lastMessageAt: message.createdAt }
                        : c
                ),
                unreadTotal: state.unreadTotal + 1,
            }));
        }

        // 重新排序對話列表 / Re-sort conversation list
        get().fetchConversations();
    },
}));
