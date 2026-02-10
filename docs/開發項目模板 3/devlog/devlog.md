# 2026-02-10 開發日誌 (DevLog)

- **日期**: 2026-02-10
- **操作者**: Antigravity (Agent)
- **目標**: 專案初始化與功能開發順序規劃 (Detailed Development Roadmap)

## 1. 開發規劃 (Planning)

本計畫依據 `需求文檔.md` 與 `頁面結構` 文件，制定從前端到後端的詳細開發順序。

### 階段一：專案骨架搭建 (Skeleton Setup)
- [x] **建立專案根目錄結構**: 
    - `backend/` (Spring Boot 3.x)
    - `frontend-web/` (React + Vite + MUI) ✅ Completed
    - `frontend-app/` (Flutter)
    - `docker/` (Docker Compose Config)
- [ ] **Git 與環境配置**: 設定 `.gitignore` 與 `.env` 模板。

### 階段二：前端 Web 開發 (React Web) - **Frontend First**

此階段將使用 Mock Data 快速構建 UI，確保視覺與交互符合預期。

#### 2.1 基礎建設 (Infrastructure)
- [ ] **路由與佈局 (Routing & Layouts)**:
    - 實作 `AppRouter` (React Router v7)。
    - 建立 **AdminLayout** (Sidebar + Header, 權限驗證)。
    - 建立 **ClientLayout** (TopNav, 客戶專用)。
    - 設定 **MUI Theme** (依據 CRM Blue 風格)。

#### 2.2 公共與認證模組 (Public & Auth)
- [ ] **登入頁面 (Login)**: 支援 Admin/Client 雙身分登入 (Mock Auth)。
- [ ] **狀態管理**: 建立 `useAuthStore` (包含 User Info, Token)。

#### 2.3 後台管理系統 (Admin Portal) - **核心優先**
1.  **儀表板 (Dashboard)**:
    -   [ ] `DashOv`: 專案狀態概覽、財務摘要卡片。
    -   [ ] `DashTask`: 個人待辦事項列表。
2.  **專案管理 (Projects)**:
    -   [ ] `ProjList`: 專案列表 (搜尋、篩選)。
    -   [ ] `ProjDetail`: 專案詳情頁 (Tabs: 概況/成員/設定)。
    -   [ ] `PD_Board`: 看板模式 (Kanban) - 拖拉更新狀態。
    -   [ ] `PD_Gantt`: 甘特圖 (Gantt) - 顯示里程碑與時程。
3.  **財務管理 (Finance)**:
    -   [ ] `FinQuote`: 報價單建立與預覽 (PDF 樣式)。
    -   [ ] `FinInv`: 發票與請款單管理。

#### 2.4 客戶入口 (Client Portal)
- [ ] **專案概況**: 客戶專屬 Dashboard (進度條、待辦簽收)。
- [ ] **我的專案**: 檢視合約文件、驗收里程碑 (Sign-off UI)。

### 階段三：後端核心開發 (Backend Core)

此階段將實作真實 API 並替換前端的 Mock Data。

#### 3.1 核心架構 (Core Architecture)
- [ ] **Spring Boot Init**: 設定 JPA, Postgres, Swagger UI。
- [ ] **Security**: 實作 JWT Filter, RBAC (Role-Based Access Control)。

#### 3.2 業務模組 API (Business Modules)
1.  **使用者模組 (User)**: Login, Profile, Role Management。
2.  **專案模組 (Project)**:
    -   CRUD API for Projects, Milestones, Tasks (Kanban)。
    -   GitHub Webhook 整合 (接收 Commit/PR 事件)。
3.  **財務模組 (Finance)**:
    -   Quote Generation (報價單計算邏輯)。
    -   Invoice Status Tracking。

### 階段四：行動端 App 開發 (Flutter App)
- [ ] **基礎建設**: Dio (API Client), Riverpod (State), GoRouter。
- [ ] **功能實作**: 
    -   工程師：檢視 Task, 回報工時 (Time Logging)。
    -   PM：檢視 Dashboard, 緊急審核 (Approval)。

## 2. 專案結構 (Project Structure)

目前目錄結構 (Implementation Phase)：

```text
/Users/billwei1107/Desktop/code/project manage/
├── frontend-web/            # [Initialized] React Project
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── layouts/         # Page Layouts (Admin/Client)
│   │   ├── pages/           # Page Views (match Routing)
│   │   ├── stores/          # Zustand State Stores
│   │   ├── theme/           # MUI Theme Config
│   │   ├── utils/           # Helper Functions
│   │   ├── App.tsx          # Root Component (Router Setup)
│   │   └── main.tsx         # Entry Point
│   ├── public/              # Static Assets
│   ├── index.html           # HTML Entry
│   ├── package.json         # Dependencies
│   ├── tsconfig.json        # TypeScript Config
│   └── vite.config.ts       # Vite Config (@ alias)
│
├── backend/                 # [Pending] Spring Boot Project
│   └── src/
│       ├── main/
│       │   ├── java/com/erp/
│       │   │   ├── config/      # Security, Swagger, Audit
│       │   │   ├── controller/  # REST API Endpoints
│       │   │   ├── dto/         # Data Transfer Objects
│       │   │   ├── entity/      # JPA Entities
│       │   │   ├── repository/  # Data Access Layer
│       │   │   ├── service/     # Business Logic
│       │   │   └── ErpApplication.java
│       │   └── resources/
│       │       └── application.yml  # App Config
│       └── test/            # Unit & Integration Tests
│
├── frontend-app/            # [Pending] Flutter Project
│   ├── lib/
│   │   ├── main.dart        # Entry Point
│   │   ├── config/          # App Config (Routes, Theme)
│   │   ├── models/          # Data Models
│   │   ├── providers/       # State Management (Riverpod)
│   │   ├── screens/         # UI Screens
│   │   ├── services/        # API Services (Dio)
│   │   └── widgets/         # Reusable Widgets
│   └── pubspec.yaml         # Dependencies
│
├── docker/                  # [Pending] Docker Environment
│   ├── local/
│   │   ├── compose.yaml     # Postgres, Redis
│   │   └── Dockerfile       # Backend/Frontend images
│   └── production/
│
└── docs/                    # Documentation
    ├── 需求/                 # Requirements
    ├── devlog/              # Development Logs
    └── .cursor/rules/       # Project Rules
```

## 3. 進度與變更 (Progress & Changes)

### 已完成 (Completed)
- [x] **需求與規劃**: 完成詳細功能開發順序規劃。
- [x] **前端初始化**: `frontend-web` 目錄建立完成，核心依賴 (MUI, Zustand) 已安裝。
