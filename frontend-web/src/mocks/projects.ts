import type { Project } from '../types/project';

export const mockProjects: Project[] = [
    {
        id: '1',
        title: 'ERP 系統升級',
        client: '泰科科技股份有限公司',
        budget: 150000,
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        status: 'IN_PROGRESS',
        progress: 45,
        description: '將舊版 ERP 系統升級至全新的雲端解決方案，包含資料庫遷移與新功能開發。',
        team: [
            { id: 'u1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=u1' },
            { id: 'u2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=u2' },
        ],
    },
    {
        id: '2',
        title: '行動 App 改版',
        client: '創新新創公司',
        budget: 50000,
        startDate: '2024-02-15',
        endDate: '2024-04-15',
        status: 'PLANNING',
        progress: 10,
        description: '重新設計面向消費者的行動應用程式，提升使用者體驗與介面流暢度。',
        team: [
            { id: 'u3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=u3' },
        ],
    },
    {
        id: '3',
        title: '網站年度維護',
        client: '零售企業',
        budget: 20000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'DONE',
        progress: 100,
        description: '電子商務網站的年度維護合約，包含安全性更新與效能優化。',
        team: [
            { id: 'u1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=u1' },
            { id: 'u4', name: 'Dave', avatar: 'https://i.pravatar.cc/150?u=u4' },
        ],
    },
    {
        id: '4',
        title: 'AI 客服整合 POC',
        client: '未來科技',
        budget: 80000,
        startDate: '2024-03-01',
        endDate: '2024-05-30',
        status: 'REVIEW',
        progress: 90,
        description: '整合 AI 聊天機器人至客戶支援系統的概念驗證專案。',
        team: [
            { id: 'u2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=u2' },
            { id: 'u3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=u3' },
        ],
    },
];
