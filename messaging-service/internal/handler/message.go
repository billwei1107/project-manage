/**
 * @file message.go
 * @description 訊息 REST Handler / Message REST Handler
 * @description_en Handles message sending, retrieval, and read receipts
 * @description_zh 處理訊息傳送、查詢與已讀回條
 */

package handler

import (
	"encoding/json"
	"log"
	"messaging-service/internal/auth"
	"messaging-service/internal/db"
	"messaging-service/internal/model"
	"messaging-service/internal/ws"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// ========================================
// 取得歷史訊息 / Get Messages
// ========================================

func GetMessages(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	// 從路徑解析 conversationId / Parse conversationId from path
	conversationID := extractConversationID(r.URL.Path)
	if conversationID == "" {
		http.Error(w, `{"error":"Missing conversation ID"}`, http.StatusBadRequest)
		return
	}

	// 驗證成員資格 / Verify membership
	if !isMember(conversationID, user.ID) {
		http.Error(w, `{"error":"Not a member of this conversation"}`, http.StatusForbidden)
		return
	}

	// 分頁 / Pagination
	limit := 50
	offset := 0
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 200 {
			limit = parsed
		}
	}
	if o := r.URL.Query().Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	rows, err := db.DB.Query(`
		SELECT m.id, m.conversation_id, m.sender_id,
			COALESCE(u.name, 'Unknown') as sender_name,
			m.content, m.message_type, m.file_url, m.file_name, m.created_at
		FROM messages m
		LEFT JOIN users u ON u.id::text = m.sender_id::text
		WHERE m.conversation_id = $1
		ORDER BY m.created_at ASC
		LIMIT $2 OFFSET $3
	`, conversationID, limit, offset)
	if err != nil {
		log.Printf("Error querying messages: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var messages []model.Message
	for rows.Next() {
		var msg model.Message
		if err := rows.Scan(
			&msg.ID, &msg.ConversationID, &msg.SenderID, &msg.SenderName,
			&msg.Content, &msg.MessageType, &msg.FileURL, &msg.FileName, &msg.CreatedAt,
		); err != nil {
			log.Printf("Error scanning message: %v", err)
			continue
		}
		messages = append(messages, msg)
	}

	if messages == nil {
		messages = []model.Message{}
	}

	// 更新已讀時間 / Update last_read_at
	_, _ = db.DB.Exec(
		`UPDATE conversation_members SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2`,
		conversationID, user.ID,
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}

// ========================================
// 傳送訊息 / Send Message
// ========================================

func SendMessage(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	conversationID := extractConversationID(r.URL.Path)
	if conversationID == "" {
		http.Error(w, `{"error":"Missing conversation ID"}`, http.StatusBadRequest)
		return
	}

	if !isMember(conversationID, user.ID) {
		http.Error(w, `{"error":"Not a member of this conversation"}`, http.StatusForbidden)
		return
	}

	var req model.SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.MessageType == "" {
		req.MessageType = model.MessageTypeText
	}

	var msg model.Message
	err := db.DB.QueryRow(`
		INSERT INTO messages (conversation_id, sender_id, content, message_type, file_url, file_name)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, conversation_id, sender_id, content, message_type, file_url, file_name, created_at
	`, conversationID, user.ID, req.Content, req.MessageType, req.FileURL, req.FileName,
	).Scan(&msg.ID, &msg.ConversationID, &msg.SenderID, &msg.Content,
		&msg.MessageType, &msg.FileURL, &msg.FileName, &msg.CreatedAt)
	if err != nil {
		log.Printf("Error inserting message: %v", err)
		http.Error(w, `{"error":"Failed to send message"}`, http.StatusInternalServerError)
		return
	}
	msg.SenderName = user.Name

	// 更新對話的 updated_at / Update conversation timestamp
	_, _ = db.DB.Exec(`UPDATE conversations SET updated_at = NOW() WHERE id = $1`, conversationID)

	// 更新發送者的已讀時間 / Update sender's last_read_at
	_, _ = db.DB.Exec(
		`UPDATE conversation_members SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2`,
		conversationID, user.ID,
	)

	// 透過 WebSocket 推送給對話中的所有成員 / Push to all members via WebSocket
	memberIDs := getConversationMemberIDs(conversationID)
	wsMsg := model.WSMessage{
		Type:    "new_message",
		Payload: msg,
	}
	ws.GlobalHub.SendToUsers(memberIDs, wsMsg)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(msg)
}

// ========================================
// 標記已讀 / Mark as Read
// ========================================

func MarkAsRead(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	conversationID := extractConversationID(r.URL.Path)
	_, err := db.DB.Exec(
		`UPDATE conversation_members SET last_read_at = $1 WHERE conversation_id = $2 AND user_id = $3`,
		time.Now(), conversationID, user.ID,
	)
	if err != nil {
		http.Error(w, `{"error":"Failed to mark as read"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

// ========================================
// 取得全域未讀數 / Get Total Unread Count
// ========================================

func GetUnreadCount(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var count int
	err := db.DB.QueryRow(`
		SELECT COALESCE(SUM(sub.cnt), 0) FROM (
			SELECT COUNT(*) as cnt
			FROM messages m
			JOIN conversation_members cm ON cm.conversation_id = m.conversation_id AND cm.user_id = $1
			WHERE m.created_at > COALESCE(cm.last_read_at, '1970-01-01')
			AND m.sender_id != $1
		) sub
	`, user.ID).Scan(&count)
	if err != nil {
		log.Printf("Error counting unread: %v", err)
		count = 0
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"unreadCount": count})
}

// ========================================
// 工具函式 / Utility Functions
// ========================================

func extractConversationID(path string) string {
	// 路徑格式: /conversations/{id}/messages 或 /conversations/{id}/read
	parts := strings.Split(strings.Trim(path, "/"), "/")
	for i, p := range parts {
		if p == "conversations" && i+1 < len(parts) {
			return parts[i+1]
		}
	}
	return ""
}

func isMember(conversationID, userID string) bool {
	var exists bool
	err := db.DB.QueryRow(
		`SELECT EXISTS(SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND user_id = $2)`,
		conversationID, userID,
	).Scan(&exists)
	return err == nil && exists
}

func getConversationMemberIDs(conversationID string) []string {
	rows, err := db.DB.Query(
		`SELECT DISTINCT user_id FROM conversation_members WHERE conversation_id = $1`,
		conversationID,
	)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err == nil {
			ids = append(ids, id)
		}
	}
	return ids
}

// ========================================
// 取得所有使用者列表 / Get All Users (for starting new conversations)
// ========================================

func GetUsers(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	rows, err := db.DB.Query(`SELECT id, name, username, role FROM users WHERE id::text != $1 ORDER BY name`, user.ID)
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch users"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type UserItem struct {
		ID       string  `json:"id"`
		Name     string  `json:"name"`
		Username *string `json:"username"`
		Role     string  `json:"role"`
	}

	var users []UserItem
	for rows.Next() {
		var u UserItem
		if err := rows.Scan(&u.ID, &u.Name, &u.Username, &u.Role); err == nil {
			users = append(users, u)
		}
	}
	if users == nil {
		users = []UserItem{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
