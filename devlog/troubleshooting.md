# 疑難排解與錯誤修復記錄 (Troubleshooting & Fixes)

## 2026-02-28 - Finance Module API 錯誤修正
- **問題描述 (Issue)**: 使用者回報專案細節內的「財務 (Finance)」分頁無法使用，下方顯示紅色報錯 `Failed to initialize finance data`。經查為主版頁面的 Finance.tsx 運作正常，只有個別專案的分頁 ProjectFinance.tsx 存取失敗 (404 Not Found)。
- **原因分析 (Cause)**: 由於 `frontend-web/src/api/axios.ts` 設定的 `baseURL` 為 `/api`，但後端 `FinancialController` 是註冊在 `/api/v1/finance`。因此當 `ProjectFinance.tsx` 發送 `api.get('/finance/...')` 時，實際路徑成為了 `/api/finance/...`，遺失了 `v1` 的版本命名空間，造成 404 錯誤而拋出 Exception 並設定 Error State。
- **解決方案 (Solution)**: 將 `ProjectFinance.tsx` 中的 API 端點字串統一加上 `/v1`，修正為：
  - `api.get('/v1/finance/projects/${projectId}')`
  - `api.get('/v1/finance/projects/${projectId}/summary')`
  - `api.get('/v1/finance/export/csv?projectId=${projectId}')`
  - `api.delete('/v1/finance/${recordId}')`
  重新 Build TypeScript 無誤後，Commit (`7ff52aa`) 推送並部署至測試伺服器。

## 2026-02-28 - Finance Module DatePicker UI 報錯修正 (白屏)
- **問題描述 (Issue)**: 使用者點擊「財務管理 (Finance)」頁面的「新增紀錄」按鈕時，畫面直接白屏崩潰 (White Screen Crash)。
- **原因分析 (Cause)**: `AddTransactionModal.tsx` 中使用了 `@mui/x-date-pickers/DatePicker`，但是該元件沒有被包裹在 `<LocalizationProvider>` 內部，也沒有在全局 `App.tsx` 提供此 Context。當 React 嘗試掛載 (Mount) Modal 時，由於缺失時間定位的 Context 導致拋出無法捕獲的運行時錯誤，進而引發整棵 React 組件樹崩潰。
- **解決方案 (Solution)**: 在 `AddTransactionModal.tsx` 引入 `LocalizationProvider` 與 `AdapterDayjs`，並將 `<DatePicker>` 完整包裹起來。重新編譯 (`npm run build`) 成功後，推送變更。

## 2026-02-28 - Finance Module 新增紀錄彈性化 (公司收支、自訂分類、自訂稅率)
- **需求描述 (Requirement)**: 使用者反映新增財務紀錄時，除了專案收支外，也會有「公司一般收支」。此外，分類選項需要能自由輸入，且稅率不該鎖死在 5%，必須設計為可編輯。
- **解決方案 (Solution)**:
  1. **後端 entity 調整**: 針對 `FinancialRecord.java`，將 `@Column(nullable = false)` 改為 `true`，允許 `projectId` 聯結為 null (代表無特定專案歸屬/公司帳)。
  2. **Controller/Service 邏輯放寬**: `FinancialService` 在處理 `addRecord` 和 `updateRecord` 時，不再無條件檢查 project 存在與否，僅在 `projectId` 非空字串時驗證。
  3. **前端元件升級**: 修改 `AddTransactionModal.tsx`，在關聯專案下拉選單新增 `無專案 (公司收支)` 的空字串選項。將原本寫死的分類 `<Select>` 升級為支援自由輸入的 `<Autocomplete freeSolo>`。並為 `taxIncluded` 狀態開啟後，補充 `<TextField type="number">` 讓使用者動態輸入含稅稅率。
  4. 完成在地化編譯測試無誤後，推送至 `main` 並且運行 `./deploy.exp` 發布。
