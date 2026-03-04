/**
 * @file upload.go
 * @description 檔案上傳 Handler / File Upload Handler
 * @description_en Handles file and image uploads, saves to disk and returns URL
 * @description_zh 處理檔案與圖片上傳，存入磁碟並回傳 URL
 */

package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"messaging-service/internal/auth"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// ========================================
// 上傳檔案 / Upload File
// ========================================

func UploadFile(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	// 限制 100MB / Limit 100MB
	r.ParseMultipartForm(100 << 20)

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, `{"error":"No file provided"}`, http.StatusBadRequest)
		return
	}
	defer file.Close()

	// 產生唯一檔名 / Generate unique filename
	ext := filepath.Ext(header.Filename)
	safeOrigName := sanitizeFilename(strings.TrimSuffix(header.Filename, ext))
	timestamp := time.Now().UnixMilli()
	fileName := fmt.Sprintf("%d_%s%s", timestamp, safeOrigName, ext)

	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads"
	}

	// 確保目錄存在 / Ensure directory exists
	msgUploadDir := filepath.Join(uploadDir, "messages")
	if err := os.MkdirAll(msgUploadDir, 0755); err != nil {
		http.Error(w, `{"error":"Failed to create upload directory"}`, http.StatusInternalServerError)
		return
	}

	// 寫入檔案 / Write file
	destPath := filepath.Join(msgUploadDir, fileName)
	dst, err := os.Create(destPath)
	if err != nil {
		http.Error(w, `{"error":"Failed to save file"}`, http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, `{"error":"Failed to write file"}`, http.StatusInternalServerError)
		return
	}

	// 判斷訊息類型 / Determine message type
	messageType := "FILE"
	lowerExt := strings.ToLower(ext)
	if lowerExt == ".jpg" || lowerExt == ".jpeg" || lowerExt == ".png" || lowerExt == ".gif" || lowerExt == ".webp" {
		messageType = "IMAGE"
	}

	fileURL := fmt.Sprintf("/uploads/messages/%s", fileName)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"fileUrl":     fileURL,
		"fileName":    header.Filename,
		"messageType": messageType,
	})
}

// ========================================
// 檔名清理 / Sanitize Filename
// ========================================

func sanitizeFilename(name string) string {
	// 移除特殊字元 / Remove special characters
	replacer := strings.NewReplacer(
		" ", "_", "/", "_", "\\", "_",
		"..", "_", ":", "_", "*", "_",
		"?", "_", "\"", "_", "<", "_",
		">", "_", "|", "_",
	)
	safe := replacer.Replace(name)
	if len(safe) > 50 {
		safe = safe[:50]
	}
	return safe
}
