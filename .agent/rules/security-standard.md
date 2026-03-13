# 專案安全開發與部署規範 (Security Standards)

## 1. 網路安全 (Network Security)
*   **禁止埠口外洩 (Port Protection)**: 
    *   資料庫 (5432) 與 Redis (6379) 嚴禁在 `docker-compose.yaml` 中使用 `ports` 對應至外部。
    *   外部存取應限制在 80 (HTTP) / 443 (HTTPS) 與 SSH 埠口。
*   **防火牆策略**: 伺服器安全性群組 (Security Group) 應採用「最小授權原則」，僅開放必要服務。

## 2. 秘密與環境變數 (Secrets & ENV)
*   **禁止硬編碼 (No Hardcoding)**: 
    *   原始碼中禁止出現任何真實密碼、API Key 或 Token (即使是測試用的)。
    *   應使用 `@Value("${...}")` 讀取環境變數。
*   **版本控制規則**: 
    *   `.env` 檔案必須被列入 `.gitignore`。
    *   僅提供 `.env.example` 作為範本，且範本內應使用佔位符 (如 `ghp_xxxxxx`)。

## 3. 資料保護與恢復 (Data Protection)
*   **定期備份**: 必須設定定時任務 (Cron Job) 每日備份資料庫。
*   **備份異地化**: 建議備份應儲存於伺服器以外的空間 (如 S3, Drive 或其他分區)。

## 4. 稽核與監控 (Audit)
*   **日誌脫敏**: `log` 中严禁輸出使用者密碼或 JWT Token。
*   **健康檢查**: 關鍵容器必須配置 `healthcheck` 以監測資料庫連線即時狀態。
