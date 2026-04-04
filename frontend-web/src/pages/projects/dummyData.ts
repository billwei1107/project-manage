export interface Task {
    id: string;
    code: string;
    title: string;
    duration: string;
    priority: 'low' | 'medium' | 'high';
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BACKLOG';
    assigneeAvatar?: string;
}

export interface ProjectEntry {
    id: string;
    code: string;
    title: string;
}

export const dummyProjects: ProjectEntry[] = [
    { id: '1', code: 'PN0001245', title: '醫療 App (iOS Native)' },
    { id: '2', code: 'PN0001246', title: '外送服務系統' },
    { id: '3', code: 'PN0001247', title: '企業形象網站' },
    { id: '4', code: 'PN0001248', title: '行程規劃 App' },
    { id: '5', code: 'PN0001249', title: '個人時間追蹤系統' },
    { id: '6', code: 'PN0001250', title: '內部測試專案' },
];

export const dummyTasks: Task[] = [
    { id: 't1', code: 'TS0001245', title: '使用者體驗草圖 (UX sketches)', duration: '4d', priority: 'medium', status: 'TODO', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't2', code: 'TS0001246', title: 'UX 登入與註冊流程', duration: '2d', priority: 'medium', status: 'TODO', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't3', code: 'TS0001247', title: 'UI 登入與註冊 (+ 其他畫面)', duration: '1d 6h', priority: 'medium', status: 'TODO', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't4', code: 'TS0001248', title: '心智圖 (Mind Map)', duration: '2d 4h', priority: 'medium', status: 'IN_PROGRESS', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't5', code: 'TS0001249', title: '研究報告 (Research reports)', duration: '2d', priority: 'medium', status: 'IN_REVIEW', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't6', code: 'TS0001250', title: '研究報告 (對客戶展示)', duration: '6h', priority: 'low', status: 'IN_REVIEW', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't7', code: 'TS0001251', title: '研究 (Research)', duration: '4d', priority: 'medium', status: 'DONE', assigneeAvatar: 'https://placehold.co/24x24' },
    // Backlog tasks
    { id: 't8', code: 'TS0001252', title: '按鈕動畫設計', duration: '8h', priority: 'low', status: 'BACKLOG', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't9', code: 'TS0001253', title: '預載入畫面 (Preloader)', duration: '6h', priority: 'low', status: 'BACKLOG', assigneeAvatar: 'https://placehold.co/24x24' },
    { id: 't10', code: 'TS0001254', title: '首頁動畫設計', duration: '8h', priority: 'low', status: 'BACKLOG', assigneeAvatar: 'https://placehold.co/24x24' },
];
