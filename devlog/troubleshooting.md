
## 2026-04-04 TypeScript verbatimModuleSyntax 編譯錯誤導致部署中斷

### 問題描述 (Issue)
- **現象**：前台畫面顯示「回應時間過長」，實際上是因為後端 CI/CD (Github Actions) 執行 docker compose up --build 時，由於 TypeScript 編譯失敗，導致前端容器建置終止，進而造成舊容器停機後新容器無法啟動。
- **錯誤代碼**：error TS1484: 'Task' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled. (在 Vite 預設的 tsconfig 規範中，單純匯入 Type 必須加上 import type {} 宣告)。

### 解決方案 (Solution)
- 將 ProjectSidebar.tsx, TaskBoard.tsx, TaskCard.tsx 檔案中的 import { ProjectEntry } 等型別，明確修正為 import type { ProjectEntry }，順利通過 tsc -b 編譯。
- 已將修正提交並強制推送到 eature 分支，CI/CD 將自動修復生產環境。

