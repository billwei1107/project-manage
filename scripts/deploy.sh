#!/bin/bash

# =========================================================================
# 專案自動化部署腳本 (Project Automated Deployment Script)
# =========================================================================
# 此腳本用於標準化伺服器的更新與部署流程，避免產生 Docker 孤兒連線或名稱衝突。
# 所有的 CI/CD 以及 AI 助手在更新伺服器時，必須且只能呼叫此腳本。
# 
# 用法:
# ./scripts/deploy.sh
# =========================================================================

# 1. 切換到專案根目錄 (確保腳本執行目錄不影響操作)
PROJECT_DIR="/root/project-manage"
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR" || exit 1
else
    echo "錯誤: 找不到專案目錄 $PROJECT_DIR"
    exit 1
fi

echo "🚀 開始執行專案自動化部署流程..."

# 2. 自動拉取最新原始碼 (強制重置以防意外修改)
echo "📥 正在獲取最新程式碼 (origin/master)..."
git fetch origin
if [ $? -ne 0 ]; then
    echo "❌ Git Fetch 失敗，可能遭遇網路異常或權限問題。"
    exit 1
fi

git reset --hard origin/master
if [ $? -ne 0 ]; then
    echo "❌ Git Reset 失敗。"
    exit 1
fi

echo "✅ 程式碼已更新至最新狀態。"

# 3. 安全關閉現有容器並清理廢棄依賴 (解決 Conflict 根本原因)
echo "🧹 正在安全停止與清理 Docker 容器 (移除 orphans)..."
docker compose -f docker/compose.yaml down -v --remove-orphans

# 額外確認：確保沒有卡死或殘留的同名容器
# 這個步驟能解決 "The container name is already in use by container..." 的致命錯誤
echo "🔍 檢查是否有殘留的假死容器..."
docker rm -f $(docker ps -aq) 2>/dev/null || true
docker network prune -f 2>/dev/null || true

# 4. 重新建立與啟動容器
echo "🏗️ 正在重新建置並啟動所有微服務 (Frontend, Backend, Redis, Postgres)..."
docker compose -f docker/compose.yaml up -d --build

if [ $? -eq 0 ]; then
    echo "🎉 部署完成！(All services have been started successfully)"
    docker compose -f docker/compose.yaml ps
else
    echo "❌ 部署過程中發生錯誤！請檢查 Docker Logs。"
    exit 1
fi
