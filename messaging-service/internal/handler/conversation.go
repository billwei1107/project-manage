/**
 * @file conversation.go
 * @description 對話 REST Handler / Conversation REST Handler
 * @description_en Handles conversation CRUD operations
 * @description_zh 處理對話的建立、查詢等操作
 */

package handler

import (
	"encoding/json"
	"log"
	"messaging-service/internal/auth"
	"messaging-service/internal/db"
	"messaging-service/internal/model"
	"net/http"
	"time"
)

// ========================================
// 取得對話列表 / Get Conversation List
// ========================================

func GetConversations(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	query := `
		SELECT c.id, c.name, c.type, c.created_at,
			COALESCE(
				(SELECT COUNT(*) FROM messages m
				 WHERE m.conversation_id = c.id
				 AND m.created_at > COALESCE(cm.last_read_at, '1970-01-01')),
			0) AS unread_count,
			(SELECT m2.content FROM messages m2
			 WHERE m2.conversation_id = c.id
			 ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
			(SELECT m3.created_at FROM messages m3
			 WHERE m3.conversation_id = c.id
			 ORDER BY m3.created_at DESC LIMIT 1) AS last_message_at,
			(SELECT m4.sender_id FROM messages m4
			 WHERE m4.conversation_id = c.id
			 ORDER BY m4.created_at DESC LIMIT 1) AS last_sender_id
		FROM conversations c
		JOIN conversation_members cm ON cm.conversation_id = c.id AND cm.user_id = $1
		ORDER BY COALESCE(
			(SELECT m5.created_at FROM messages m5
			 WHERE m5.conversation_id = c.id
			 ORDER BY m5.created_at DESC LIMIT 1),
			c.created_at
		) DESC
	`

	rows, err := db.DB.Query(query, user.ID)
	if err != nil {
		log.Printf("Error querying conversations: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var conversations []model.ConversationListItem
	for rows.Next() {
		var item model.ConversationListItem
		var createdAt time.Time
		if err := rows.Scan(
			&item.ID, &item.Name, &item.Type, &createdAt,
			&item.UnreadCount, &item.LastMessage, &item.LastMessageAt, &item.LastSenderID,
		); err != nil {
			log.Printf("Error scanning conversation: %v", err)
			continue
		}
		// 取得成員 / Get members
		item.Members = getConversationMembers(item.ID)
		conversations = append(conversations, item)
	}

	if conversations == nil {
		conversations = []model.ConversationListItem{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(conversations)
}

// ========================================
// 建立對話 / Create Conversation
// ========================================

func CreateConversation(w http.ResponseWriter, r *http.Request) {
	user := auth.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req model.CreateConversationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// 一對一：檢查是否已存在 / Direct: check if already exists
	if req.Type == model.ConversationTypeDirect && len(req.MemberIDs) == 1 {
		otherUserID := req.MemberIDs[0]
		existingID := findExistingDirectConversation(user.ID, otherUserID)
		if existingID != "" {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"id": existingID})
			return
		}
	}

	// 確保發起者也被加入成員 / Ensure creator is included
	allMembers := append(req.MemberIDs, user.ID)
	allMembers = uniqueStrings(allMembers)

	tx, err := db.DB.Begin()
	if err != nil {
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	var convID string
	err = tx.QueryRow(
		`INSERT INTO conversations (name, type) VALUES ($1, $2) RETURNING id`,
		req.Name, req.Type,
	).Scan(&convID)
	if err != nil {
		log.Printf("Error creating conversation: %v", err)
		http.Error(w, `{"error":"Failed to create conversation"}`, http.StatusInternalServerError)
		return
	}

	for _, memberID := range allMembers {
		_, err = tx.Exec(
			`INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2)`,
			convID, memberID,
		)
		if err != nil {
			log.Printf("Error adding member: %v", err)
			http.Error(w, `{"error":"Failed to add members"}`, http.StatusInternalServerError)
			return
		}
	}

	if err = tx.Commit(); err != nil {
		http.Error(w, `{"error":"Failed to commit transaction"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": convID})
}

// ========================================
// 工具函式 / Utility Functions
// ========================================

func getConversationMembers(conversationID string) []model.MemberInfo {
	rows, err := db.DB.Query(`
		SELECT cm.user_id, COALESCE(u.name, 'Unknown') as name
		FROM conversation_members cm
		LEFT JOIN users u ON u.id::text = cm.user_id::text
		WHERE cm.conversation_id = $1
	`, conversationID)
	if err != nil {
		return []model.MemberInfo{}
	}
	defer rows.Close()

	var members []model.MemberInfo
	for rows.Next() {
		var m model.MemberInfo
		if err := rows.Scan(&m.UserID, &m.Name); err == nil {
			members = append(members, m)
		}
	}
	return members
}

func findExistingDirectConversation(userA, userB string) string {
	var id string
	err := db.DB.QueryRow(`
		SELECT c.id FROM conversations c
		WHERE c.type = 'DIRECT'
		AND EXISTS (SELECT 1 FROM conversation_members cm1 WHERE cm1.conversation_id = c.id AND cm1.user_id = $1)
		AND EXISTS (SELECT 1 FROM conversation_members cm2 WHERE cm2.conversation_id = c.id AND cm2.user_id = $2)
		AND (SELECT COUNT(*) FROM conversation_members cm3 WHERE cm3.conversation_id = c.id) = 2
		LIMIT 1
	`, userA, userB).Scan(&id)
	if err != nil {
		return ""
	}
	return id
}

func uniqueStrings(input []string) []string {
	seen := make(map[string]bool)
	var result []string
	for _, s := range input {
		if !seen[s] {
			seen[s] = true
			result = append(result, s)
		}
	}
	return result
}
