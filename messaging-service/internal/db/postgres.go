/**
 * @file postgres.go
 * @description 資料庫連線與遷移 / Database Connection & Migration
 * @description_en Handles PostgreSQL connection pool and auto-migration
 * @description_zh 處理 PostgreSQL 連線池與自動遷移
 */

package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// ========================================
// 初始化資料庫 / Initialize Database
// ========================================

func InitDB() {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	dbname := getEnv("DB_NAME", "erp_db")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)

	log.Println("✅ Connected to PostgreSQL")
	runMigrations()
}

// ========================================
// 自動遷移 / Auto Migration
// ========================================

func runMigrations() {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS conversations (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL DEFAULT '',
			type VARCHAR(20) NOT NULL DEFAULT 'DIRECT',
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMP NOT NULL DEFAULT NOW()
		)`,
		`CREATE TABLE IF NOT EXISTS conversation_members (
			conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
			user_id UUID NOT NULL,
			last_read_at TIMESTAMP,
			joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
			PRIMARY KEY (conversation_id, user_id)
		)`,
		`CREATE TABLE IF NOT EXISTS messages (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
			sender_id UUID NOT NULL,
			content TEXT NOT NULL DEFAULT '',
			message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
			file_url TEXT,
			file_name VARCHAR(500),
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		)`,
		`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`,
		`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`,
		`CREATE INDEX IF NOT EXISTS idx_conversation_members_user_id ON conversation_members(user_id)`,
	}

	for _, q := range queries {
		if _, err := DB.Exec(q); err != nil {
			log.Fatalf("Migration failed: %v\nQuery: %s", err, q)
		}
	}
	log.Println("✅ Database migration completed")
}

// ========================================
// 工具函式 / Utility
// ========================================

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
