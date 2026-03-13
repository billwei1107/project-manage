#!/bin/bash

# ==============================================================================
# PostgreSQL 自動備份腳本 / PostgreSQL Automated Backup Script
# ==============================================================================
# 說明: 用於備份 Docker 容器內的 PostgreSQL 資料庫
# Usage: ./db-backup.sh

# 配置區 / Config
BACKUP_DIR="/root/backups/db"
DB_CONTAINER="project-manage-postgres"
DB_NAME="erp_db"
DB_USER="postgres"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 建立目錄 / Create directory
mkdir -p $BACKUP_DIR

# 執行備份 / Run backup
echo "[$DATE] Starting backup for $DB_NAME..."
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/${DB_NAME}_$DATE.sql"

if [ $? -eq 0 ]; then
    echo "[$DATE] Backup successful: ${DB_NAME}_$DATE.sql"
    # 壓縮 / Compress
    gzip "$BACKUP_DIR/${DB_NAME}_$DATE.sql"
else
    echo "[$DATE] Backup FAILED!"
    exit 1
fi

# 刪除舊紀錄 / Cleanup old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$DATE] Cleanup of backups older than $RETENTION_DAYS days completed."
