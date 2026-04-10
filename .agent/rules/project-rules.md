# 專案管理協作平台 - 核心開發規範 (Project Rules)

## 語言設定 (Language Protocols)

1. **思考與溝通**: 所有思考過程、任務清單、對用戶的回覆說明，一律使用 **繁體中文**。
2. **註釋與文檔**: 代碼註釋與功能文檔採用**中英文雙語**格式。

## 專案初始化流程 (Project Initialization Workflow)

初次建立或接觸新專案時，必須遵守以下順序：

1. **需求釐清**: 詳讀並分析需求文檔，清楚定義開發的功能範圍。
2. **分支切換**: 拉取檔案與開始工作前，請務必優先拉取 `feature` 分支 (`git checkout feature && git pull origin feature`)，確保取得最新開發資料。
3. **文檔整理**: 整理或建立完整的需求文檔。
4. **專案規範建立**: 根據需求文檔，建立專案規則文件。

## 版本控制規範 (Git & Version Control)

### 提交訊息 (Commit Message)
- 格式: `type(scope): subject`
- 常用 Type: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`
- 範例: `feat(auth): integrate jwt login flow`

### 分支策略 (Branching) ⚠️ 極度重要

> [!CAUTION]
> **main / master**: 生產環境分支，**絕對禁止** AI Agent 直接推送。
> 不允許執行 `git push origin main` 或 `git push origin master`。

- **`feature`** (或 `feature/xxx`): 所有新功能與修改**必須**在此分支上進行。
- **`develop`**: 開發主分支（視專案情況選用）。
- **`fix/xxx`**: Bug 修復分支。

### 開發前強制檢查 (Pre-development Branch Check)
- 在撰寫代碼、執行 Commit 或 Push 之前，必須使用 `git branch` 確認當下位於 `feature` 或相關的開發分支。
- 若發現處於 `main` 分支，必須立刻使用 `git checkout feature`，**絕對不允許**在 main 產生新的 Commit。

### 忽略文件 (.gitignore)
- 必須忽略: `.env`, `node_modules/`, `venv/`, `dist/`, `build/`, `.DS_Store`, `.idea/`, `.vscode/`

## 代碼開發規範 (Development Standards)

### 命名規範 (Naming Conventions)
- **檔案與目錄**: 一般使用小寫 `kebab-case`；React 組件使用 `PascalCase`；Java 類別使用 `PascalCase`。
- **變數與函數**: JS/TS/Java/Go 使用 `camelCase`；Python 使用 `snake_case`。
- **資料庫**: 資料表與欄位一律小寫 `snake_case`。
- **常數與環境變數**: 全大寫 `UPPER_SNAKE_CASE`。

### 前端開發 (Frontend)
- **編譯驗證**: 確保在每次提交前端代碼變更之前，**必須**執行 `npx tsc -b` 以及 `npm run build`。必須清理所有「宣告但未使用」或「缺少匯入」的警告，因為嚴格模式下這些會導致部署失敗。
- **硬編碼檢查**: 禁止寫死任何顯示文字或 API URL。
- **類型安全**: TypeScript 禁止使用 `any`。
- **組件設計**: 單一職責原則，過大組件必須拆分。

### 後端開發 (Backend)
- **API 設計**: 嚴格遵守 RESTful 規範。
- **錯誤處理**: 統一錯誤回傳格式，禁止將 Stack Trace 拋給前端。
- **分層架構**: Controller -> Service -> Repository/DAO，禁止跨層存取。

### 資料庫 (Database)
- **必備欄位**: `id` (PK), `created_at`, `updated_at`。
- **軟刪除**: 重要數據使用 `deleted_at`。
- **索引**: FK 和頻繁查詢欄位必須建立 Index。

## 部署與 CI/CD 規範

- 每次開發或修改完成後，必須主動觸發 CI/CD 流程部署至測試伺服器驗證。

## 代碼註釋規範 (Code Documentation)

### 文件頭部
所有代碼文件開頭必須添加中英文雙語註釋：
```typescript
/**
 * @file Login.tsx
 * @description 登入頁面組件 / Login page component
 * @description_en Handles user authentication
 * @description_zh 處理用戶登入驗證
 */
```

### 功能模塊
每個功能模塊必須添加區塊註釋：
```typescript
// ========================================
// 登入處理 / Login Handler
// ========================================
const handleLogin = () => { ... };
```

## 前端組件化規範

- 可重用 UI 元素必須抽離為獨立組件，存放於 `src/components/`。
- 每個組件目錄應包含：組件檔 (`.tsx`)、樣式檔 (`.css`) 和匯出檔 (`index.ts`)。
- 頁面存放於 `src/pages/`，組件存放於 `src/components/`。

## 開發日誌規範 (Development Log)

- 日誌存放於 `devlog/` 資料夾，命名格式 `YYYY-MM-DD-devlog.md`。
- 問題追蹤使用 `devlog/troubleshooting.md`。
- 每次 git commit 後必須在當日 devlog 記錄提交資訊。
