# 安全部署與自動化規範 (Secure Deployment Standards)

## 核心原則 (Core Principle)
- **禁止手動重啟**: 嚴禁開發者或 AI 助手透過 SSH 登入主機後，手動拼接執行零散的 `docker compose down` 或 `docker rm` 指令。
- **一律使用防呆腳本**: 任何涉及伺服器的程式碼拉取、微服務環境更新與重啟，**必須且只能**執行專案根目錄預先寫好的腳本。

## 標準操作流程 (Standard Operating Procedure)
若需於遠端主機進行更新與發布，請使用以下單一腳本指令：
```bash
sshpass -p '<PASSWORD>' ssh -o StrictHostKeyChecking=no root@<IP_ADDRESS> "bash /root/project-manage/scripts/deploy.sh"
```

## 腳本行為規範
`/root/project-manage/scripts/deploy.sh` 內部必須包含以下保護機制：
1. **目錄鎖定**: 強制 `cd` 至專案根目錄。
2. **乾淨拉取**: 執行 `git fetch --all` 與 `git reset --hard origin/master` 避免本地修改阻礙。
3. **安全清理**: 透過 `docker compose down --remove-orphans` 與強制的假死容器清理，確保後續 Up 時不會發生 Name/Network Conflict。
4. **重建環境**: 透過 `docker compose up -d --build` 平滑重啟所有微服務。
